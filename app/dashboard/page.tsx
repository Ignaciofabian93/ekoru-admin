"use client";
import MainLayout from "@/ui/layout/mainLayout";
import {
  BarChart,
  LineChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  Area,
} from "recharts";

export default function DashboardPage() {
  // Example data
  const data = [
    { name: "Jan", users: 400, sales: 240, exchanges: 100 },
    { name: "Feb", users: 300, sales: 139, exchanges: 80 },
    { name: "Mar", users: 200, sales: 980, exchanges: 120 },
    { name: "Apr", users: 278, sales: 390, exchanges: 90 },
    { name: "May", users: 189, sales: 480, exchanges: 70 },
    { name: "Jun", users: 239, sales: 380, exchanges: 110 },
    { name: "Jul", users: 349, sales: 430, exchanges: 130 },
  ];

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {/* Users Registered Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Users Registered
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="users" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Number of Sales Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Number of Sales
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Number of Exchanges Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Number of Exchanges
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="exchanges"
                stroke="#f59e42"
                fill="#f59e42"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
}
