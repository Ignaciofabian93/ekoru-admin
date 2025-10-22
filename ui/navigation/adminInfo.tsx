"use client";
import { Text } from "../text/text";
import { Title } from "../text/title";
import { useTheme } from "@/providers/theme";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import useSessionStore from "@/store/session";
import clsx from "clsx";

export default function AdminInfo() {
  const { data } = useSessionStore();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="mb-6 pb-4 w-full border-b border-layout-light-300 dark:border-layout-dark-700 flex items-center justify-between">
      <div className="flex flex-col">
        <Title variant="h4" className="font-bold">
          {data.name} {data.lastName ?? ""}
        </Title>
        <Text variant="span" className="font-semibold">
          {data.email}
        </Text>
      </div>

      {/* Animated Theme Toggle Switch */}
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={clsx(
          "relative w-11 h-6 rounded-full p-0.5",
          "transition-colors duration-300",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          isDark
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 focus:ring-indigo-500"
            : "bg-gradient-to-r from-amber-400 to-orange-500 focus:ring-amber-500"
        )}
        whileTap={{ scale: 0.95 }}
      >
        {/* Toggle Circle with Icon */}
        <motion.div
          className={clsx("w-5 h-5 rounded-full flex items-center justify-center", "bg-white shadow-md")}
          animate={{
            x: isDark ? 20 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? 0 : 180,
              scale: isDark ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Moon size={11} className="text-indigo-600" /> : <Sun size={11} className="text-amber-500" />}
          </motion.div>
        </motion.div>

        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
          <motion.div
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={9} className="text-white" />
          </motion.div>
          <motion.div
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={9} className="text-white" />
          </motion.div>
        </div>
      </motion.button>
    </nav>
  );
}
