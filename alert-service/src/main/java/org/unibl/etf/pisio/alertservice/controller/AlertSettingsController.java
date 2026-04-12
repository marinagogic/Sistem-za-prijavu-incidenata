package org.unibl.etf.pisio.alertservice.controller;

import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.alertservice.dto.AlertSettingsRequest;
import org.unibl.etf.pisio.alertservice.model.AlertRuleSettings;
import org.unibl.etf.pisio.alertservice.service.AlertSettingsService;

@RestController
@RequestMapping("/api/incident-alerts/settings")
public class AlertSettingsController {

    private final AlertSettingsService alertSettingsService;

    public AlertSettingsController(AlertSettingsService alertSettingsService) {
        this.alertSettingsService = alertSettingsService;
    }

    @GetMapping
    public AlertRuleSettings getSettings() {
        return alertSettingsService.getSettings();
    }

    @PutMapping
    public AlertRuleSettings updateSettings(@RequestBody AlertSettingsRequest request) {
        return alertSettingsService.updateSettings(request);
    }
}