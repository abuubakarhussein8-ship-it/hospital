package tz.ac.suza.wt.smchmsapi.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "appointmentDate is required")
    private LocalDate appointmentDate;

    @NotBlank(message = "reason is required")
    private String reason;

    private LocalTime startTime;

    private LocalTime endTime;

    private String notes;


    private Boolean shareSms = true;

    private Boolean shareWhatsapp = false;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "mother_id", nullable = false)
    private User mother;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;
}
