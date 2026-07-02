import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput, OnboardingProgress } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/contact-info")({
  head: () => ({ meta: [{ title: "Agricon NG — Contact information" }] }),
  component: ContactInfoPage,
});

function ContactInfoPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [loading, setLoading] = useState(false);
  const email = profile?.email ?? user?.email ?? "";

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({ phone, whatsapp: whatsapp || phone, address });
      navigate({ to: "/profile-photo" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell standalone title="Contact information" showBottomNav={false} backTo="/personal-info">
      <OnboardingProgress step={2} />
      <p className="text-sm text-muted-foreground mb-6">How can we and other Agricon users reach you?</p>
      <div className="space-y-4">
        <TextInput label="Primary phone" placeholder="+234 806 000 0000" icon={<Phone className="h-4 w-4" />} value={phone} onChange={setPhone} />
        <TextInput label="WhatsApp number" placeholder="Same as phone" icon={<MessageCircle className="h-4 w-4" />} hint="Buyers often prefer WhatsApp — highly recommended." value={whatsapp} onChange={setWhatsapp} />
        <TextInput label="Email address" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} disabled />
        <TextInput label="Home address" placeholder="Street, city" icon={<MapPin className="h-4 w-4" />} value={address} onChange={setAddress} />
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}
