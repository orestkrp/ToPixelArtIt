import { FC } from "react";

interface PaletteColorProps {
  color: string;
}

export const PaletteColor: FC<PaletteColorProps> = ({ color }) => {
  return <div style={{ background: color }} className="w-8 h-8"></div>;
};
