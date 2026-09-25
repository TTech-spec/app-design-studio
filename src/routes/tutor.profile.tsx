import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TUTORS } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { textareaCls } from "@/components/academy/auth";
import { btn, Card } from "@/components/academy/ui";
import { TutorProfileView } from "@/components/academy/views/tutor-profile";

export const Route = createFileRoute("/tutor/profile")({
  head: () => ({ meta: [{ title: "My tutor profile · DarlTech Academy" }] }),
  component: TutorProfile,
});

function TutorProfile() {
  const { user, updateUser } = useAcademy();
  const base = TUTORS[0];
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || base.bio);
  const [skills, setSkills] = useState(
    (user?.skills.length ? user.skills : base.skills).join(", "),
  );
  const save = () => {
    updateUser({
      bio: bio.trim(),
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setEditing(false);
    toast.success("Profile saved");
  };
  return (
    <div className="flex flex-col gap-5">
      {editing && (
        <Card>
          <h2 className="mb-3 text-[17px] font-extrabold">Edit profile</h2>
          <div className="flex flex-col gap-3">
            <label htmlFor="tp-bio" className="text-sm font-semibold">
              Bio
            </label>
            <textarea
              id="tp-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={textareaCls}
            />
            <label htmlFor="tp-skills" className="text-sm font-semibold">
              Skills (comma separated)
            </label>
            <input
              id="tp-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="h-12 rounded-xl border border-primary-soft bg-surface px-4 text-[15px] outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <button type="button" onClick={save} disabled={!user} className={btn.primary}>
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className={btn.outline}>
                Cancel
              </button>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground">Sign up as a tutor to save changes.</p>
            )}
          </div>
        </Card>
      )}
      <TutorProfileView tutor={base} own onEdit={() => setEditing(true)} />
    </div>
  );
}
