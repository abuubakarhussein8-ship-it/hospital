package tz.ac.suza.wt.smchmsapi.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import tz.ac.suza.wt.smchmsapi.model.AncVisit;

public interface AncVisitRepository extends JpaRepository<AncVisit, UUID> {

    List<AncVisit> findByPregnancyIdOrderByVisitDateAsc(UUID pregnancyId);

    @Modifying
    @Query(value = "DELETE FROM anc_visits WHERE pregnancy_id = :pregnancyId", nativeQuery = true)
    void deleteAllByPregnancyId(@Param("pregnancyId") UUID pregnancyId);
}
