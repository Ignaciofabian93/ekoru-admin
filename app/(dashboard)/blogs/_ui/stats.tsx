import { BlogPost } from "@/types/blog";
import { Text } from "@/ui/text/text";
import { CheckCircle, FileText, LucideIcon, XCircle } from "lucide-react";
import { motion } from "motion/react";
import clsx from "clsx";

type Props = {
  posts: BlogPost[];
};

export default function StatsSection({ posts }: Props) {
  // Stats
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.isPublished).length,
    draft: posts.filter((p) => !p.isPublished).length,
  };
  const StatCard = ({
    title,
    value,
    icon,
    iconClassName,
  }: {
    title: string;
    value: number;
    icon: LucideIcon;
    iconClassName: string;
  }) => {
    const Icon = icon;
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={clsx(
          "bg-white",
          "dark:bg-stone-800",
          "rounded-lg shadow",
          "p-6",
          "border border-gray-100 dark:border-stone-600"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <Text variant="label" className="mb-1">
              {title}
            </Text>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{value}</p>
          </div>
          <div className={clsx("p-3 rounded-lg", iconClassName)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard title="Total" value={stats.total} icon={FileText} iconClassName="text-blue-800 bg-blue-200" />

      <StatCard
        title="Publicado"
        value={stats.published}
        icon={CheckCircle}
        iconClassName="text-lime-800 bg-lime-200"
      />

      <StatCard title="Borrador" value={stats.draft} icon={XCircle} iconClassName="text-gray-800 bg-gray-200" />
    </section>
  );
}
