package tz.ac.suza.wt.smchmsapi.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tz.ac.suza.wt.smchmsapi.model.AppointmentStatus;

@Data
public class AppointmentStatusUpdateDTO {

    @NotNull(message = "status is required")
    private AppointmentStatus status;

    private UUID doctorId;

    private String notes;
}
