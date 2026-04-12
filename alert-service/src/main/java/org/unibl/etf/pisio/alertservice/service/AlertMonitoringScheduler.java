package org.unibl.etf.pisio.alertservice.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AlertMonitoringScheduler {

    private final IncidentClusterDetectionService incidentClusterDetectionService;

    public AlertMonitoringScheduler(IncidentClusterDetectionService incidentClusterDetectionService) {
        this.incidentClusterDetectionService = incidentClusterDetectionService;
    }

    @Scheduled(fixedDelay = 120000)
    public void runPeriodicScan() {
        incidentClusterDetectionService.detectClusters();
    }
}