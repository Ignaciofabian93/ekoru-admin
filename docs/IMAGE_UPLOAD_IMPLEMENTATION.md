# Image Upload Component for Database Forms

## Overview

This implementation adds drag-and-drop image upload functionality to the dynamic form system, specifically for the `departmentImage` field in the Departments table. The solution is designed to be non-intrusive and won't affect other tables.

## Files Created/Modified

### 1. Created: `ui/inputs/imageUpload.tsx`

A new reusable image upload component with:

- **Drag & Drop**: Users can drag images directly onto the component
- **Click to Select**: Alternative method to open file browser
- **Base64 Conversion**: Automatically converts images to base64 format
- **Image Preview**: Shows a preview of the uploaded image
- **Validation**:
  - File type validation (only images)
  - Size validation (default 5MB limit, configurable)
- **Error Handling**: Clear error messages for invalid uploads
- **Dark Mode Support**: Fully styled for both light and dark themes

### 2. Modified: `app/(dashboard)/database/_constants/newRecordFields.ts`

- Added new field type: `"image"` to `FieldType` union
- Changed `departmentImage` field configuration:
  ```typescript
  {
    name: "departmentImage",
    label: "Imagen del Departamento",
    type: "image", // Changed from "text"
    placeholder: "Arrastra una imagen aquí o haz clic para seleccionar",
  }
  ```

### 3. Modified: `app/(dashboard)/database/_ui/dynamicForm.tsx`

- Imported the new `ImageUpload` component
- Added new case in `renderField` function to handle `"image"` field type
- The image case only renders when a field is explicitly set to type `"image"`

## How It Works

1. **Field Configuration**: Only tables with fields explicitly configured as `type: "image"` will show the drag-and-drop component
2. **Other Tables**: All other tables remain unchanged and unaffected
3. **Base64 Storage**: Images are converted to base64 strings and stored in that format
4. **User Experience**:
   - Drag image onto the area
   - Or click to open file browser
   - Preview appears immediately
   - Click X button to remove and upload different image

## Usage Example

To add image upload to another table, simply configure the field:

```typescript
SomeOtherTable: [
  {
    name: "imageField",
    label: "Upload Image",
    type: "image", // This triggers the ImageUpload component
    placeholder: "Drag and drop your image here",
    required: false,
  },
];
```

## Benefits

✅ **Isolated**: Only affects fields explicitly configured as type `"image"`  
✅ **Reusable**: Can be used for any table that needs image uploads  
✅ **No Breaking Changes**: Existing tables and forms continue to work exactly as before  
✅ **User-Friendly**: Intuitive drag-and-drop interface  
✅ **Type-Safe**: Fully typed with TypeScript  
✅ **Validated**: Built-in file type and size validation

## Technical Details

- **File Format**: Base64-encoded data URI
- **Supported Formats**: All image types (PNG, JPG, GIF, WebP, etc.)
- **Default Size Limit**: 5MB (configurable via `maxSizeMB` prop)
- **Storage**: Base64 string stored directly in database field
