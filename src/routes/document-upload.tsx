import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileCheck2, FileText, Upload, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { PrimaryButton, OnboardingProgress } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
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

  // Desktop view
  if (!isMobile) {
    return (
      <DesktopShell title="Document Upload" activeNav="profile">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <Link
              to={profile?.user_type === "distributor" ? "/business-info" : "/farm-info"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#44483d] hover:text-[#154212] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
            <h1 className="text-2xl font-bold text-[#154212] mb-2">Document Upload</h1>
            <p className="text-sm text-[#44483d] mb-8">Upload the following to complete verification. Documents are reviewed within 24-48 hours.</p>

            <div className="space-y-4">
              {docs.map((d) => {
                const count = uploaded?.[d.docType]?.count ?? 0;
                const lastFile = uploaded?.[d.docType]?.lastFile;
                const status: "uploaded" | "progress" | "empty" = count >= d.minCount ? "uploaded" : count > 0 ? "progress" : "empty";
                const pct = Math.min(100, Math.round((count / d.minCount) * 100));
                const isUploading = uploadingType === d.docType;
                return (
                  <div key={d.docType} className="rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] p-6">
                    <div className="flex items-start gap-4">
                      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${status === "uploaded" ? "bg-[#d6e4c8] text-[#154212]" : status === "progress" ? "bg-[#f3f4ed] text-[#154212]" : "bg-[#e7e9e1] text-[#44483d]"}`}>
                        {status === "uploaded" ? <FileCheck2 className="h-6 w-6" /> : status === "progress" ? <Upload className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-[#191c18]">{d.title}</h4>
                        <p className="mt-1 text-sm text-[#44483d]">{d.body}</p>
                        {status === "uploaded" && lastFile && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#d6e4c8] px-3 py-1.5 text-xs font-semibold text-[#154212]">
                            <CheckCircle2 className="h-4 w-4" /> {lastFile}
                          </div>
                        )}
                        {status === "progress" && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-[#44483d]">{count}/{d.minCount} uploaded</span><span className="font-semibold text-[#154212]">{pct}%</span></div>
                            <div className="h-2 rounded-full bg-[#c2c9bb]"><div className="h-full rounded-full bg-[#154212]" style={{ width: `${pct}%` }} /></div>
                          </div>
                        )}
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => fileInputs.current[d.docType]?.click()}
                          className="mt-4 text-sm font-semibold text-[#154212] disabled:opacity-50 hover:underline"
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

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!allRequiredMet}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#154212] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f2a20] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit for verification"}
              </button>
              <Link
                to="/verification-submitted"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-[#c2c9bb] px-6 py-3 text-sm font-semibold text-[#44483d] hover:bg-[#f3f4ed] transition-all"
              >
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  // Mobile view
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
