package com.example.demo;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@RestController
@RequestMapping("/api")
public class PixelItController {

    PixelIt pixelIt;

    public PixelItController() {
        this.pixelIt = new PixelIt();
    }

    public static List<int[]> hexToRgb(List<String> hexList) {
        List<int[]> rgbList = new ArrayList<>();


        for (String hex : hexList) {
            // Remove '#' if present
            String cleanedHex = hex.replace("#", "");

            // Parse the hexadecimal values
            int r = Integer.parseInt(cleanedHex.substring(0, 2), 16);
            int g = Integer.parseInt(cleanedHex.substring(2, 4), 16);
            int b = Integer.parseInt(cleanedHex.substring(4, 6), 16);

            // Create an int array for the RGB values
            int[] rgb = new int[3];
            rgb[0] = r;
            rgb[1] = g;
            rgb[2] = b;

            // Add the RGB array to the result
            rgbList.add(rgb);

        }

        return rgbList;
    }


    private BufferedImage runPixelIt(BufferedImage source, int blockSize, List<int[]> palette,Integer maxWidth,Integer maxHeight) throws IOException {
        pixelIt.setImage(source);
        pixelIt.prepareDestination();
        pixelIt.setPalette(palette);

        if(maxWidth != null) {
            pixelIt.setMaxWidth(maxWidth);

        }
        if(maxHeight != null) {
            pixelIt.setMaxHeight(maxHeight);
        }

        pixelIt.setScale(blockSize);

        pixelIt.pixelate();
        pixelIt.resizeImage();
        pixelIt.convertToPalette();


        return pixelIt.getResultImage();
    }

    @PostMapping("/pixel")
    public ResponseEntity<byte[]> handleImageUpload(
            @RequestParam("image") MultipartFile file,
            @RequestParam("block-size") int blockSIze,
            @RequestParam(value = "max-width", required = false) Integer maxWidth,
            @RequestParam(value = "max-height",required = false) Integer maxHeight,
            @RequestParam("palette[]") List<String> palette
    ) throws IOException {
        // Read the incoming image

        BufferedImage reqImage = ImageIO.read(file.getInputStream());

       BufferedImage resultImage = this.runPixelIt(reqImage, blockSIze, PixelItController.hexToRgb(palette), maxWidth, maxHeight);

        // Convert BufferedImage to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resultImage, "png", baos);
        baos.flush();
        byte[] imageInByte = baos.toByteArray();
        baos.close();

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(imageInByte, headers, HttpStatus.OK);
    }
}
