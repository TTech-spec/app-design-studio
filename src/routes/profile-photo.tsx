import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { PrimaryButton, OnboardingProgress } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/profile-photo")({
  head: () => ({ meta: [{ title: "Agricon NG — Profile photo" }] }),
  component: ProfilePhotoPage,
});

function ProfilePhotoPage() {
  const navigate = useNavigate();
  const { profile, uploadAvatar } = useAuth();
  const isMobile = useIsMobile();
  const [preview, setPreview] = useState<string | null>(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Your name";
  const initials = [profile?.first_name?.[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "AK";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!selectedFile) {
      navigate({ to: nextScreen });
      return;
    }
    setLoading(true);
    try {
      await uploadAvatar(selectedFile);
      toast.success("Profile photo saved!");
      navigate({ to: nextScreen });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const nextScreen = profile?.user_type === "distributor" ? "/business-info" : "/farm-info";

  // Desktop view
  if (!isMobile) {
    return (
      <DesktopShell title="Profile Photo" activeNav="profile">
        <div className="max-w-2xl mx-auto p-8">
          <div className="mb-8">
            <Link
              to="/contact-info"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#44483d] hover:text-[#154212] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
            <h1 className="text-2xl font-bold text-[#154212] mb-2">Profile Photo</h1>
            <p className="text-sm text-[#44483d] mb-8">A clear headshot builds trust. Verified farms with photos get 3× more inquiries.</p>

            <div className="flex flex-col items-center py-8">
              <div className="relative">
                {preview ? (
                  <img src={preview} alt="Profile preview" className="h-48 w-48 rounded-full object-cover shadow-glow" />
                ) : (
                  <div className="grid h-48 w-48 place-items-center rounded-full gradient-primary text-white text-6xl font-black shadow-glow">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  aria-label="Change profile photo"
                  className="absolute bottom-2 right-2 grid h-14 w-14 place-items-center rounded-full bg-gold text-gold-foreground shadow-card hover:scale-105 transition-transform"
                >
                  <Camera className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-6 text-lg font-semibold text-[#191c18]">{fullName}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#c2c9bb] bg-[#f3f4ed] p-6 hover:border-[#154212] hover:bg-[#d6e4c8] transition-all"
              >
                <Camera className="h-8 w-8 text-[#154212]" />
                <span className="text-base font-semibold text-[#191c18]">Take photo</span>
              </button>
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#c2c9bb] bg-[#f3f4ed] p-6 hover:border-[#154212] hover:bg-[#d6e4c8] transition-all"
              >
                <Upload className="h-8 w-8 text-[#154212]" />
                <span className="text-base font-semibold text-[#191c18]">Upload</span>
              </button>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile} />
              <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#154212] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f2a20] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save & continue"}
              </button>
              <Link
                to={nextScreen}
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
    <MobileShell standalone title="Profile photo" showBottomNav={false} backTo="/contact-info">
      <OnboardingProgress step={3} />
      <p className="text-sm text-muted-foreground mb-6">A clear headshot builds trust. Verified farms with photos get 3× more inquiries.</p>
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          {preview ? (
            <img src={preview} alt="Profile preview" className="h-40 w-40 rounded-full object-cover shadow-glow" />
          ) : (
            <div className="grid h-40 w-40 place-items-center rounded-full gradient-primary text-white text-5xl font-black shadow-glow">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            aria-label="Change profile photo"
            className="absolute bottom-2 right-2 grid h-12 w-12 place-items-center rounded-full bg-gold text-gold-foreground shadow-card"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold text-foreground">{fullName}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-5 hover:border-primary"
        >
          <Camera className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-foreground">Take photo</span>
        </button>
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-5 hover:border-primary"
        >
          <Upload className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-foreground">Upload</span>
        </button>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile} />
        <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="mt-8 space-y-3">
        <PrimaryButton onClick={handleSave} loading={loading}>Save & continue</PrimaryButton>
        <Link to={nextScreen} className="block text-center text-sm font-semibold text-muted-foreground py-2">Skip for now</Link>
      </div>
    </MobileShell>
  );
}
