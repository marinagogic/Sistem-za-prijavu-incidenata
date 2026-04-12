package org.unibl.etf.pisio.alertservice.service;

import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.dto.AlertSettingsRequest;
import org.unibl.etf.pisio.alertservice.model.AlertRuleSettings;
import org.unibl.etf.pisio.alertservice.repository.AlertRuleSettingsRepository;

@Service
public class AlertSettingsService {

    private final AlertRuleSettingsRepository repository;

    public AlertSettingsService(AlertRuleSettingsRepository repository) {
        this.repository = repository;
    }

    public AlertRuleSettings getSettings() {
        return repository.findById(1).orElseGet(() -> repository.save(new AlertRuleSettings()));
    }

    public AlertRuleSettings updateSettings(AlertSettingsRequest request) {
        AlertRuleSettings settings = getSettings();

        settings.setLookbackDays(request.getLookbackDays());
        settings.setRadiusMeters(request.getRadiusMeters());
        settings.setTimeWindowHours(request.getTimeWindowHours());
        settings.setMinIncidentCount(request.getMinIncidentCount());
        settings.setEnabled(request.getEnabled());

        return repository.save(settings);
    }
}