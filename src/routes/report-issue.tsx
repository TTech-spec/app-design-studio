import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, AlertTriangle, Camera, ArrowLeft, Upload, X } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { NIGERIA_STATES } from "@/lib/agricon-data";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/report-issue")({
  head: () => ({ meta: [{ title: "Agricon NG — Report Land Issue" }] }),
  component: ReportIssuePage,
});

function ReportIssuePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, submitLandIssueReport } = useAuth();
  const [landReference, setLandReference] = useState("");
  const [issueType, setIssueType] = useState("boundary_dispute");
  const [description, setDescription] = useState("");
  const [locationState, setLocationState] = useState("Oyo");
  const [locationLga, setLocationLga] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const issueTypes = [
    { value: "boundary_dispute", label: "Boundary Dispute" },
    { value: "encroachment", label: "Land Encroachment" },
    { value: "illegal_activity", label: "Illegal Activity" },
    { value: "environmental", label: "Environmental Issue" },
    { value: "access_blocked", label: "Access Blocked" },
    { value: "other", label: "Other" },
  ];

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      // For now, we'll use a placeholder. In production, this would upload to Supabase storage
      const url = URL.createObjectURL(file);
      setPhotos([...photos, url]);
    } catch (err) {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!landReference || !description || !locationState) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await submitLandIssueReport({
        land_reference: landReference,
        issue_type: issueType,
        description,
        location_state: locationState,
        location_lga: locationLga,
        coordinates,
        photos,
        contact_phone: contactPhone,
        contact_email: contactEmail,
      });
      toast.success("Issue reported successfully!");
      navigate({ to: "/home" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Desktop view
  if (!isMobile) {
    return (
      <DesktopShell title="Report Land Issue" activeNav="home">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#44483d] hover:text-[#154212] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#154212]">Report Land Issue</h1>
                <p className="text-sm text-[#44483d]">Report problems with your land or plot for resolution</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Land/Plot Reference *</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 123, Block A, Ibadan"
                  value={landReference}
                  onChange={(e) => setLandReference(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Issue Type *</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full appearance-none rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                >
                  {issueTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Description *</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#191c18]">State *</label>
                  <select
                    value={locationState}
                    onChange={(e) => setLocationState(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  >
                    {NIGERIA_STATES.map((s) => <option key={s} value={s}>{s} State</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#191c18]">LGA</label>
                  <input
                    type="text"
                    placeholder="e.g. Ibarapa Central"
                    value={locationLga}
                    onChange={(e) => setLocationLga(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">GPS Coordinates (optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#44483d]" />
                  <input
                    type="text"
                    placeholder="e.g. 7.3775, 3.9470"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] pl-11 pr-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#191c18]">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+234..."
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#191c18]">Contact Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Photos (optional)</label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative shrink-0">
                      <img src={photo} alt={`Photo ${i + 1}`} className="h-32 w-32 rounded-2xl object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-destructive text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[#c2c9bb] bg-[#f3f4ed] hover:border-[#154212] transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                    {uploadingPhoto ? (
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#154212] border-t-transparent" />
                    ) : (
                      <Camera className="h-8 w-8 text-[#44483d]" />
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#154212] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f2a20] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-[#c2c9bb] px-6 py-3 text-sm font-semibold text-[#44483d] hover:bg-[#f3f4ed] transition-all"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  // Mobile view
  return (
    <MobileShell standalone title="Report Issue" showBottomNav={false} backTo="/home">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Report Land Issue</p>
          <p className="text-xs text-muted-foreground">Report problems with your land</p>
        </div>
      </div>

      <div className="space-y-4">
        <TextInput label="Land/Plot Reference" placeholder="Plot 123, Block A" value={landReference} onChange={setLandReference} />
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
          >
            {issueTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <TextInput label="Description" placeholder="Describe the issue..." value={description} onChange={setDescription} multiline />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">State</label>
            <select
              value={locationState}
              onChange={(e) => setLocationState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => <option key={s} value={s}>{s} State</option>)}
            </select>
          </div>
          <TextInput label="LGA" placeholder="Ibarapa" value={locationLga} onChange={setLocationLga} />
        </div>

        <TextInput label="GPS Coordinates (optional)" placeholder="7.3775, 3.9470" icon={<MapPin className="h-4 w-4" />} value={coordinates} onChange={setCoordinates} />

        <TextInput label="Contact Phone" type="tel" placeholder="+234..." value={contactPhone} onChange={setContactPhone} />
        <TextInput label="Contact Email" type="email" placeholder="your@email.com" value={contactEmail} onChange={setContactEmail} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Photos (optional)</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative shrink-0">
                <img src={photo} alt={`Photo ${i + 1}`} className="h-24 w-24 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-card hover:border-primary">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              {uploadingPhoto ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground" />
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={handleSubmit} loading={loading}>Submit Report</PrimaryButton>
      </div>
    </MobileShell>
  );
}
