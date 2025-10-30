import { useState } from "react";
import CreateAdminModal, { CreateAdminData } from "../_components/createAdminModal";
// import { Admin } from "@/types/user";

export default function PlatformAdminsSection() {
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // const { admins, loading, error, refetch } = useAdmins({ adminType: "PLATFORM" });

  // const handleEditAdmin = (admin: Admin) => {
  //   // TODO: Implement edit functionality
  // };

  const handleCreateAdmin = async (data: CreateAdminData) => {
    console.log(data);
    // TODO: Implement admin creation with GraphQL mutation
    setShowModal(false);
    // After successful creation, refetch admins
    // await refetch();
  };

  // if (loading) {
  //   return (
  //     <section className="bg-white border rounded-lg p-4">
  //       <div className="flex items-center justify-center h-20">
  //         <div className="text-gray-500 text-sm">Loading admins...</div>
  //       </div>
  //     </section>
  //   );
  // }

  // if (error) {
  //   return (
  //     <section className="bg-white border rounded-lg p-4">
  //       <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
  //         Error loading admins: {error.message}
  //       </div>
  //     </section>
  //   );
  // }

  // const platformCount = admins.filter((a) => a.adminType === "PLATFORM").length;
  // const businessCount = admins.filter((a) => a.adminType === "BUSINESS").length;
  // const recentAdmins = admins.slice(0, 3); // Show only 3 most recent when collapsed

  return (
    <section className="bg-white border rounded-lg">
      {/* Compact Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Platform Admins
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-gray-600">
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                {/* <span>
                  Total: <strong>{admins.length}</strong>
                </span>
                <span className="text-blue-600">
                  Platform: <strong>{platformCount}</strong>
                </span>
                <span className="text-purple-600">
                  Business: <strong>{businessCount}</strong>
                </span> */}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Admin
          </button>
        </div>
      </div>

      {/* Compact View - Recent Admins */}
      {!isExpanded && (
        <div className="p-4">
          {
            // admins.length
            [0].length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No admins found</p>
            ) : (
              <>
                <div className="space-y-2">
                  {
                    // recentAdmins.map((admin) => (
                    //   <div
                    //     key={admin.id}
                    //     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    //   >
                    //     <div className="flex items-center gap-3">
                    //       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    //         {admin.name.charAt(0).toUpperCase()}
                    //         {admin.lastName?.charAt(0).toUpperCase() || ""}
                    //       </div>
                    //       <div>
                    //         <p className="font-medium text-sm text-gray-900">
                    //           {admin.name} {admin.lastName}
                    //         </p>
                    //         <p className="text-xs text-gray-500">{admin.email}</p>
                    //       </div>
                    //     </div>
                    //     <div className="flex items-center gap-3">
                    //       <span className="text-xs px-2 py-1 bg-white border rounded capitalize">
                    //         {admin.role.replace("_", " ").toLowerCase()}
                    //       </span>
                    //       <span className={`w-2 h-2 rounded-full ${admin.isActive ? "bg-green-500" : "bg-red-500"}`} />
                    //     </div>
                    //   </div>
                    // ))
                  }
                </div>
                {
                  // admins.length > 3 && (
                  //   <button
                  //     onClick={() => setIsExpanded(true)}
                  //     className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  //   >
                  //     {/* View all {admins.length} admins → */}
                  //   </button>
                  // )
                }
              </>
            )
          }
        </div>
      )}

      {/* Expanded View - Full Grid */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* {admins.map((admin) => (
              <AdminCard key={admin.id} admin={admin} onEdit={handleEditAdmin} canEdit />
            ))} */}
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateAdmin}
        adminType="PLATFORM"
      />
    </section>
  );
}
