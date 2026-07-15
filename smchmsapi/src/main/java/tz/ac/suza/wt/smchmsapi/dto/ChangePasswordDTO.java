package tz.ac.suza.wt.smchmsapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank(message = "current password is required")
    private String currentPassword;

    @NotBlank(message = "new password is required")
    @Size(min = 8, message = "new password must be at least 8 characters")
    private String newPassword;
}
