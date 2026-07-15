package tz.ac.suza.wt.smchmsapi.service;

import java.util.List;
import java.util.UUID;

import tz.ac.suza.wt.smchmsapi.model.Appointment;
import tz.ac.suza.wt.smchmsapi.model.AppointmentStatus;

public interface AppointmentService {

    List<Appointment> getAll();

    List<Appointment> getMine();

    Appointment create(Appointment appointment);

    Appointment updateStatus(UUID id, AppointmentStatus status, UUID doctorId, String notes);
}
