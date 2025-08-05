import Navbar from "../navigation/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen">
      <Navbar />
      <section className="flex w-full h-full p-2 bg-white overflow-y-auto">
        {children}
      </section>
    </main>
  );
}
