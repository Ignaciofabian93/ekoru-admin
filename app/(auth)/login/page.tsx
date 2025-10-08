"use client";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import { validateEmail } from "@/utils/regexValidations";
import Image from "next/image";
import Input from "@/ui/inputs/input";
import MainButton from "@/ui/buttons/mainButton";
import useLogin from "./_hooks/useLogin";

export default function LoginPage() {
  const { formData, showPassword, isLoading, togglePasswordVisibility, handleFormData, handleSubmit } = useLogin();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo/Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-auto h-[80px] rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Image src={"/brand/logo.webp"} alt="EKORU" width={800} height={400} className="w-auto h-full" priority />
          </div>
          <Title variant="h2" className="font-bold mb-2">
            Panel de administración
          </Title>
          <Text variant="p">Ingresa a tu cuenta</Text>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-4 py-6">
            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <Input
                name="email"
                label="Correo Electrónico"
                value={formData.email}
                onChange={handleFormData}
                type="email"
                icon={Mail}
                placeholder="Ingresa tu correo electrónico"
                minLength={10}
                maxLength={100}
                isInvalid={formData.email.length > 0 && !validateEmail(formData.email)}
                errorMessage="Por favor, ingresa un correo electrónico válido."
              />

              {/* Password Field */}
              <Input
                name="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleFormData}
                type="password"
                togglePasswordVisibility={togglePasswordVisibility}
                showPassword={showPassword}
                icon={Lock}
              />
            </form>

            {/* Submit Button */}
            <div className="mt-8">
              <MainButton
                type="submit"
                form="login-form"
                isLoading={isLoading}
                loadingText="Iniciando sesión..."
                text="Entrar"
                hasIcon
                icon={ArrowRight}
                variant="primary"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
