package tz.ac.suza.wt.smchmsapi.service;

import org.springframework.security.core.Authentication;

import tz.ac.suza.wt.smchmsapi.dto.LoginRequestDTO;
import tz.ac.suza.wt.smchmsapi.dto.LoginResponseDTO;
import tz.ac.suza.wt.smchmsapi.dto.RegisterUserDTO;
import tz.ac.suza.wt.smchmsapi.dto.ChangePasswordDTO;
import tz.ac.suza.wt.smchmsapi.model.User;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO request);

    User register(RegisterUserDTO request, Authentication authentication);

    void changePassword(java.util.UUID userId, ChangePasswordDTO request);

}
