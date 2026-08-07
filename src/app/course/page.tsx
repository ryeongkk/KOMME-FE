import { Suspense } from "react";
import { CourseScreen } from "@/components/course/course-screen";

export default function CoursePage() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      <Suspense>
        <CourseScreen />
      </Suspense>
    </main>
  );
}
