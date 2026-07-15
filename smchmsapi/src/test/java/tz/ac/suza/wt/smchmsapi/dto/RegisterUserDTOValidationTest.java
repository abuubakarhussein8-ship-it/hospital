package tz.ac.suza.wt.smchmsapi.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class RegisterUserDTOValidationTest {

    private final Validator validator;

    RegisterUserDTOValidationTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @Test
    void registerRequestWithoutRoleShouldPassValidation() {
        RegisterUserDTO request = new RegisterUserDTO();
        request.setName("Amina");
        request.setEmail("amina@example.com");
        request.setPassword("secret123");
        request.setRole(null);

        Set<ConstraintViolation<RegisterUserDTO>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }
}
