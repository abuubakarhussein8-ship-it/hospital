package tz.ac.suza.wt.smchmsapi.model;

import java.util.UUID;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "pregnancies")
public class Pregnancy {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "week is required")
    @Min(value = 1, message = "week must be between 1 and 42")
    @Max(value = 42, message = "week must be between 1 and 42")
    private Integer week;

    @NotBlank(message = "weight is required")
    private String weight;

    @NotBlank(message = "bloodPressure is required")
    private String bloodPressure;

    @NotBlank(message = "riskStatus is required")
    private String riskStatus;

    private String pregnancyStatus = "ACTIVE";

    private LocalDate nextAncVisit;

    private String ancNotes;

    private String diagnosis;

    private String medicalNotes;

    @ManyToOne
    @JoinColumn(name = "mother_id", nullable = false)
    private User mother;

}
