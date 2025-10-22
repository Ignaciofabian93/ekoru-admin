/**
 * Export utilities for database tables
 * Handles exporting table data to various formats (Excel, CSV, JSON)
 */

import * as XLSX from "xlsx";

/**
 * Export data to Excel (.xlsx) format
 * @param data - Array of objects to export
 * @param tableName - Name of the table (used for filename)
 * @param columns - Optional array of column keys to include (if not provided, all keys will be exported)
 */
export const exportToExcel = (data: Record<string, unknown>[], tableName: string, columns?: string[]) => {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  // Filter out __typename and other GraphQL metadata
  const cleanData = data.map((item) => {
    const cleaned: Record<string, unknown> = {};
    const keys = columns || Object.keys(item).filter((key) => !key.startsWith("__"));

    keys.forEach((key) => {
      if (!key.startsWith("__")) {
        // Format the value for export
        const value = item[key];
        if (value === null || value === undefined) {
          cleaned[key] = "";
        } else if (typeof value === "object" && !Array.isArray(value)) {
          const jsonStr = JSON.stringify(value);
          // Excel cell limit is 32,767 characters
          cleaned[key] = jsonStr.length > 32767 ? "" : jsonStr;
        } else if (Array.isArray(value)) {
          const jsonStr = JSON.stringify(value);
          cleaned[key] = jsonStr.length > 32767 ? "" : jsonStr;
        } else if (typeof value === "boolean") {
          cleaned[key] = value ? "Yes" : "No";
        } else {
          const stringValue = String(value);
          // Handle base64 images and other large text values
          if (stringValue.startsWith("data:image/") || stringValue.length > 32767) {
            // Return empty cell for base64 images or text exceeding Excel's limit
            cleaned[key] = "";
          } else {
            cleaned[key] = stringValue;
          }
        }
      }
    });
    return cleaned;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(cleanData);

  // Auto-size columns
  const columnWidths = Object.keys(cleanData[0] || {}).map((key) => {
    const maxLength = Math.max(key.length, ...cleanData.map((row) => String(row[key] || "").length));
    return { wch: Math.min(maxLength + 2, 50) }; // Cap at 50 characters
  });
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `${tableName}_${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);

  return filename;
};

/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param tableName - Name of the table (used for filename)
 * @param columns - Optional array of column keys to include
 */
export const exportToCSV = (data: Record<string, unknown>[], tableName: string, columns?: string[]) => {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  // Filter out __typename and other GraphQL metadata
  const cleanData = data.map((item) => {
    const cleaned: Record<string, unknown> = {};
    const keys = columns || Object.keys(item).filter((key) => !key.startsWith("__"));

    keys.forEach((key) => {
      if (!key.startsWith("__")) {
        const value = item[key];
        if (value === null || value === undefined) {
          cleaned[key] = "";
        } else if (typeof value === "object") {
          cleaned[key] = JSON.stringify(value);
        } else {
          cleaned[key] = value;
        }
      }
    });
    return cleaned;
  });

  // Create worksheet and convert to CSV
  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${tableName}_${timestamp}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return `${tableName}_${timestamp}.csv`;
};

/**
 * Export data to JSON format
 * @param data - Array of objects to export
 * @param tableName - Name of the table (used for filename)
 */
export const exportToJSON = (data: Record<string, unknown>[], tableName: string) => {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  // Clean data (remove __typename, etc.)
  const cleanData = data.map((item) => {
    const cleaned: Record<string, unknown> = {};
    Object.keys(item).forEach((key) => {
      if (!key.startsWith("__")) {
        cleaned[key] = item[key];
      }
    });
    return cleaned;
  });

  // Create blob and download
  const json = JSON.stringify(cleanData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${tableName}_${timestamp}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return `${tableName}_${timestamp}.json`;
};

/**
 * Export data template (empty Excel file with headers)
 * Useful for users to download a template and fill it with data
 */
export const exportTemplate = (tableName: string, columns: string[]) => {
  // Create empty row with column headers
  const template: Record<string, string> = {};
  columns.forEach((col) => {
    template[col] = "";
  });

  const worksheet = XLSX.utils.json_to_sheet([template]);

  // Style headers
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "4F81BD" } },
    };
  }

  // Set column widths
  worksheet["!cols"] = columns.map((col) => ({ wch: Math.max(col.length + 2, 15) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

  const filename = `${tableName}_template.xlsx`;
  XLSX.writeFile(workbook, filename);

  return filename;
};
