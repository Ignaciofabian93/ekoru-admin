/**
 * Import utilities for database tables
 * Handles importing data from Excel files
 */

import * as XLSX from "xlsx";

export interface ImportResult {
  success: boolean;
  data?: Record<string, unknown>[];
  errors?: string[];
  rowCount?: number;
}

export interface ImportValidation {
  requiredColumns?: string[];
  columnTypes?: Record<string, "string" | "number" | "boolean" | "date" | "email">;
  customValidators?: Record<string, (value: unknown) => boolean>;
}

/**
 * Parse Excel file and return data
 * @param file - File object from input
 * @returns Promise with parsed data
 */
export const parseExcelFile = (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false, // Keep values as strings for better control
          defval: "", // Use empty string for empty cells (will be converted to null later)
          blankrows: false, // Skip blank rows
        });

        resolve(jsonData as Record<string, unknown>[]);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * Validate imported data against schema
 * @param data - Parsed data from Excel
 * @param validation - Validation rules
 * @returns Validation result with errors if any
 */
export const validateImportData = (data: Record<string, unknown>[], validation?: ImportValidation): ImportResult => {
  const errors: string[] = [];

  if (!data || data.length === 0) {
    return {
      success: false,
      errors: ["No data found in the file"],
    };
  }

  // Check required columns
  if (validation?.requiredColumns && validation.requiredColumns.length > 0) {
    const firstRow = data[0];
    const existingColumns = Object.keys(firstRow);
    const missingColumns = validation.requiredColumns.filter((col) => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
    }
  }

  // Validate each row
  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because Excel is 1-indexed and row 1 is header

    // Type validation
    if (validation?.columnTypes) {
      Object.entries(validation.columnTypes).forEach(([column, type]) => {
        const value = row[column];

        if (value === null || value === undefined || value === "") {
          return; // Allow empty values
        }

        switch (type) {
          case "number":
            if (isNaN(Number(value))) {
              errors.push(`Row ${rowNumber}: "${column}" must be a number`);
            }
            break;
          case "boolean":
            if (!["true", "false", "yes", "no", "1", "0"].includes(String(value).toLowerCase())) {
              errors.push(`Row ${rowNumber}: "${column}" must be a boolean (yes/no, true/false, 1/0)`);
            }
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
              errors.push(`Row ${rowNumber}: "${column}" must be a valid email`);
            }
            break;
          case "date":
            if (isNaN(Date.parse(String(value)))) {
              errors.push(`Row ${rowNumber}: "${column}" must be a valid date`);
            }
            break;
        }
      });
    }

    // Custom validators
    if (validation?.customValidators) {
      Object.entries(validation.customValidators).forEach(([column, validator]) => {
        const value = row[column];
        if (!validator(value)) {
          errors.push(`Row ${rowNumber}: "${column}" failed validation`);
        }
      });
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      rowCount: data.length,
    };
  }

  return {
    success: true,
    data,
    rowCount: data.length,
  };
};

/**
 * Transform imported data to match backend schema
 * @param data - Raw imported data
 * @param transformMap - Map of column transformations
 * @returns Transformed data ready for backend
 */
export const transformImportData = (
  data: Record<string, unknown>[],
  transformMap?: Record<string, (value: unknown) => unknown>
): Record<string, unknown>[] => {
  return data.map((row) => {
    const transformed: Record<string, unknown> = {};

    Object.entries(row).forEach(([key, value]) => {
      // Apply transformation if available
      if (transformMap && transformMap[key]) {
        transformed[key] = transformMap[key](value);
      } else {
        // Handle empty values first (null, undefined, empty string)
        if (value === null || value === undefined || value === "" || String(value).trim() === "") {
          transformed[key] = null;
        }
        // Handle explicit string boolean values (ONLY if they are strings)
        else if (typeof value === "string") {
          const trimmedValue = value.trim().toLowerCase();

          if (["true", "yes", "1"].includes(trimmedValue)) {
            transformed[key] = true;
          } else if (["false", "no", "0"].includes(trimmedValue)) {
            transformed[key] = false;
          }
          // Handle numbers - check if string contains only numeric characters
          else if (!isNaN(Number(value.trim()))) {
            const numValue = Number(value.trim());
            transformed[key] = Number.isInteger(numValue) ? numValue : parseFloat(value.trim());
          }
          // Keep as string
          else {
            transformed[key] = value.trim();
          }
        }
        // If value is already a boolean or number, keep it as is
        else {
          transformed[key] = value;
        }
      }
    });

    return transformed;
  });
};

/**
 * Complete import process: parse, validate, and transform
 * @param file - Excel file to import
 * @param validation - Validation rules
 * @param transformMap - Transformation map
 * @returns Promise with import result
 */
export const importFromExcel = async (
  file: File,
  validation?: ImportValidation,
  transformMap?: Record<string, (value: unknown) => unknown>
): Promise<ImportResult> => {
  try {
    // Parse file
    const parsedData = await parseExcelFile(file);

    // Validate data
    const validationResult = validateImportData(parsedData, validation);
    if (!validationResult.success) {
      return validationResult;
    }

    // Transform data
    const transformedData = transformImportData(parsedData, transformMap);

    return {
      success: true,
      data: transformedData,
      rowCount: transformedData.length,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Unknown error occurred"],
    };
  }
};
