package com.ecommerce.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    private final Path uploadDir = Paths.get("uploads");

    @PostMapping
    public String uploadImage(@RequestParam("file") MultipartFile file)
            throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("Please select an image");
        }

        Files.createDirectories(uploadDir);

        String originalName = file.getOriginalFilename();

        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension =
                    originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName =
                UUID.randomUUID() + extension;

        Path filePath =
                uploadDir.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath
        );

        return "/uploads/" + fileName;
    }
}