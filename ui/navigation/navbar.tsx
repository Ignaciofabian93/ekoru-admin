"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Subheader from "./subheader";
import useSessionStore from "@/store/session";
import AccountMenu from "./account";
import SideMobileMenu from "./sideMobileMenu";
import clsx from "clsx";
import Input from "../inputs/input";
import Modal from "../modals/modal";
import ProductForm from "../forms/product";
import MainButton from "../buttons/mainButton";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data } = useSessionStore();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const closeProductForm = () => setIsProductFormOpen(false);
  const openProductForm = () => setIsProductFormOpen(true);

  const handleSubmit = async () => {};

  // Handle escape key to close mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={clsx(
          "bg-gradient-to-r from-navbar-light-950 via-navbar-light-600 to-navbar-light-950",
          "dark:from-navbar-dark-950 dark:via-navbar-dark-700 dark:to-navbar-dark-950",
          "shadow-md border-b border-neutral/20 dark:border-navbar-dark-800",
          "sticky top-0 z-50"
        )}
        onKeyDown={handleKeyDown}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          role="navigation"
          aria-label="Navegación principal de EKORU"
        >
          {/* Main Navigation */}
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/feed"
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
                aria-label="Ir a la página principal de EKORU"
              >
                <Image
                  src="/brand/logo.webp"
                  alt="Logo de EKORU"
                  width={100}
                  height={50}
                  className="h-full max-h-[50px] w-auto drop-shadow-xs drop-shadow-slate-900/20"
                />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8" role="search">
              <Input
                id="desktop-search"
                name="desktop-search"
                type="search"
                placeholder="Buscar en EKORU..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                icon={Search}
                className="m-0"
                hasIcon={true}
              />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2" role="toolbar" aria-label="Acciones del usuario">
              {/* Favorites */}
              <Link
                href="/profile/favorites"
                className="p-2 text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
                aria-label="Ir a favoritos"
                title="Favoritos"
              >
                <Heart className="h-6 w-6" aria-hidden="true" />
              </Link>

              {/* Shopping Cart */}
              {/* Change back to Link when enabling Cart */}
              <div
                // href="/cart"
                // className="relative p-2 text-white hover:text-primary transition-colors duration-200"
                className="relative p-2 text-white opacity-50"
                aria-label="Carrito de compras (próximamente disponible)"
                title="Carrito de compras - Próximamente"
                role="button"
                tabIndex={-1}
                aria-disabled="true"
              >
                <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                {/* <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span> */}
              </div>

              {/* User Account */}
              <AccountMenu isLoggedIn={!!data?.id} openProductForm={openProductForm} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
                aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                title={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4" role="search">
            <Input
              id="mobile-search"
              name="mobile-search"
              type="search"
              placeholder="Buscar en EKORU..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              icon={Search}
              className="m-0"
              hasIcon={true}
            />
          </div>
        </nav>
        <Modal isOpen={isProductFormOpen} onClose={closeProductForm} title="Subir Producto" size="lg">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-6"
          >
            <ProductForm onSubmit={handleSubmit} mode="create" />
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200"
            >
              <MainButton
                text="Cancelar"
                onClick={closeProductForm}
                disabled={false}
                variant="outline"
                hasIcon={false}
              />
              <MainButton
                text={"Actualizar Perfil"}
                variant="primary"
                type="submit"
                hasIcon
                icon={Save}
                onClick={handleSubmit}
              />
            </motion.div>
          </motion.div>
        </Modal>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            aria-describedby="mobile-menu-description"
          >
            {/* Overlay Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú de navegación"
            />

            {/* Slide-in Menu */}
            <SideMobileMenu closeMobileMenu={closeMobileMenu} isLoggedIn={!!data?.id} data={data ?? null} />
          </div>
        )}
      </AnimatePresence>

      <Subheader />
    </>
  );
}
