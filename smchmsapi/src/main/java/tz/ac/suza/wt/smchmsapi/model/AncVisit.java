package tz.ac.suza.wt.smchmsapi.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "anc_visits")
public class AncVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "visitDate is required")
    private LocalDate visitDate;

    @NotNull(message = "week is required")
    private Integer week;

    private String weight;

    private String bloodPressure;

    private String temperature;

    private String hb;

    private String notes;

    private String diagnosis;

    private String nextVisitDate;

    @ManyToOne
    @JoinColumn(name = "pregnancy_id", nullable = false)
    private Pregnancy pregnancy;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
