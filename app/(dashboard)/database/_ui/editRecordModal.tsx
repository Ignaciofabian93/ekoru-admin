import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import clsx from "clsx";
import { Database, X, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { getTableFieldConfig, hasFieldConfig } from "../_constants/newRecordFields";
import DynamicForm from "./dynamicForm";
import { useMutation, gql } from "@apollo/client";
import { getUpdateMutation, hasUpdateMutation } from "@/graphql/database/mutations";
import useAlert from "@/hooks/useAlert";

type EditRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  tableLabel: string;
  selectedRowData: Record<string, unknown> | null;
  onRecordUpdated?: () => void; // Callback to refresh table data
};

export default function EditRecordModal({
  isOpen,
  onClose,
  tableName,
  tableLabel,
  selectedRowData,
  onRecordUpdated,
}: EditRecordModalProps) {
  const fields = getTableFieldConfig(tableName);
  const hasConfig = hasFieldConfig(tableName);
  const hasMutation = hasUpdateMutation(tableName);
  const { notify, notifyError } = useAlert();

  // Get the mutation for this table
  const mutation = getUpdateMutation(tableName);

  // Create the mutation hook
  const [updateRecord, { loading }] = useMutation(
    mutation ||
      gql`
        mutation Placeholder {
          __typename
        }
      `,
    {
      onCompleted: (data) => {
        console.log("Update completed:", data);
        notify("Registro actualizado exitosamente");
        onRecordUpdated?.(); // Refresh table data
        onClose();
      },
      onError: (error) => {
        console.error("Error updating record:", error);
        notifyError(`Error al actualizar registro: ${error.message}`);
      },
    }
  );

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (!hasMutation) {
      notifyError("No hay mutación de actualización configurada para esta tabla");
      return;
    }

    if (!selectedRowData?.id) {
      notifyError("No se puede actualizar: falta el ID del registro");
      return;
    }

    try {
      // Remove __typename and id from input data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, id, ...inputData } = formData;

      await updateRecord({
        variables: {
          id: selectedRowData.id,
          input: inputData,
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  // Prepare initial values from selected row data
  const initialValues = selectedRowData
    ? Object.fromEntries(Object.entries(selectedRowData).filter(([key]) => key !== "__typename"))
    : {};

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
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                    <Database size={24} />
                  </div>
                  <div>
                    <Title variant="h4" className="font-bold">
                      Editar registro
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
                  <DynamicForm
                    fields={fields}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    isLoading={loading}
                    initialValues={initialValues}
                  />
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <Title variant="h5" className="mb-2">
                      Configuración no disponible
                    </Title>
                    <Text variant="p" className="text-gray-600 dark:text-gray-400">
                      La tabla <span className="font-mono font-semibold">{tableName}</span> aún no tiene campos
                      configurados para editar registros.
                    </Text>
                    {!hasMutation && hasConfig && (
                      <Text variant="p" className="text-orange-600 dark:text-orange-400 mt-2">
                        ⚠️ Tampoco hay una mutación GraphQL de actualización configurada para esta tabla.
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
