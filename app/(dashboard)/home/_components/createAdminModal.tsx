import { useState } from "react";
import { AdminRole } from "@/types/user";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminData) => void;
  adminType: "PLATFORM" | "BUSINESS";
  sellerId?: string; // Required for business admins
}

export interface CreateAdminData {
  email: string;
  name: string;
  lastName: string;
  role: AdminRole;
  adminType: "PLATFORM" | "BUSINESS";
  phone?: string;
  sellerId?: string;
}

export default function CreateAdminModal({ isOpen, onClose, onSubmit, adminType, sellerId }: CreateAdminModalProps) {
  const [formData, setFormData] = useState<CreateAdminData>({
    email: "",
    name: "",
    lastName: "",
    role: AdminRole.ADMIN,
    adminType: adminType,
    phone: "",
    sellerId: sellerId,
  });

  const [selectedAdminType, setSelectedAdminType] = useState<"PLATFORM" | "BUSINESS">(adminType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      adminType: selectedAdminType,
      sellerId: selectedAdminType === "BUSINESS" ? sellerId : undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const isPlatformCreator = adminType === "PLATFORM";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Admin</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Admin Type Selection - Only for Platform Admins */}
            {isPlatformCreator && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedAdminType("PLATFORM")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedAdminType === "PLATFORM"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-lg">Platform Admin</div>
                    <div className="text-sm text-gray-600 mt-1">Full platform access</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAdminType("BUSINESS")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedAdminType === "BUSINESS"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-lg">Business Admin</div>
                    <div className="text-sm text-gray-600 mt-1">Seller-specific access</div>
                  </button>
                </div>
              </div>
            )}

            {/* Business Admin Notice */}
            {!isPlatformCreator && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900">
                  <strong>Business Admin</strong> - This admin will be associated with Seller ID: {sellerId}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={AdminRole.SUPER_ADMIN}>Super Admin - Full Access</option>
                <option value={AdminRole.ADMIN}>Admin - Most Features</option>
                <option value={AdminRole.MODERATOR}>Moderator - Content Moderation</option>
                <option value={AdminRole.SUPPORT}>Support - Customer Support</option>
                <option value={AdminRole.ANALYST}>Analyst - Analytics Only</option>
                <option value={AdminRole.FINANCE}>Finance - Financial Operations</option>
              </select>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
