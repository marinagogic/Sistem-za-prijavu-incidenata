package org.unibl.etf.pisio.alertservice.service;

import org.springframework.stereotype.Service;
import org.unibl.etf.pisio.alertservice.dto.AlertViewDTO;
import org.unibl.etf.pisio.alertservice.model.IncidentAlertEvent;
import org.unibl.etf.pisio.alertservice.repository.IncidentAlertEventRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertEventService {

    private final IncidentAlertEventRepository repository;
    private final ModeratorAlertStatusService moderatorAlertStatusService;

    public AlertEventService(
            IncidentAlertEventRepository repository,
            ModeratorAlertStatusService moderatorAlertStatusService
    ) {
        this.repository = repository;
        this.moderatorAlertStatusService = moderatorAlertStatusService;
    }

    public IncidentAlertEvent createEvent(
            String title,
            String description,
            Integer incidentCount,
            Double centerLatitude,
            Double centerLongitude,
            String areaDescription,
            String uniqueKey
    ) {
        IncidentAlertEvent event = new IncidentAlertEvent();
        event.setTitle(title);
        event.setDescription(description);
        event.setIncidentCount(incidentCount);
        event.setCenterLatitude(centerLatitude);
        event.setCenterLongitude(centerLongitude);
        event.setAreaDescription(areaDescription);
        event.setUniqueKey(uniqueKey);
        event.setDetectedAt(LocalDateTime.now());

        return repository.save(event);
    }

    public boolean existsByUniqueKey(String uniqueKey) {
        return repository.existsByUniqueKey(uniqueKey);
    }

    public List<AlertViewDTO> getAllForModerator(Long moderatorId) {
        return repository.findAllByOrderByDetectedAtDesc()
                .stream()
                .map(event -> mapToView(event, moderatorId))
                .toList();
    }

    public List<AlertViewDTO> getUnreadForModerator(Long moderatorId) {
        return repository.findAllByOrderByDetectedAtDesc()
                .stream()
                .filter(event -> !moderatorAlertStatusService.isViewed(moderatorId, event.getId()))
                .map(event -> mapToView(event, moderatorId))
                .toList();
    }

    public long countUnreadForModerator(Long moderatorId) {
        return repository.findAllByOrderByDetectedAtDesc()
                .stream()
                .filter(event -> !moderatorAlertStatusService.isViewed(moderatorId, event.getId()))
                .count();
    }

    public void markAsViewed(Long moderatorId, Long alertId) {
        moderatorAlertStatusService.markViewed(moderatorId, alertId);
    }

    private AlertViewDTO mapToView(IncidentAlertEvent event, Long moderatorId) {
        AlertViewDTO dto = new AlertViewDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setIncidentCount(event.getIncidentCount());
        dto.setCenterLatitude(event.getCenterLatitude());
        dto.setCenterLongitude(event.getCenterLongitude());
        dto.setAreaDescription(event.getAreaDescription());
        dto.setDetectedAt(event.getDetectedAt());
        dto.setRead(moderatorAlertStatusService.isViewed(moderatorId, event.getId()));
        return dto;
    }
}