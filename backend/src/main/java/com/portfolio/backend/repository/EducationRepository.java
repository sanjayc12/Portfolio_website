package com.portfolio.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.backend.entity.Education;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByVisibleTrue();
}
