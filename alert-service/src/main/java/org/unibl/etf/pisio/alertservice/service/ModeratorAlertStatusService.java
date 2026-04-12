package org.unibl.etf.pisio.alertservice.service;

import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.model.ModeratorAlertStatus;
import org.unibl.etf.pisio.alertservice.repository.ModeratorAlertStatusRepository;

import java.time.LocalDateTime;

@Service
public class ModeratorAlertStatusService {

    private final ModeratorAlertStatusRepository repository;

    public ModeratorAlertStatusService(ModeratorAlertStatusRepository repository) {
        this.repository = repository;
    }

    public void markViewed(Long moderatorId, Long alertId) {
        if (repository.existsByModeratorIdAndAlertId(moderatorId, alertId)) {
            return;
        }

        ModeratorAlertStatus status = new ModeratorAlertStatus();
        status.setModeratorId(moderatorId);
        status.setAlertId(alertId);
        status.setViewedAt(LocalDateTime.now());
        repository.save(status);
    }

    public boolean isViewed(Long moderatorId, Long alertId) {
        return repository.existsByModeratorIdAndAlertId(moderatorId, alertId);
    }
}