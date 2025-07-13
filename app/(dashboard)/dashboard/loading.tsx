import { DashboardSkeleton } from "@/components/dashboard/skeletons";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-full p-4">
      <DashboardSkeleton />
    </div>
  );
}
