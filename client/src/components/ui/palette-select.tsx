import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { DEFAULT_PALETTES } from "@/constants";
import { PaletteColor } from "./palette-color";

interface PaletteSelectProps {
  palette: string;
  onChange: (value: string) => void;
}

export const PaletteSelect: FC<PaletteSelectProps> = ({
  palette,
  onChange,
}) => {
  return (
    <Select
      value={palette}
      name="palette"
      onValueChange={(value) => {
        console.log(value);
        onChange(value);
      }}
    >
      <SelectTrigger className="w-full h-full">
        <SelectValue className="w-full" placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {DEFAULT_PALETTES.map((palette) => (
          <SelectItem key={palette.name} value={palette.name}>
            <div className="flex gap-2">
              {palette.colors.map((color) => (
                <PaletteColor key={color} color={color} />
              ))}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
