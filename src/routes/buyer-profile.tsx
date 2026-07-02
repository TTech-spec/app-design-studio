import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Upload, MapPin, Phone, Mail } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { NIGERIA_STATES } from "@/lib/agricon-data";

export const Route = createFileRoute("/buyer-profile")({
  head: () => ({ meta: [{ title: "Agricon NG — Buyer profile" }] }),
  component: BuyerProfilePage,
});

function BuyerProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, uploadAvatar } = useAuth();
  const [preview, setPreview] = useState<string | null>(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [firstName, setFirstName] = useState(profile?.first_name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [state, setState] = useState(profile?.state ?? "Lagos");
  const [preferredCrops, setPreferredCrops] = useState<string[]>([]);

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Your name";
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || "AK";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleAvatarUpload() {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      await uploadAvatar(selectedFile);
      toast.success("Profile photo saved!");
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        state,
      });
      toast.success("Profile updated!");
      navigate({ to: "/home" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell standalone title="My profile" showBottomNav={false} backTo="/home">
      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            {preview ? (
              <img src={preview} alt="Profile preview" className="h-32 w-32 rounded-full object-cover shadow-glow" />
            ) : (
              <div className="grid h-32 w-32 place-items-center rounded-full gradient-primary text-white text-4xl font-black shadow-glow">
                {initials}
              </div>
            )}
            <label className="absolute bottom-2 right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-gold text-gold-foreground shadow-card">
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {uploadingImage ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </label>
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">{fullName}</p>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
          {selectedFile && (
            <button
              type="button"
              onClick={handleAvatarUpload}
              className="mt-2 text-sm font-semibold text-primary"
              disabled={uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "Save photo"}
            </button>
          )}
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Personal Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="First name" value={firstName} onChange={setFirstName} />
            <TextInput label="Last name" value={lastName} onChange={setLastName} />
          </div>
          <TextInput 
            label="Phone number" 
            placeholder="+234 806 000 0000" 
            icon={<Phone className="h-4 w-4" />} 
            value={phone} 
            onChange={setPhone} 
          />
          <TextInput 
            label="Email address" 
            placeholder="you@example.com" 
            icon={<Mail className="h-4 w-4" />} 
            value={profile?.email ?? ""} 
            disabled 
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Location</h3>
          <TextInput 
            label="Home address" 
            placeholder="Street, city" 
            icon={<MapPin className="h-4 w-4" />} 
            value={address} 
            onChange={setAddress} 
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s} State</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferences</h3>
          <p className="text-sm text-muted-foreground">Select crops you're interested in buying</p>
          <div className="flex flex-wrap gap-2">
            {["Yam", "Cassava", "Rice", "Maize", "Tomatoes", "Vegetables", "Fruits", "Beans"].map(crop => (
              <button
                key={crop}
                type="button"
                onClick={() => {
                  if (preferredCrops.includes(crop)) {
                    setPreferredCrops(preferredCrops.filter(c => c !== crop));
                  } else {
                    setPreferredCrops([...preferredCrops, crop]);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  preferredCrops.includes(crop) 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card text-foreground border-2 border-border"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <PrimaryButton onClick={handleSave} loading={loading}>Save profile</PrimaryButton>
        </div>
      </div>
    </MobileShell>
  );
}
