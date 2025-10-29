import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import { Building2, Calculator, CheckCircle, Shield } from "lucide-react";

type Props = {
  stats: {
    total: number;
    platform: number;
    business: number;
    active: number;
  };
};

export default function StatsSection({ stats }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="small" className="text-gray-600 dark:text-gray-400">
              Total
            </Text>
            <Title variant="h2">{stats.total}</Title>
          </div>
          <Calculator className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="small" className="text-gray-600 dark:text-gray-400">
              Plataforma
            </Text>
            <Title variant="h2">{stats.platform}</Title>
          </div>
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="small" className="text-gray-600 dark:text-gray-400">
              Negocios
            </Text>
            <Title variant="h2">{stats.business}</Title>
          </div>
          <Building2 className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="small" className="text-gray-600 dark:text-gray-400">
              Activos
            </Text>
            <Title variant="h2">{stats.active}</Title>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      </div>
    </section>
  );
}
