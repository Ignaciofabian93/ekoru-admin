import { Admin } from "@/types/user";

interface AdminCardProps {
  admin: Admin;
  onEdit?: (admin: Admin) => void;
  canEdit?: boolean;
}

// function formatLastLogin(lastLoginAt?: string): string {
//   if (!lastLoginAt) return "Never";

//   const now = new Date();
//   const loginDate = new Date(lastLoginAt);
//   const diffMs = now.getTime() - loginDate.getTime();
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMins / 60);
//   const diffDays = Math.floor(diffHours / 24);

//   if (diffMins < 1) return "Just now";
//   if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
//   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//   if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

//   return loginDate.toLocaleDateString();
// }

export default function AdminCard({ admin, onEdit, canEdit = false }: AdminCardProps) {
  const lastLogin = "";

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {admin.name.charAt(0).toUpperCase()}
              {admin.lastName?.charAt(0).toUpperCase() || ""}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {admin.name} {admin.lastName}
              </h3>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-medium capitalize">{admin.role.replace("_", " ").toLowerCase()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium capitalize">{admin.adminType.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  admin.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {admin.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-sm">{lastLogin}</p>
            </div>
          </div>
        </div>

        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(admin)}
            className="ml-4 px-3 py-1 text-sm border rounded hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
