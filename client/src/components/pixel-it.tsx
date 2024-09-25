import { FC } from "react";
import { PixelItData } from "./pixel-it-data";
import { ImageInput } from "./ui/image-input";

export const PixelIt: FC = () => {
  return (
    <form>
      <div className="p-8 flex w-full gap-4">
        <ImageInput />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Pixel It now</h1>
          <p>
            You can try pixel It live here, you can use the default image (just
            change some value) or upload an image to start see the changes.
          </p>
          <PixelItData />
        </div>
      </div>
    </form>
  );
};
