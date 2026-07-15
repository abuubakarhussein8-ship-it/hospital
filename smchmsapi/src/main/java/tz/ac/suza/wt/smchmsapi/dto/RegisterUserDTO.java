package tz.ac.suza.wt.smchmsapi.dto;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tz.ac.suza.wt.smchmsapi.model.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDTO {

    // optional: kama mtatumia POST bila id, acha hii null
    private UUID id;

    @NotBlank(message = "name is required")
    private String name;

    @Email(message = "email is invalid")
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    private UserRole role;
}

