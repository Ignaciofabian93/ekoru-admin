import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import clsx from "clsx";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMutation, gql } from "@apollo/client";
import { getDeleteMutation, hasDeleteMutation } from "@/graphql/database/mutations";
import useAlert from "@/hooks/useAlert";

type DeleteRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  tableLabel: string;
  selectedRowData: Record<string, unknown> | null;
  onRecordDeleted?: () => void; // Callback to refresh table data
};

export default function DeleteRecordModal({
  isOpen,
  onClose,
  tableName,
  tableLabel,
  selectedRowData,
  onRecordDeleted,
}: DeleteRecordModalProps) {
  const hasMutation = hasDeleteMutation(tableName);
  const { notify, notifyError } = useAlert();

  // Get the mutation for this table
  const mutation = getDeleteMutation(tableName);

  // Create the mutation hook
  const [deleteRecord, { loading }] = useMutation(
    mutation ||
      gql`
        mutation Placeholder {
          __typename
        }
      `,
    {
      onCompleted: (data) => {
        console.log("Delete completed:", data);
        notify("Registro eliminado exitosamente");
        onRecordDeleted?.(); // Refresh table data
        onClose();
      },
      onError: (error) => {
        console.error("Error deleting record:", error);
        notifyError(`Error al eliminar registro: ${error.message}`);
      },
    }
  );

  const handleDelete = async () => {
    if (!hasMutation) {
      notifyError("No hay mutación de eliminación configurada para esta tabla");
      return;
    }

    if (!selectedRowData?.id) {
      notifyError("No se puede eliminar: falta el ID del registro");
      return;
    }

    try {
      await deleteRecord({
        variables: {
          id: selectedRowData.id,
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  // Get display value for the record (try common fields)
  const getDisplayValue = () => {
    if (!selectedRowData) return "este registro";

    const displayFields = ["name", "title", "country", "region", "city", "county", "departmentName", "category"];
    for (const field of displayFields) {
      if (selectedRowData[field]) {
        return `"${selectedRowData[field]}"`;
      }
    }

    return `registro #${selectedRowData.id}`;
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
                "w-full max-w-md",
                "bg-white dark:bg-layout-dark-800",
                "rounded-2xl shadow-2xl",
                "border-2 border-red-200 dark:border-red-900/50",
                "overflow-hidden"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white">
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <Title variant="h4" className="font-bold text-red-900 dark:text-red-200">
                      Eliminar registro
                    </Title>
                    <Text variant="p" className="text-sm text-red-700 dark:text-red-300">
                      {tableLabel}
                    </Text>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {hasMutation ? (
                  <div className="space-y-4">
                    {/* Warning Icon */}
                    <div className="flex justify-center">
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                        <AlertTriangle size={48} className="text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>

                    {/* Warning Message */}
                    <div className="text-center space-y-2">
                      <Title variant="h5" className="font-bold">
                        ¿Estás seguro?
                      </Title>
                      <Text variant="p" className="text-gray-600 dark:text-gray-400">
                        Estás a punto de eliminar {getDisplayValue()} de la tabla{" "}
                        <span className="font-mono font-semibold">{tableName}</span>.
                      </Text>
                      <Text variant="p" className="text-red-600 dark:text-red-400 font-semibold">
                        Esta acción no se puede deshacer.
                      </Text>
                    </div>

                    {/* Record Details */}
                    {selectedRowData && (
                      <div className="bg-gray-50 dark:bg-layout-dark-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                        <Text
                          variant="span"
                          className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block"
                        >
                          Datos del registro:
                        </Text>
                        <div className="space-y-1 text-sm">
                          {Object.entries(selectedRowData)
                            .filter(([key]) => key !== "__typename")
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between gap-2">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{key}:</span>
                                <span className="text-gray-600 dark:text-gray-400 truncate">
                                  {value?.toString() || "-"}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className={clsx(
                          "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                          "bg-gray-100 dark:bg-layout-dark-700",
                          "text-gray-700 dark:text-gray-300",
                          "hover:bg-gray-200 dark:hover:bg-layout-dark-600",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className={clsx(
                          "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                          "bg-gradient-to-r from-red-500 to-red-600",
                          "text-white",
                          "hover:from-red-600 hover:to-red-700",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {loading ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <Title variant="h5" className="mb-2">
                      Configuración no disponible
                    </Title>
                    <Text variant="p" className="text-gray-600 dark:text-gray-400">
                      La tabla <span className="font-mono font-semibold">{tableName}</span> no tiene una mutación
                      GraphQL de eliminación configurada.
                    </Text>
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
