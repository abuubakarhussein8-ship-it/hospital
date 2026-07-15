package tz.ac.suza.wt.smchmsapi.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tz.ac.suza.wt.smchmsapi.model.Pregnancy;

public interface PregnancyRepository extends JpaRepository<Pregnancy, UUID> {

    List<Pregnancy> findByMotherId(UUID motherId);
}

