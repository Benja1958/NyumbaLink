type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale";
  quality?: "auto" | "auto:good" | "90";
};

export function optimizeCloudinaryImage(
  url: string | null | undefined,
  options: CloudinaryImageOptions = {}
): string {
  if (!url) {
    return "";
  }

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  const {
    width,
    height,
    crop,
    quality = "90",
  } = options;

  const transformations: string[] = [];

  if (width) {
    transformations.push(`w_${width}`);
  }

  if (height) {
    transformations.push(`h_${height}`);
  }

  if (crop) {
    transformations.push(`c_${crop}`);
  }

  transformations.push("f_auto");
  transformations.push(`q_${quality}`);

  const transformationString =
    transformations.join(",");

  return url.replace(
    "/upload/",
    `/upload/${transformationString}/`
  );
}