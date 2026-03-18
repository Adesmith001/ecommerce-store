function readEnv(value: string | undefined) {
  return value?.trim() ?? "";
}

export const cloudinaryConfig = {
  cloudName: readEnv(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
  uploadPreset: readEnv(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET),
  folder: readEnv(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER),
} as const;
