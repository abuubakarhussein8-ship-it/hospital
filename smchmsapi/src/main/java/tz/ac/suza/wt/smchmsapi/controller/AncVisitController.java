package tz.ac.suza.wt.smchmsapi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tz.ac.suza.wt.smchmsapi.model.AncVisit;
import tz.ac.suza.wt.smchmsapi.service.AncVisitService;

@RestController
@RequestMapping("/api/v1/pregnancies/{pregnancyId}/anc-visits")
public class AncVisitController {

    private final AncVisitService ancVisitService;

    public AncVisitController(AncVisitService ancVisitService) {
        this.ancVisitService = ancVisitService;
    }

    @GetMapping
    public ResponseEntity<List<AncVisit>> getByPregnancy(@PathVariable UUID pregnancyId) {
        return ResponseEntity.ok(ancVisitService.getByPregnancy(pregnancyId));
    }

    @PostMapping
    public ResponseEntity<AncVisit> create(
            @PathVariable UUID pregnancyId,
            @Valid @RequestBody AncVisit visit
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ancVisitService.create(pregnancyId, visit));
    }
}
