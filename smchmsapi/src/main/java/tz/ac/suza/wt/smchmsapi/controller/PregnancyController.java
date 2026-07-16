package tz.ac.suza.wt.smchmsapi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


import tz.ac.suza.wt.smchmsapi.model.Pregnancy;
import tz.ac.suza.wt.smchmsapi.service.PregnancyService;

@RestController
@RequestMapping("/api/v1/pregnancies")
public class PregnancyController {

    private final PregnancyService pregnancyService;

    public PregnancyController(PregnancyService pregnancyService) {
        this.pregnancyService = pregnancyService;
    }

    // GET ALL PREGNANCIES
    @GetMapping
    public ResponseEntity<List<Pregnancy>> getAll() {
        return ResponseEntity.ok(pregnancyService.getAll());
    }

    // GET PREGNANCY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Pregnancy> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(pregnancyService.getById(id));
    }

    // GET PREGNANCIES BY MOTHER
    @GetMapping("/mother/{motherId}")
    public ResponseEntity<List<Pregnancy>> getByMother(@PathVariable UUID motherId) {
        return ResponseEntity.ok(pregnancyService.getByMother(motherId));
    }

    // CREATE PREGNANCY (MOTHER SELF REGISTRATION)
    @PostMapping
    public ResponseEntity<Pregnancy> create(@Valid @RequestBody Pregnancy pregnancy) {

        Pregnancy created = pregnancyService.create(pregnancy);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE PREGNANCY (RISK TRACKING)
    @PutMapping("/{id}")
    public ResponseEntity<Pregnancy> update(@PathVariable UUID id, @Valid @RequestBody Pregnancy pregnancy) {

        return ResponseEntity.ok(pregnancyService.update(id, pregnancy));
    }

    // DELETE PREGNANCY
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        pregnancyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/admin-cleanup")
    public ResponseEntity<Void> adminCleanup(@PathVariable UUID id) {
        pregnancyService.adminCleanup(id);
        return ResponseEntity.noContent().build();
    }
}
