package org.unibl.etf.pisio.alertservice.service;

import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.client.IncidentAlertClient;
import org.unibl.etf.pisio.alertservice.dto.IncidentAlertDTO;
import org.unibl.etf.pisio.alertservice.model.AlertRuleSettings;

import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class IncidentClusterDetectionService {

    private final IncidentAlertClient incidentAlertClient;
    private final AlertSettingsService alertSettingsService;
    private final AlertEventService alertEventService;

    public IncidentClusterDetectionService(
            IncidentAlertClient incidentAlertClient,
            AlertSettingsService alertSettingsService,
            AlertEventService alertEventService
    ) {
        this.incidentAlertClient = incidentAlertClient;
        this.alertSettingsService = alertSettingsService;
        this.alertEventService = alertEventService;
    }

    public void detectClusters() {
        AlertRuleSettings settings = alertSettingsService.getSettings();

        if (Boolean.FALSE.equals(settings.getEnabled())) {
            return;
        }

        List<IncidentAlertDTO> incidents = incidentAlertClient.getAlertCandidates(settings.getLookbackDays())
                .stream()
                .filter(this::hasCoordinates)
                .sorted(Comparator.comparing(IncidentAlertDTO::getCreatedAt))
                .toList();

        for (IncidentAlertDTO seed : incidents) {
            List<IncidentAlertDTO> cluster = incidents.stream()
                    .filter(candidate -> belongsToSameCluster(seed, candidate, settings))
                    .toList();

            if (cluster.size() < settings.getMinIncidentCount()) {
                continue;
            }

            Double avgLat = cluster.stream()
                    .map(IncidentAlertDTO::getLatitude)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);

            Double avgLng = cluster.stream()
                    .map(IncidentAlertDTO::getLongitude)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);

            String areaDescription = cluster.stream()
                    .map(IncidentAlertDTO::getAddress)
                    .filter(Objects::nonNull)
                    .filter(address -> !address.isBlank())
                    .findFirst()
                    .orElse("Nepoznata lokacija");

            String uniqueKey = buildUniqueKey(cluster, settings);

            if (alertEventService.existsByUniqueKey(uniqueKey)) {
                continue;
            }

            String title = "Učestale prijave na sličnoj lokaciji";
            String description = buildDescription(cluster.size(), settings, areaDescription);

            alertEventService.createEvent(
                    title,
                    description,
                    cluster.size(),
                    avgLat,
                    avgLng,
                    areaDescription,
                    uniqueKey
            );
        }
    }

    private boolean hasCoordinates(IncidentAlertDTO incident) {
        return incident.getLatitude() != null && incident.getLongitude() != null && incident.getCreatedAt() != null;
    }

    private boolean belongsToSameCluster(
            IncidentAlertDTO first,
            IncidentAlertDTO second,
            AlertRuleSettings settings
    ) {
        double distanceMeters = calculateDistanceMeters(
                first.getLatitude(),
                first.getLongitude(),
                second.getLatitude(),
                second.getLongitude()
        );

        long hoursBetween = Math.abs(Duration.between(first.getCreatedAt(), second.getCreatedAt()).toHours());

        return distanceMeters <= settings.getRadiusMeters()
                && hoursBetween <= settings.getTimeWindowHours();
    }

    private String buildUniqueKey(List<IncidentAlertDTO> cluster, AlertRuleSettings settings) {
        String ids = cluster.stream()
                .map(IncidentAlertDTO::getId)
                .sorted()
                .map(String::valueOf)
                .reduce((a, b) -> a + "-" + b)
                .orElse("empty");

        return ids
                + "|r=" + settings.getRadiusMeters()
                + "|t=" + settings.getTimeWindowHours()
                + "|m=" + settings.getMinIncidentCount();
    }

    private String buildDescription(int count, AlertRuleSettings settings, String areaDescription) {
        return "Detektovano je " + count
                + " prijava u radijusu od " + settings.getRadiusMeters()
                + " m, u vremenskom prozoru od " + settings.getTimeWindowHours()
                + " h, za lokaciju: " + areaDescription + ".";
    }

    private double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double earthRadius = 6371000.0;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }
}