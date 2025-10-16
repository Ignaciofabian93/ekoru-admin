import RegularButton from "../buttons/regularButton";
import Select from "../inputs/select";
import { Text } from "../text/text";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage?: (pageSize: number) => void;
  itemsPerPage?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  setItemsPerPage,
  itemsPerPage,
}: PaginationProps) {
  const rowsOptions = [10, 25, 50, 100].map((num) => ({ label: num.toString(), value: num }));
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Text variant="span">Filas:</Text>
          <Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage?.(e as number)}
            options={rowsOptions}
            size="lg"
            hasIcon={false}
            dropdownDirection="up"
            searchEnabled={false}
          />
        </div>
        <div className="flex items-center gap-2">
          <RegularButton
            text="Anterior"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            size="sm"
          />
          <RegularButton
            text="Siguiente"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
