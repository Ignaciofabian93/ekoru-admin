"use client";
import { Shield, Building2 } from "lucide-react";
import MainLayout from "@/ui/layout/mainLayout";
import clsx from "clsx";
import ProfileHeader from "./_ui/header";
import useAdmin from "./_hooks/useAdmin";
import PersonalInformation from "./_ui/personalInformation";
import RoleAndPermissions from "./_ui/permissions";

export default function ProfilePage() {
  const {
    isEditing,
    setIsEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSave,
    handleCancel,
    data,
    isPlatformAdmin,
    loading,
    countries,
    regions,
    cities,
    counties,
  } = useAdmin();

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <ProfileHeader
          isEditing={isEditing}
          handleCancel={handleCancel}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
          loading={loading}
        />
        {/* Admin Type Badge */}
        <section className="flex items-center gap-2">
          <div
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
              isPlatformAdmin
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            )}
          >
            {isPlatformAdmin ? <Shield size={16} /> : <Building2 size={16} />}
            {isPlatformAdmin ? "Administrador EKORU" : "Administrador de Negocio"}
          </div>
        </section>

        <div className="flex flex-col space-y-6">
          {/* Personal Information - Left Column */}
          <PersonalInformation
            isEditing={isEditing}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            data={data}
            countries={countries}
            regions={regions}
            cities={cities}
            counties={counties}
          />
          <div className="flex-1 space-y-6">
            {/* Role & Permissions */}
            <RoleAndPermissions data={data} isPlatformAdmin={isPlatformAdmin} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
