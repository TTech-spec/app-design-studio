import { createFileRoute, notFound } from "@tanstack/react-router";
import { tutorById } from "@/lib/academy/data";
import { TutorProfileView } from "@/components/academy/views/tutor-profile";

export const Route = createFileRoute("/student/tutors/$tutorId")({
  loader: ({ params }) => {
    const tutor = tutorById(params.tutorId);
    if (!tutor) throw notFound();
    return { tutor };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.tutor.name ?? "Tutor"} · DarlTech Academy` }],
  }),
  component: TutorPage,
});

function TutorPage() {
  const { tutor } = Route.useLoaderData();
  return <TutorProfileView tutor={tutor} />;
}
