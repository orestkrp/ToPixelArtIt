import { FC } from "react";
import { PaletteColor } from "./palette-color";

interface CustomPaletteProps {
  customPalette: string[];
}

export const CustomPalette: FC<CustomPaletteProps> = ({ customPalette }) => {
  console.log(customPalette);
  return (
    <div className="p-4 bg-slate-100 flex gap-3">
      {customPalette.map((color) => (
        <PaletteColor key={color} color={color} />
      ))}
    </div>
  );
};
