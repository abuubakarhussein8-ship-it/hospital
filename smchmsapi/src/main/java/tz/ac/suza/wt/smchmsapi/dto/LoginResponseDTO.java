package tz.ac.suza.wt.smchmsapi.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tz.ac.suza.wt.smchmsapi.model.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;
    private UUID userId;
    private String name;
    private String email;
    private UserRole role;
}

