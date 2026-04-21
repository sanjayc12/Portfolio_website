package com.portfolio.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.backend.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByVisibleTrue();
}
