package org.unibl.etf.pisio.analyticsservice.service;

import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.analyticsservice.client.IncidentAnalyticsClient;
import org.unibl.etf.pisio.analyticsservice.dto.AnalyticsIncidentDTO;
import org.unibl.etf.pisio.analyticsservice.dto.MapPointDTO;
import org.unibl.etf.pisio.analyticsservice.dto.MetricCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.OverviewDTO;
import org.unibl.etf.pisio.analyticsservice.dto.PlaceCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.TimeSeriesPointDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class ReportingService {

    private final IncidentAnalyticsClient incidentAnalyticsClient;

    public ReportingService(IncidentAnalyticsClient incidentAnalyticsClient) {
        this.incidentAnalyticsClient = incidentAnalyticsClient;
    }

    public List<AnalyticsIncidentDTO> getIncidents() {
        return incidentAnalyticsClient.fetchAllIncidents();
    }

    public long countTotal() {
        return getIncidents().size();
    }

    public long countLast24Hours() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        return getIncidents().stream()
                .filter(i -> i.getCreatedAt() != null)
                .filter(i -> i.getCreatedAt().isAfter(threshold))
                .count();
    }

    public long countLast7Days() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);

        return getIncidents().stream()
                .filter(i -> i.getCreatedAt() != null)
                .filter(i -> i.getCreatedAt().isAfter(threshold))
                .count();
    }

    public long countLast31Days() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(31);

        return getIncidents().stream()
                .filter(i -> i.getCreatedAt() != null)
                .filter(i -> i.getCreatedAt().isAfter(threshold))
                .count();
    }

    public List<TimeSeriesPointDTO> timelineForLast31Days() {
        LocalDate startDate = LocalDate.now().minusDays(31);

        Map<LocalDate, Long> grouped = getIncidents().stream()
                .filter(i -> i.getCreatedAt() != null)
                .filter(i -> !i.getCreatedAt().toLocalDate().isBefore(startDate))
                .collect(Collectors.groupingBy(
                        i -> i.getCreatedAt().toLocalDate(),
                        TreeMap::new,
                        Collectors.counting()
                ));

        return grouped.entrySet().stream()
                .map(entry -> new TimeSeriesPointDTO(entry.getKey().toString(), entry.getValue()))
                .toList();
    }

    public List<MetricCountDTO> countByType() {
        return getIncidents().stream()
                .filter(i -> i.getType() != null && !i.getType().isBlank())
                .collect(Collectors.groupingBy(
                        AnalyticsIncidentDTO::getType,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new MetricCountDTO(entry.getKey(), entry.getValue()))
                .toList();
    }

    public List<MetricCountDTO> countBySubtype() {
        return getIncidents().stream()
                .filter(i -> i.getSubtype() != null && !i.getSubtype().isBlank())
                .collect(Collectors.groupingBy(
                        AnalyticsIncidentDTO::getSubtype,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new MetricCountDTO(entry.getKey(), entry.getValue()))
                .toList();
    }

    public List<PlaceCountDTO> topLocations() {
        return getIncidents().stream()
                .filter(i -> i.getAddress() != null && !i.getAddress().isBlank())
                .collect(Collectors.groupingBy(
                        AnalyticsIncidentDTO::getAddress,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> new PlaceCountDTO(entry.getKey(), entry.getValue()))
                .toList();
    }

    public List<MapPointDTO> allMapPoints() {
        return getIncidents().stream()
                .filter(i -> i.getLatitude() != null && i.getLongitude() != null)
                .map(i -> new MapPointDTO(i.getLatitude(), i.getLongitude()))
                .toList();
    }

    public long countInsideRadius(double centerLat, double centerLng, double radiusMeters) {
        double radiusKm = radiusMeters / 1000.0;

        return getIncidents().stream()
                .filter(i -> i.getLatitude() != null && i.getLongitude() != null)
                .filter(i -> distanceKm(centerLat, centerLng, i.getLatitude(), i.getLongitude()) <= radiusKm)
                .count();
    }

    public OverviewDTO overview() {
        OverviewDTO overview = new OverviewDTO();
        overview.setTotalIncidents(countTotal());
        overview.setIncidentsLast24Hours(countLast24Hours());
        overview.setIncidentsLast7Days(countLast7Days());
        overview.setIncidentsLast31Days(countLast31Days());
        overview.setByType(countByType());
        overview.setBySubtype(countBySubtype());
        overview.setTopLocations(topLocations());
        overview.setTimeline(timelineForLast31Days());
        return overview;
    }

    private double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double earthRadiusKm = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2)
                * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }
}