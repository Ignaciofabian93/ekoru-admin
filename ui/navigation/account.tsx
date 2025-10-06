import { LogOut, Package, UserRound } from "lucide-react";
import Link from "next/link";
import MainButton from "@/ui/buttons/mainButton";
import useLogout from "@/hooks/useLogout";
import clsx from "clsx";

type Props = {
  isLoggedIn: boolean;
  openProductForm: () => void;
};

const links = [
  { href: "/profile", label: "Mi Perfil" },
  { href: "/profile/orders", label: "Mis Órdenes" },
  { href: "/profile/impact-dashboard", label: "Mi Impacto" },
  { href: "/profile/settings", label: "Ajustes" },
];

const LoggedInMenu = ({ openProductForm }: { openProductForm: () => void }) => {
  const { handleLogout } = useLogout();

  return (
    <div className="flex flex-col items-center space-y-3 px-2 py-2 text-text-800 dark:text-text-100">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "w-full rounded-md block px-4 py-2",
            "text-text-800 dark:text-text-100",
            "hover:bg-navbar-light-200 dark:hover:bg-navbar-light-700/30",
            "transition-colors"
          )}
        >
          {label}
        </Link>
      ))}
      <hr className="my-2 border-neutral/20" />
      <MainButton
        type="button"
        text="Subir Producto"
        variant="primary"
        hasIcon
        icon={Package}
        onClick={openProductForm}
      />
      <MainButton text="Cerrar Sesión" variant="destructive" hasIcon icon={LogOut} onClick={handleLogout} />
    </div>
  );
};

const NotLoggedInMenu = () => {
  return (
    <div className="flex flex-col items-center space-y-3 px-4 py-2">
      <span className="text-center text-base text-text-primary mb-4">
        ¡Bienvenido! Inicia sesión o crea una cuenta para empezar a circular.
      </span>
      <Link href="/login" className="w-full">
        <MainButton text="Iniciar Sesión" variant="primary" hasIcon={false} />
      </Link>
      <Link href="/register" className="w-full">
        <MainButton text="Crear Cuenta" variant="outline" hasIcon={false} />
      </Link>
    </div>
  );
};

export default function AccountMenu({ isLoggedIn, openProductForm }: Props) {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 p-2 text-white hover:text-primary transition-colors duration-200">
        <UserRound className="h-6 w-6" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={clsx(
          "absolute right-0 z-50 mt-2 w-48",
          "bg-white dark:bg-navbar-dark-800",
          "rounded-lg shadow-lg",
          "border border-neutral/20 dark:border-navbar-dark-700",
          "opacity-0 invisible",
          "group-hover:opacity-100 group-hover:visible",
          "transition-all duration-200"
        )}
      >
        <div className="py-2">
          {isLoggedIn ? <LoggedInMenu openProductForm={openProductForm} /> : <NotLoggedInMenu />}
        </div>
      </div>
    </div>
  );
}
