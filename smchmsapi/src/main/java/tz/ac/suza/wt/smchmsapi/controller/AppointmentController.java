package tz.ac.suza.wt.smchmsapi.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tz.ac.suza.wt.smchmsapi.dto.AppointmentStatusUpdateDTO;
import tz.ac.suza.wt.smchmsapi.model.Appointment;
import tz.ac.suza.wt.smchmsapi.service.AppointmentService;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Appointment>> getMine() {
        return ResponseEntity.ok(appointmentService.getMine());
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@Valid @RequestBody Appointment appointment) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.create(appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentStatusUpdateDTO request
    ) {
        return ResponseEntity.ok(appointmentService.updateStatus(
                id,
                request.getStatus(),
                request.getDoctorId(),
                request.getNotes()
        ));
    }
}
