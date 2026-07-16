package tz.ac.suza.wt.smchmsapi.service;

import java.util.List;
import java.util.UUID;

import tz.ac.suza.wt.smchmsapi.model.AncVisit;

public interface AncVisitService {

    AncVisit create(UUID pregnancyId, AncVisit visit);

    List<AncVisit> getByPregnancy(UUID pregnancyId);
}
