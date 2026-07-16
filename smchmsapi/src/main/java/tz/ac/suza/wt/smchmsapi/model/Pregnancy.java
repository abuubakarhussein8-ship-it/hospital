package tz.ac.suza.wt.smchmsapi.model;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
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

    private LocalDate lmp;

    private LocalDate edd;

    @NotBlank(message = "riskStatus is required")
    private String riskStatus;

    private String pregnancyStatus = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "mother_id", nullable = false)
    private User mother;

    @OneToMany(mappedBy = "pregnancy", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<AncVisit> visits;

}
