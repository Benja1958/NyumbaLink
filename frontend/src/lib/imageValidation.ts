export type ImageDimensionResult = {
  file: File;
  width: number;
  height: number;
  isLowResolution: boolean;
};

export const MIN_IMAGE_WIDTH = 1200;
export const MIN_IMAGE_HEIGHT = 800;

export async function checkImageDimensions(
  file: File
): Promise<ImageDimensionResult> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const objectUrl =
      URL.createObjectURL(file);

    image.onload = () => {
      const width =
        image.naturalWidth;

      const height =
        image.naturalHeight;

      URL.revokeObjectURL(
        objectUrl
      );

      resolve({
        file,
        width,
        height,
        isLowResolution:
          width <
            MIN_IMAGE_WIDTH ||
          height <
            MIN_IMAGE_HEIGHT,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(
        objectUrl
      );

      reject(
        new Error(
          `Could not read image dimensions for ${file.name}`
        )
      );
    };

    image.src = objectUrl;
  });
}