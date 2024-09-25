import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { DEFAULT_PALETTES } from "@/constants";

export type PixelItState = {
  picture: File | null;
  blockSize: number;
  maxWidth?: number;
  maxHeight?: number;
  isCustomPalette: boolean;
  customPalette: string[];
  palette: string;
  uploadStatus: string;
  result: string;
  isUploading: boolean;
};

export type PixelItActions = {
  addColor: (color: string) => void;
  resetCustomPalette: () => void;
  setBlockSize: (size: number) => void;
  setMaxWidth: (maxWidth: number) => void;
  setMaxHeight: (maxHeight: number) => void;
  toggleCustomPalette: () => void;
  setPalette: (palette: string) => void;
  setPicture: (picture: File | null) => void;
  uploadData: () => void;
  clearImage: () => void;
};

export type Store = PixelItActions & PixelItState;

export const createPixelItStore: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  Store
> = (set) => ({
  picture: null,
  result: "",
  blockSize: 8,
  isCustomPalette: false,
  isGrayScale: false,
  palette: "default",
  uploadStatus: "",
  isUploading: false,
  customPalette: [],
  setBlockSize: (blockSize) => {
    set((state) => {
      state.blockSize = blockSize;
    });
  },
  setMaxWidth: (maxWidth) => {
    set((state) => {
      state.maxWidth = maxWidth;
    });
  },
  setMaxHeight: (maxHeight) => {
    set((state) => {
      state.maxHeight = maxHeight;
    });
  },
  toggleCustomPalette: () => {
    set((state) => {
      state.isCustomPalette = !state.isCustomPalette;
    });
  },
  addColor: (color) => {
    set((state) => {
      state.customPalette.push(color);
    });
  },
  resetCustomPalette: () => {
    set((state) => {
      state.customPalette = [];
    });
  },
  setPalette: (palette) => {
    set((state) => {
      state.palette = palette;
    });
  },
  setPicture: (picture) => {
    set((state) => {
      state.picture = picture;
    });
  },
  uploadData: async () => {
    const {
      picture,
      blockSize,
      isCustomPalette,
      customPalette,
      palette,
      maxHeight,
      maxWidth,
    } = useStore.getState(); // Accessing the state directly

    if (!picture || blockSize === null) {
      set((state) => {
        state.uploadStatus = "Image and number are required.";
      });
      return;
    }

    try {
      set((state) => {
        state.uploadStatus = "";
        state.isUploading = true;
      });

      // Prepare FormData
      const formData = new FormData();
      formData.append("image", picture);
      formData.append("block-size", String(blockSize));
      let currentPalette: string[] = [];
      if (isCustomPalette) {
        currentPalette = customPalette;
      } else {
        currentPalette =
          DEFAULT_PALETTES.find((pal) => pal.name === palette)?.colors || [];
      }
      console.log(currentPalette);
      currentPalette.forEach((item) => {
        formData.append("palette[]", item); // Using 'myArray[]' to denote it's an array
      });

      if (maxWidth) {
        formData.append("max-width", String(maxWidth));
      }

      if (maxHeight) {
        formData.append("max-height", String(maxHeight));
      }

      // Make POST request
      const response = await axios.post(
        "http://localhost:8080/api/pixel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // If the response is an image, we expect a blob
        }
      );

      // On success, extract the image (assuming the response is an image blob)
      const resultImageURL = URL.createObjectURL(response.data); // Convert blob to URL

      // On success
      set((state) => {
        state.uploadStatus = "Upload successful!";
        state.isUploading = false;
        state.result = resultImageURL;
      });
    } catch (error) {
      set((state) => {
        state.uploadStatus = "Error uploading data.";
        state.isUploading = false;
      });
      console.error("Upload failed:", error);
    }
  },
  clearImage: () => {
    set((state) => {
      state.picture = null;
      state.result = "";
    });
  },
});

export const useStore = create<Store>()(
  immer((...a) => ({
    ...createPixelItStore(...a),
  }))
);
