package tz.ac.suza.wt.smchmsapi.model;

import java.util.UUID;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;



@Entity
@Data
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "name is required")
    private String name;

    @Column(unique = true)
    @NotBlank(message = "email is required")
    @Email(message = "email is invalid")
    private String email;


    @NotBlank(message = "password is required")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @NotNull(message = "role is required")
    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    private UserRole role;




    @OneToMany(mappedBy = "mother")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Pregnancy> pregnancies;
}
