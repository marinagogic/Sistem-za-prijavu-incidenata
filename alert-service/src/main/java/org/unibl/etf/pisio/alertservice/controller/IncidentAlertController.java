package org.unibl.etf.pisio.alertservice.controller;

import org.springframework.web.bind.annotation.*;
import org.unibl.etf.pisio.alertservice.dto.AlertViewDTO;
import org.unibl.etf.pisio.alertservice.service.AlertEventService;
import org.unibl.etf.pisio.alertservice.service.IncidentClusterDetectionService;

import java.util.List;

@RestController
@RequestMapping("/api/incident-alerts")
public class IncidentAlertController {

    private final AlertEventService alertEventService;
    private final IncidentClusterDetectionService incidentClusterDetectionService;

    public IncidentAlertController(
            AlertEventService alertEventService,
            IncidentClusterDetectionService incidentClusterDetectionService
    ) {
        this.alertEventService = alertEventService;
        this.incidentClusterDetectionService = incidentClusterDetectionService;
    }

    @GetMapping
    public List<AlertViewDTO> getAllAlerts(@RequestParam("moderatorId") Long moderatorId) {
        return alertEventService.getAllForModerator(moderatorId);
    }

    @GetMapping("/unread")
    public List<AlertViewDTO> getUnreadAlerts(@RequestParam("moderatorId") Long moderatorId) {
        return alertEventService.getUnreadForModerator(moderatorId);
    }

    @GetMapping("/unread/count")
    public long getUnreadCount(@RequestParam("moderatorId") Long moderatorId) {
        return alertEventService.countUnreadForModerator(moderatorId);
    }

    @PostMapping("/{alertId}/view")
    public String markAsViewed(
            @PathVariable("alertId") Long alertId,
            @RequestParam("moderatorId") Long moderatorId
    ) {
        alertEventService.markAsViewed(moderatorId, alertId);
        return "Alert označen kao pregledan.";
    }

    @PostMapping("/scan")
    public String runManualScan() {
        incidentClusterDetectionService.detectClusters();
        return "Detekcija uspješno pokrenuta.";
    }
}