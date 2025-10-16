import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import clsx from "clsx";
import { Database, X, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { getTableFieldConfig, hasFieldConfig } from "../_constants/newRecordFields";
import DynamicForm from "./dynamicForm";
import { useMutation, gql } from "@apollo/client";
import { getCreateMutation, hasCreateMutation } from "@/graphql/database/mutations";
import useAlert from "@/hooks/useAlert";

type NewRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  tableLabel: string;
  data: Record<string, unknown>[];
  columns: string[];
  onRecordCreated?: () => void; // Callback to refresh table data
};

export default function NewRecordModal({
  isOpen,
  onClose,
  tableName,
  tableLabel,
  onRecordCreated,
}: NewRecordModalProps) {
  const fields = getTableFieldConfig(tableName);
  const hasConfig = hasFieldConfig(tableName);
  const hasMutation = hasCreateMutation(tableName);
  const { notify, notifyError } = useAlert();

  // Get the mutation for this table
  const mutation = getCreateMutation(tableName);
  console.log("MUTATION:", mutation);

  // Create the mutation hook
  const [createRecord, { loading }] = useMutation(
    mutation ||
      gql`
        mutation Placeholder {
          __typename
        }
      `,
    {
      onCompleted: (data) => {
        console.log("Record created successfully:", data);
        notify("Registro creado exitosamente");
        onRecordCreated?.(); // Refresh table data
        onClose();
      },
      onError: (error) => {
        console.error("Error creating record:", error);
        notifyError(`Error al crear registro: ${error.message}`);
      },
    }
  );

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (!hasMutation) {
      notifyError("No hay mutación configurada para esta tabla");
      return;
    }

    try {
      await createRecord({
        variables: {
          input: formData,
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={clsx(
                "w-full max-w-2xl",
                "bg-white dark:bg-layout-dark-800",
                "rounded-2xl shadow-2xl",
                "border-2 border-layout-light-200 dark:border-layout-dark-700",
                "overflow-hidden"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-layout-light-200 dark:border-layout-dark-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-lime-500 to-teal-600 rounded-lg text-white">
                    <Database size={24} />
                  </div>
                  <div>
                    <Title variant="h4" className="font-bold">
                      Nuevo registro
                    </Title>
                    <Text variant="p" className="text-sm">
                      {tableLabel}
                    </Text>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-layout-dark-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {hasConfig ? (
                  <DynamicForm fields={fields} onSubmit={handleSubmit} onCancel={onClose} isLoading={loading} />
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <Title variant="h5" className="mb-2">
                      Configuración no disponible
                    </Title>
                    <Text variant="p" className="text-gray-600 dark:text-gray-400">
                      La tabla <span className="font-mono font-semibold">{tableName}</span> aún no tiene campos
                      configurados para crear nuevos registros.
                    </Text>
                    {!hasMutation && hasConfig && (
                      <Text variant="p" className="text-orange-600 dark:text-orange-400 mt-2">
                        ⚠️ Tampoco hay una mutación GraphQL configurada para esta tabla.
                      </Text>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
