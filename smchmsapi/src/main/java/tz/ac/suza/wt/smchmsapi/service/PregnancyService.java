package tz.ac.suza.wt.smchmsapi.service;

import java.util.List;
import java.util.UUID;

import tz.ac.suza.wt.smchmsapi.model.Pregnancy;

public interface PregnancyService {

    Pregnancy create(Pregnancy p);

    List<Pregnancy> getAll();

    Pregnancy getById(UUID id);

    List<Pregnancy> getByMother(UUID motherId);

    Pregnancy update(UUID id, Pregnancy p);

    void delete(UUID id);

    void adminCleanup(UUID id);
}
