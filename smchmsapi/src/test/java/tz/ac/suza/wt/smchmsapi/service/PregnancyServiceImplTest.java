package tz.ac.suza.wt.smchmsapi.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import tz.ac.suza.wt.smchmsapi.model.Pregnancy;
import tz.ac.suza.wt.smchmsapi.model.User;
import tz.ac.suza.wt.smchmsapi.model.UserRole;
import tz.ac.suza.wt.smchmsapi.repository.PregnancyRepository;
import tz.ac.suza.wt.smchmsapi.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PregnancyServiceImplTest {

    @Mock
    private PregnancyRepository pregnancyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PregnancyServiceImpl pregnancyService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getById_shouldRejectAccessForAnotherMother() {
        UUID currentUserId = UUID.randomUUID();
        UUID otherMotherId = UUID.randomUUID();
        UUID pregnancyId = UUID.randomUUID();

        User currentUser = new User();
        currentUser.setId(currentUserId);
        currentUser.setRole(UserRole.MOTHER);

        User otherMother = new User();
        otherMother.setId(otherMotherId);
        otherMother.setRole(UserRole.MOTHER);

        Pregnancy pregnancy = new Pregnancy();
        pregnancy.setId(pregnancyId);
        pregnancy.setMother(otherMother);

        var authentication = new UsernamePasswordAuthenticationToken(
                "mother@example.com",
                currentUserId,
                List.of(new SimpleGrantedAuthority("ROLE_MOTHER"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        when(pregnancyRepository.findById(pregnancyId)).thenReturn(Optional.of(pregnancy));

        assertThrows(AccessDeniedException.class, () -> pregnancyService.getById(pregnancyId));
    }
}
