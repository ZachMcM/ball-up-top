import * as z from 'zod';

export const ImagePickerAssetSchema = z.object({
  uri: z.string(),
  width: z.number(),
  height: z.number(),
  assetId: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  fileSize: z.number().optional(),
  type: z.enum(['image', 'video', 'livePhoto', 'pairedVideo']).optional(),
  duration: z.number().nullable().optional(),
  mimeType: z.string().optional(),
  exif: z.record(z.string(), z.any()).nullable().optional(),
  base64: z.string().nullable().optional(),
});

export type ImagePickerAsset = z.infer<typeof ImagePickerAssetSchema>;
