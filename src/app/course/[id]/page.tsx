import { CourseDetailScreen } from "@/components/course/course-detail-screen";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <CourseDetailScreen courseId={id} />
    </main>
  );
}
