import { useState } from "react";
import useAdmins from "../_hooks/useAdmins";
import AdminCard from "../_components/adminCard";
import CreateAdminModal, { CreateAdminData } from "../_components/createAdminModal";
import { Admin } from "@/types/user";
import useSessionStore from "@/store/session";

interface AdminWithSeller extends Admin {
  sellerId?: string;
}

export default function BusinessAdminsSection() {
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: currentAdmin } = useSessionStore();

  // Business admins should only see admins from their own seller
  const sellerId = (currentAdmin as AdminWithSeller).sellerId;

  const { admins, loading, error, refetch } = useAdmins({
    adminType: "BUSINESS",
    sellerId: sellerId, // Filter by seller
  });

  const handleEditAdmin = (admin: Admin) => {
    // TODO: Implement edit functionality
    console.log("Edit admin:", admin);
  };

  const handleCreateAdmin = async (data: CreateAdminData) => {
    // TODO: Implement admin creation with GraphQL mutation
    console.log("Create admin for seller:", sellerId, data);
    setShowModal(false);
    // After successful creation, refetch admins
    await refetch();
  };

  if (loading) {
    return (
      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-center h-20">
          <div className="text-gray-500 text-sm">Loading admins...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white border rounded-lg p-4">
        <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
          Error loading admins: {error.message}
        </div>
      </section>
    );
  }

  const activeCount = admins.filter((a) => a.isActive).length;
  const recentAdmins = admins.slice(0, 3); // Show only 3 most recent when collapsed

  return (
    <section className="bg-white border rounded-lg">
      {/* Compact Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Business Admins
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
                <span>
                  Total: <strong>{admins.length}</strong>
                </span>
                <span className="text-green-600">
                  Active: <strong>{activeCount}</strong>
                </span>
                <span className="text-gray-500">
                  Seller: <span className="font-mono text-xs">{sellerId || "N/A"}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Admin
          </button>
        </div>
      </div>

      {/* Compact View - Recent Admins */}
      {!isExpanded && (
        <div className="p-4">
          {admins.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-500 text-sm">No admins found for your business</p>
              <p className="text-gray-400 text-xs mt-1">Create your first admin to get started</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {recentAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                        {admin.name.charAt(0).toUpperCase()}
                        {admin.lastName?.charAt(0).toUpperCase() || ""}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {admin.name} {admin.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 bg-white border rounded capitalize">
                        {admin.role.replace("_", " ").toLowerCase()}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${admin.isActive ? "bg-green-500" : "bg-red-500"}`} />
                    </div>
                  </div>
                ))}
              </div>
              {admins.length > 3 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-full mt-3 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View all {admins.length} admins →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Expanded View - Full Grid */}
      {isExpanded && (
        <div className="p-4">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-blue-700">You can only manage admins for your business (Seller ID: {sellerId}).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {admins.map((admin) => (
              <AdminCard key={admin.id} admin={admin} onEdit={handleEditAdmin} canEdit />
            ))}
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateAdmin}
        adminType="BUSINESS"
        sellerId={sellerId}
      />
    </section>
  );
}
