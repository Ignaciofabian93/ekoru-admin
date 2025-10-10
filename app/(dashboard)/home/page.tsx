"use client";
import useAdminType from "@/hooks/useAdminType";
import MainLayout from "@/ui/layout/mainLayout";
import PlatformAdminsSection from "./_ui/platformAdmins";
import BusinessAdminsSection from "./_ui/businessAdmins";
import SummarySection from "./_ui/summary";

export default function HomePage() {
  const { isPlatformAdmin } = useAdminType();

  const AdminsSection = isPlatformAdmin ? <PlatformAdminsSection /> : <BusinessAdminsSection />;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Summary/Dashboard Cards at the top */}
        <SummarySection />

        {/* Collapsible Admin Management Section */}
        {AdminsSection}
      </div>
    </MainLayout>
  );
}
