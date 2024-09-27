package com.example.demo;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class PixelIt {

    private BufferedImage drawTo;
    private BufferedImage drawFrom;
    private double scale;
    private List<int[]> palette;
    private Integer maxHeight;
    private Integer maxWidth;

    public PixelIt() {
        this.scale = 0.08; // Default scale
        this.palette = Arrays.asList(
                new int[]{140, 143, 174},
                new int[]{88, 69, 99},
                new int[]{62, 33, 55},
                new int[]{154, 99, 72},
                new int[]{215, 155, 125},
                new int[]{245, 237, 186},
                new int[]{192, 199, 65},
                new int[]{100, 125, 52},
                new int[]{228, 148, 58},
                new int[]{157, 48, 59},
                new int[]{210, 100, 113},
                new int[]{112, 55, 127},
                new int[]{126, 196, 193},
                new int[]{52, 133, 157},
                new int[]{23, 67, 75},
                new int[]{31, 14, 28}
        );
    }

    /**
     * Load the image from the file path
     *
     * @param src Path to the input image file
     * @throws IOException If an error occurs while loading the image
     */
    public void setImageFromFile(String src) throws IOException {
        this.drawFrom = ImageIO.read(new File(src));

    }

    public void setImage(BufferedImage image) {
        this.drawFrom = image;
    }

    public BufferedImage getResultImage() {
        return this.drawTo;
    }

    /**
     * Sets the destination image buffer based on the original image
     */
    public void prepareDestination() {
        this.drawTo = new BufferedImage(drawFrom.getWidth(), drawFrom.getHeight(), BufferedImage.TYPE_INT_ARGB);

    }

    public void setScale(int scale) {
        this.scale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01;
    }

    public void setPalette(List<int[]> palette) {
        this.palette = palette;
    }

    public void setMaxWidth(int maxWidth) {
        this.maxWidth = maxWidth;
    }

    public void setMaxHeight(int maxHeight) {
        this.maxHeight = maxHeight;
    }

    private double colorSim(int[] rgbColor, int[] compareColor) {
        double d = 0;
        for (int i = 0; i < rgbColor.length; i++) {
            d += Math.pow((rgbColor[i] - compareColor[i]), 2);
        }
        return Math.sqrt(d);
    }

    private int[] similarColor(int[] actualColor) {
        int[] selectedColor = this.palette.get(0);
        double currentSim = colorSim(actualColor, selectedColor);

        for (int[] color : this.palette) {
            double nextColor = colorSim(actualColor, color);
            if (nextColor <= currentSim) {
                selectedColor = color;
                currentSim = nextColor;
            }
        }
        return selectedColor;
    }

    public void pixelate() {
        int scaledWidth = (int) (this.drawFrom.getWidth() * this.scale);
        int scaledHeight = (int) (this.drawFrom.getHeight() * this.scale);

        BufferedImage tempCanvas = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D tempContext = tempCanvas.createGraphics();
        tempContext.drawImage(this.drawFrom, 0, 0, scaledWidth, scaledHeight, null);
        tempContext.dispose();

        Graphics2D ctx = this.drawTo.createGraphics();
        ctx.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
        ctx.drawImage(tempCanvas, 0, 0, this.drawFrom.getWidth(), this.drawFrom.getHeight(), null);
        ctx.dispose();

    }

//    public void convertToGrayscale() {
//        for (int y = 0; y < drawTo.getHeight(); y++) {
//            for (int x = 0; x < drawTo.getWidth(); x++) {
//                int rgb = drawTo.getRGB(x, y);
//                Color color = new Color(rgb, true);
//                int avg = (color.getRed() + color.getGreen() + color.getBlue()) / 3;
//                Color grayColor = new Color(avg, avg, avg, color.getAlpha());
//                drawTo.setRGB(x, y, grayColor.getRGB());
//            }
//        }
//    }

    public void convertToPalette() {
        for (int y = 0; y < drawTo.getHeight(); y++) {
            for (int x = 0; x < drawTo.getWidth(); x++) {
                int rgb = drawTo.getRGB(x, y);
                Color color = new Color(rgb, true);
                int[] finalColor = similarColor(new int[]{color.getRed(), color.getGreen(), color.getBlue()});
                Color newColor = new Color(finalColor[0], finalColor[1], finalColor[2], color.getAlpha());
                drawTo.setRGB(x, y, newColor.getRGB());
            }
        }
    }

    public void resizeImage() {
        if (maxWidth == null && maxHeight == null) {
            return;
        }

        int newWidth = drawFrom.getWidth();
        int newHeight = drawFrom.getHeight();
        double ratio = 1.0;

        if (maxWidth != null && drawTo.getWidth() > maxWidth) {
            ratio = (double) maxWidth / drawTo.getWidth();
        }

        if (maxHeight != null && drawTo.getHeight() > maxHeight) {
            ratio = (double) maxHeight / drawTo.getHeight();
        }

        newWidth = (int) (drawTo.getWidth() * ratio);
        newHeight = (int) (drawTo.getHeight() * ratio);

        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, drawTo.getType());
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(drawTo, 0, 0, newWidth, newHeight, null);
        g.dispose();

        this.drawTo = resizedImage;
        return;
    }

//    public void saveImage(String outputFile) throws IOException {
//        File file = new File(outputFile);
//        ImageIO.write(this.drawTo, "png", file);
//    }

}
