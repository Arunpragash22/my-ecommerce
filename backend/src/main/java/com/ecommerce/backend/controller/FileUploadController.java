package com.ecommerce.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final Cloudinary cloudinary;

    public FileUploadController(
            @Value("${CLOUDINARY_URL}") String cloudinaryUrl
    ) {
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    @PostMapping
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please select an image");
        }

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "myecommerce/products"
                )
        );

        String imageUrl = result.get("secure_url").toString();

        return ResponseEntity.ok(imageUrl);
    }
}