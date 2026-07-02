import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileCheck2, FileText, Upload } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, OnboardingProgress } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/document-upload")({
  head: () => ({ meta: [{ title: "Agricon NG — Document upload" }] }),
  component: DocumentUploadPage,
});

type DocType = "government_id" | "proof_of_ownership" | "farm_photo" | "business_registration";

type DocDef = { docType: DocType; title: string; body: string; minCount: number; required: boolean };

const FARMER_DOCS: DocDef[] = [
  { docType: "government_id", title: "Government-issued ID", body: "NIN, driver's license, or international passport", minCount: 1, required: true },
  { docType: "proof_of_ownership", title: "Proof of farm ownership", body: "Land title, C of O, or community letter", minCount: 1, required: true },
  { docType: "farm_photo", title: "Farm photos (min. 3)", body: "Clear photos showing crops and land", minCount: 3, required: true },
];

const DISTRIBUTOR_DOCS: DocDef[] = [
  { docType: "government_id", title: "Government-issued ID", body: "NIN, driver's license, or international passport", minCount: 1, required: true },
  { docType: "business_registration", title: "Business registration (optional)", body: "CAC certificate or business permit", minCount: 1, required: false },
];

function DocumentUploadPage() {
  const navigate = useNavigate();
  const { user, profile, uploadVerificationDocument, submitForVerification } = useAuth();
  const queryClient = useQueryClient();
  const [uploadingType, setUploadingType] = useState<DocType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const docs = profile?.user_type === "distributor" ? DISTRIBUTOR_DOCS : FARMER_DOCS;

  const { data: uploaded } = useQuery({
    queryKey: ["verification-documents", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_documents")
        .select("doc_type, file_path")
        .eq("user_id", user!.id);
      if (error) throw error;
      const counts: Record<string, { count: number; lastFile: string }> = {};
      for (const row of data ?? []) {
        const entry = counts[row.doc_type] ?? { count: 0, lastFile: "" };
        entry.count += 1;
        entry.lastFile = row.file_path.split("/").pop() ?? row.file_path;
        counts[row.doc_type] = entry;
      }
      return counts;
    },
  });

  async function handleFile(doc: DocDef, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingType(doc.docType);
    try {
      await uploadVerificationDocument(doc.docType, file);
      await queryClient.invalidateQueries({ queryKey: ["verification-documents", user?.id] });
      toast.success(`${doc.title} uploaded`);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setUploadingType(null);
    }
  }

  const allRequiredMet = docs.every((d) => !d.required || (uploaded?.[d.docType]?.count ?? 0) >= d.minCount);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitForVerification();
      navigate({ to: "/verification-submitted" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MobileShell standalone title="Document upload" showBottomNav={false} backTo={profile?.user_type === "distributor" ? "/business-info" : "/farm-info"}>
      <OnboardingProgress step={5} />
      <p className="text-sm text-muted-foreground mb-6">Upload the following to complete verification. Documents are reviewed within 24-48 hours.</p>
      <div className="space-y-3">
        {docs.map((d) => {
          const count = uploaded?.[d.docType]?.count ?? 0;
          const lastFile = uploaded?.[d.docType]?.lastFile;
          const status: "uploaded" | "progress" | "empty" = count >= d.minCount ? "uploaded" : count > 0 ? "progress" : "empty";
          const pct = Math.min(100, Math.round((count / d.minCount) * 100));
          const isUploading = uploadingType === d.docType;
          return (
            <div key={d.docType} className="rounded-2xl border-2 border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${status === "uploaded" ? "bg-primary-soft text-primary" : status === "progress" ? "bg-gold-soft text-gold-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {status === "uploaded" ? <FileCheck2 className="h-5 w-5" /> : status === "progress" ? <Upload className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground">{d.title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{d.body}</p>
                  {status === "uploaded" && lastFile && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                      <CheckCircle2 className="h-3 w-3" /> {lastFile}
                    </div>
                  )}
                  {status === "progress" && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">{count}/{d.minCount} uploaded</span><span className="font-semibold text-gold-foreground">{pct}%</span></div>
                      <div className="h-1.5 rounded-full bg-border"><div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} /></div>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputs.current[d.docType]?.click()}
                    className="mt-3 text-xs font-semibold text-primary disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : status === "empty" ? "Upload document →" : count < d.minCount ? "Upload another →" : "Update"}
                  </button>
                  <input
                    ref={(el) => { fileInputs.current[d.docType] = el; }}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFile(d, e)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleSubmit} disabled={!allRequiredMet} loading={submitting}>Submit for verification</PrimaryButton>
      </div>
    </MobileShell>
  );
}
