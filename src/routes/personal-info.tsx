import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, ChevronDown } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput, OnboardingProgress } from "@/components/mobile/ui";
import { NIGERIA_STATES } from "@/lib/agricon-data";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/personal-info")({
  head: () => ({ meta: [{ title: "Agricon NG — Personal information" }] }),
  component: PersonalInfoPage,
});

function PersonalInfoPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [dob, setDob] = useState(profile?.date_of_birth ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "Male");
  const [state, setState] = useState(profile?.state ?? "Oyo");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, date_of_birth: dob || null, gender, state });
      navigate({ to: "/contact-info" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell standalone title="Personal information" showBottomNav={false} backTo="/user-type">
      <OnboardingProgress step={2} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="First name" placeholder="Adekunle" value={firstName} onChange={setFirstName} />
          <TextInput label="Last name" placeholder="Kolawole" value={lastName} onChange={setLastName} />
        </div>
        <TextInput label="Date of birth" placeholder="DD / MM / YYYY" type="date" icon={<Calendar className="h-4 w-4" />} value={dob} onChange={setDob} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {["Male", "Female", "Prefer not to say"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`h-12 rounded-2xl border-2 text-sm font-semibold transition ${gender === g ? "border-primary bg-primary-soft text-forest" : "border-border bg-card"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">State of residence</label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s} State</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}
