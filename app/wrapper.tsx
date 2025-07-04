import Navbar from "@/components/navbar";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-8">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 py-8 mt-4">
        {children}
      </div>
    </main>
  );
}
