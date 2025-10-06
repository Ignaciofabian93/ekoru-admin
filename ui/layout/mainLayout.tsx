import Footer from "../footer/footer";
import Navbar from "../navigation/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen h-full bg-layout-light-50 dark:bg-layout-dark-900/40 transition-colors duration-300">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
