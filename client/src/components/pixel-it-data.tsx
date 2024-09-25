import {
  BLOCK_SIZE_STEP,
  DEFAULT_COLOR,
  MAX_BLOCK_SIZE,
  MIN_BLOCK_SIZE,
} from "@/constants";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ColorPicker } from "./ui/color-picker";
import { useState } from "react";
import { useStore } from "@/store";
import { useShallow } from "zustand/shallow";
import { CustomPalette } from "./ui/custom-palette";
import { PaletteSelect } from "./ui/palette-select";

export const PixelItData = () => {
  const [color, setColor] = useState<string>(DEFAULT_COLOR);

  const {
    blockSize,
    setBlockSize,
    maxWidth,
    setMaxWidth,
    maxHeight,
    setMaxHeight,
    toggleCustomPalette,
    isCustomPalette,
    customPalette,
    addColor,
    resetCustomPalette,
    palette,
    setPalette,
    uploadData,
    result,
  } = useStore(
    useShallow((state) => ({
      blockSize: state.blockSize,
      maxWidth: state.maxWidth,
      maxHeight: state.maxHeight,
      isCustomPalette: state.isCustomPalette,
      customPalette: state.customPalette,
      palette: state.palette,

      setBlockSize: state.setBlockSize,
      setMaxWidth: state.setMaxWidth,
      setMaxHeight: state.setMaxHeight,
      toggleCustomPalette: state.toggleCustomPalette,
      addColor: state.addColor,
      resetCustomPalette: state.resetCustomPalette,
      setPalette: state.setPalette,
      uploadData: state.uploadData,
      result: state.result,
    }))
  );

  return (
    <div>
      <div>
        <Label>Block size: {blockSize}</Label>
        <Slider
          name="block-size"
          defaultValue={[blockSize]}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            setBlockSize(+target.value);
          }}
          min={MIN_BLOCK_SIZE}
          max={MAX_BLOCK_SIZE}
          step={BLOCK_SIZE_STEP}
        />
      </div>
      <div>
        <Label>Max width:</Label>
        <Input
          name="max-width"
          placeholder="in px"
          value={maxWidth}
          onChange={(event) => {
            setMaxWidth(+event.target.value);
          }}
        />
      </div>
      <div>
        <Label>Max height:</Label>
        <Input
          name="max-height"
          placeholder="in px"
          value={maxHeight}
          onChange={(event) => {
            setMaxHeight(+event.target.value);
          }}
        />
      </div>
      <div>
        <Label>Palette</Label>
        <PaletteSelect onChange={setPalette} palette={palette} />
      </div>
      <div>
        <Switch
          name="custom-palette"
          checked={isCustomPalette}
          onCheckedChange={() => {
            toggleCustomPalette();
          }}
        />
        <Label>Use custom palette</Label>
      </div>
      {isCustomPalette && (
        <div>
          <Label>Custom palette</Label>
          <CustomPalette customPalette={customPalette} />
          <ColorPicker value={color} onChange={(value) => setColor(value)} />
          <Button
            type="button"
            onClick={() => {
              addColor(color);
            }}
          >
            Add color
          </Button>
          <Button type="button" onClick={() => resetCustomPalette()}>
            Refresh
          </Button>
        </div>
      )}
      <Button type="button" onClick={() => uploadData()}>
        Convert
      </Button>
      {result && (
        <a href="/images/myw3schoolsimage.jpg" download="converted">
          Download
        </a>
      )}
    </div>
  );
};
