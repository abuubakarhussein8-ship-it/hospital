package tz.ac.suza.wt.smchmsapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponseDTO {

    private Long totalUsers;
    private Long totalMothers;
    private Long totalDoctors;
    private Long totalNurses;
    private Long totalPregnancies;
    private Long totalAppointments;
    private Long pendingAppointments;
}
