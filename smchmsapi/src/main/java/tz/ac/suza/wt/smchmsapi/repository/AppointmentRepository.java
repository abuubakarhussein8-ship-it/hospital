package tz.ac.suza.wt.smchmsapi.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tz.ac.suza.wt.smchmsapi.model.Appointment;
import tz.ac.suza.wt.smchmsapi.model.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByMotherId(UUID motherId);

    long countByStatus(AppointmentStatus status);
}
