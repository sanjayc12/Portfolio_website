package com.portfolio.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.backend.entity.Education;
import com.portfolio.backend.repository.EducationRepository;

@RestController
@RequestMapping("/api/education")
@CrossOrigin(origins = "*")
public class EducationController {

    @Autowired
    private EducationRepository educationRepository;

    @GetMapping
    public List<Education> getAllEducation() {
        return educationRepository.findAll();
    }

    @GetMapping("/visible")
    public List<Education> getVisibleEducation() {
        return educationRepository.findByVisibleTrue();
    }

    @PostMapping
    public Education addEducation(@RequestBody Education education) {
        return educationRepository.save(education);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable("id") Long id) {
        if(educationRepository.existsById(id)) {
            educationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
