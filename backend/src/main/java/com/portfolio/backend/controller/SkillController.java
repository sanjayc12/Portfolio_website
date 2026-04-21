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

import com.portfolio.backend.entity.Skill;
import com.portfolio.backend.repository.SkillRepository;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*") 
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @GetMapping("/visible")
    public List<Skill> getVisibleSkills() {
        return skillRepository.findByVisibleTrue();
    }

    @PostMapping
    public Skill addSkill(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable("id") Long id) {
        if(skillRepository.existsById(id)) {
            skillRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
