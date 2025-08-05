/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/ui/layout/mainLayout";
import useCategories from "@/hooks/useCategories";
import useUsers from "@/hooks/useUsers";

// List of tables/models from your Prisma schema
const databaseTableOptions = [
  { label: "Admin", value: "admin" },
  { label: "Chat", value: "chat" },
  { label: "City", value: "city" },
  { label: "Co2ImpactMessage", value: "co2ImpactMessage" },
  { label: "Country", value: "country" },
  { label: "County", value: "county" },
  { label: "Department", value: "department" },
  { label: "DepartmentCategory", value: "departmentCategory" },
  { label: "Exchange", value: "exchange" },
  { label: "Match", value: "match" },
  { label: "MaterialImpactEstimate", value: "materialImpactEstimate" },
  { label: "Message", value: "message" },
  { label: "Order", value: "order" },
  { label: "OrderItem", value: "orderItem" },
  { label: "Product", value: "product" },
  { label: "ProductCategory", value: "productCategory" },
  { label: "ProductComment", value: "productComment" },
  { label: "ProductLike", value: "productLike" },
  { label: "Region", value: "region" },
  { label: "Session", value: "session" },
  { label: "ShippingStatus", value: "shippingStatus" },
  { label: "Story", value: "story" },
  { label: "Transaction", value: "transaction" },
  { label: "User", value: "user" },
  { label: "UserCategory", value: "userCategory" },
  { label: "WaterImpactMessage", value: "waterImpactMessage" },
];

// Dummy field definitions for each table (replace with dynamic introspection or import from types)
const tableFields: Record<string, string[]> = {
  admin: ["id", "email", "name", "createdAt", "updatedAt"],
  chat: [
    "id",
    "senderId",
    "receiverId",
    "productId",
    "isExchange",
    "createdAt",
  ],
  city: ["id", "city", "regionId"],
  co2ImpactMessage: ["id", "min", "max", "message1", "message2", "message3"],
  country: ["id", "country"],
  county: ["id", "county", "cityId"],
  department: ["id", "departmentName"],
  departmentCategory: ["id", "departmentCategoryName", "departmentId"],
  exchange: [
    "id",
    "transactionId",
    "offeredProductId",
    "requestedProductId",
    "status",
    "notes",
    "createdAt",
    "completedAt",
  ],
  match: ["id", "senderId", "receiverId", "createdAt", "isMatched"],
  materialImpactEstimate: [
    "id",
    "materialType",
    "estimatedCo2SavingsKG",
    "estimatedWaterSavingsLT",
  ],
  message: ["id", "chatId", "senderId", "content", "createdAt"],
  order: ["id", "userId", "createdAt", "shippingStatusId"],
  orderItem: ["id", "orderId", "productId", "quantity"],
  product: [
    "id",
    "sku",
    "barcode",
    "color",
    "brand",
    "name",
    "description",
    "price",
    "images",
    "hasOffer",
    "offerPrice",
    "stock",
    "isExchangeable",
    "isActive",
    "ratings",
    "ratingCount",
    "reviewsNumber",
    "userId",
    "createdAt",
    "updatedAt",
    "productCategoryId",
    "interests",
  ],
  productCategory: [
    "id",
    "productCategoryName",
    "departmentCategoryId",
    "keywords",
    "averageWeight",
    "size",
    "weightUnit",
  ],
  productComment: ["id", "comment", "productId", "userId"],
  productLike: ["id", "productId", "userId"],
  region: ["id", "region", "countryId"],
  session: ["id", "userId", "token", "createdAt", "expiresAt"],
  shippingStatus: ["id", "status"],
  story: ["id", "title", "description", "images", "userId"],
  transaction: ["id", "kind", "pointsCollected", "createdAt", "userId"],
  user: [
    "id",
    "name",
    "surnames",
    "email",
    "businessName",
    "profileImage",
    "birthday",
    "phone",
    "address",
    "isCompany",
    "accountType",
    "points",
    "createdAt",
    "updatedAt",
    "regionId",
    "countyId",
    "cityId",
    "countryId",
    "userCategoryId",
    "preferredContactMethod",
    "coverImage",
  ],
  userCategory: [
    "id",
    "name",
    "level",
    "categoryDiscountAmount",
    "pointsThreshold",
  ],
  waterImpactMessage: ["id", "min", "max", "message1", "message2", "message3"],
};

export default function DatabasePage() {
  const [selectedTable, setSelectedTable] = useState(
    databaseTableOptions[0].value
  );
  const [tableData, setTableData] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fields = tableFields[selectedTable] || [];

  // Prepare hooks
  const categories = useCategories();
  const users = useUsers();

  // Map table to fetch function and data
  const tableFetchMap: Record<string, { fetch?: () => void; data: unknown[] }> =
    {
      department: {
        fetch: categories.Departments,
        data: categories.departments,
      },
      departmentCategory: {
        fetch: categories.DepartmentCategories,
        data: categories.departmentCategories,
      },
      productCategory: {
        fetch: categories.ProductCategories,
        data: categories.productCategories,
      },
      user: { fetch: users.Users, data: users.users },
      userCategory: { fetch: users.UserCategories, data: users.userCategories },
      // Add more mappings as needed
    };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchFn = tableFetchMap[selectedTable]?.fetch;
        if (fetchFn) {
          await fetchFn();
        }
        console.log(`Fetching data for ${selectedTable}...`);
        console.log(`Data:`, tableFetchMap[selectedTable]?.data);

        // Always set data, even if no fetch function
        setTableData(tableFetchMap[selectedTable]?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedTable]);

  return (
    <MainLayout>
      <div className="w-full min-h-screen flex flex-col items-center justify-start px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-8 flex items-center justify-between min-w-[700px] w-full max-w-[700px] mx-auto">
            <div className="text-2xl font-bold text-gray-900 mb-0 mr-4">
              Administración de Base de Datos
            </div>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium shadow"
            >
              {databaseTableOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                Loading...
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {fields.map((field) => (
                      <th
                        key={field}
                        className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {field}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={fields.length + 1}
                        className="text-center py-8 text-gray-400"
                      >
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    tableData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        {fields.map((field) => (
                          <td
                            key={field}
                            className="px-4 py-2 text-sm text-gray-800"
                          >
                            {row[field]}
                          </td>
                        ))}
                        <td className="px-4 py-2 flex gap-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-600 transition">
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-600 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
            <div className="mt-6 flex justify-end">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-700 transition">
                Create New
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
