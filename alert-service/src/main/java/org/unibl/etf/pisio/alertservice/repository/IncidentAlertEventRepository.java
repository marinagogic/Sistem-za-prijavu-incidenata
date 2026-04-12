package org.unibl.etf.pisio.alertservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.unibl.etf.pisio.alertservice.model.IncidentAlertEvent;

import java.time.LocalDateTime;
import java.util.List;

public interface IncidentAlertEventRepository extends JpaRepository<IncidentAlertEvent, Long> {

    boolean existsByUniqueKey(String uniqueKey);

    List<IncidentAlertEvent> findAllByOrderByDetectedAtDesc();

    List<IncidentAlertEvent> findByDetectedAtAfter(LocalDateTime time);
}