package com.portfolio.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.portfolio.backend.entity.Certificate;
import com.portfolio.backend.repository.CertificateRepository;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*") 
public class CertificateController {

    @Autowired
    private CertificateRepository certificateRepository;

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    @GetMapping("/visible")
    public List<Certificate> getVisibleCertificates() {
        return certificateRepository.findByVisibleTrue();
    }

    @PostMapping
    public ResponseEntity<Certificate> addCertificate(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("visible") boolean visible,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            imageUrl = "http://localhost:8080/uploads/" + fileName;
        }

        Certificate certificate = new Certificate();
        certificate.setName(name);
        certificate.setDescription(description);
        certificate.setVisible(visible);
        certificate.setImageUrl(imageUrl);

        return ResponseEntity.ok(certificateRepository.save(certificate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable("id") Long id) {
        if(certificateRepository.existsById(id)) {
            certificateRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
