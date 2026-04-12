package org.unibl.etf.pisio.incidentservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.pisio.incidentservice.dto.CreateIncidentRequest;
import org.unibl.etf.pisio.incidentservice.dto.IncidentResponse;
import org.unibl.etf.pisio.incidentservice.model.Incident;
import org.unibl.etf.pisio.incidentservice.model.Location;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentStatus;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentSubtype;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentType;
import org.unibl.etf.pisio.incidentservice.repository.IncidentRepository;
import org.unibl.etf.pisio.incidentservice.dto.AlertCandidateResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public IncidentResponse createIncident(CreateIncidentRequest request, MultipartFile image) throws IOException {
        validateDescription(request.getDescription());
        validateLocation(request.getAddress(), request.getLatitude(), request.getLongitude());
        validateSubtype(request.getType(), request.getSubtype());

        Incident incident = new Incident();
        incident.setType(request.getType());
        incident.setSubtype(request.getSubtype());
        incident.setDescription(request.getDescription().trim());
        incident.setLocation(new Location(
                request.getAddress() != null ? request.getAddress().trim() : null,
                request.getLatitude(),
                request.getLongitude()
        ));
        incident.setStatus(IncidentStatus.PENDING);

        if (image != null && !image.isEmpty()) {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path path = Paths.get(uploadDir, fileName);

            Files.createDirectories(path.getParent());
            Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            incident.setImagePath("/uploads/" + fileName);
        }

        Incident saved = incidentRepository.save(incident);
        return mapToResponse(saved);
    }

    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AlertCandidateResponse> getAlertCandidates(Integer days) {
        LocalDateTime threshold = LocalDateTime.now().minusDays(days);

        return incidentRepository.findAll()
                .stream()
                .filter(incident -> incident.getCreatedAt() != null)
                .filter(incident -> !incident.getCreatedAt().isBefore(threshold))
                .filter(incident -> incident.getLocation() != null)
                .filter(incident -> incident.getLocation().getLatitude() != null)
                .filter(incident -> incident.getLocation().getLongitude() != null)
                .map(incident -> {
                    AlertCandidateResponse dto = new AlertCandidateResponse();
                    dto.setId(incident.getId());
                    dto.setType(incident.getType() != null ? incident.getType().name() : null);
                    dto.setSubtype(incident.getSubtype() != null ? incident.getSubtype().name() : null);
                    dto.setStatus(incident.getStatus() != null ? incident.getStatus().name() : null);
                    dto.setAddress(incident.getLocation().getAddress());
                    dto.setLatitude(incident.getLocation().getLatitude());
                    dto.setLongitude(incident.getLocation().getLongitude());
                    dto.setCreatedAt(incident.getCreatedAt());
                    return dto;
                })
                .toList();
    }
    public List<IncidentResponse> getPendingIncidents() {
        return incidentRepository.findByStatus(IncidentStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<IncidentResponse> getApprovedIncidentsFiltered(
            IncidentType type,
            IncidentSubtype subtype,
            String location,
            String period
    ) {
        List<Incident> approved = incidentRepository.findByStatus(IncidentStatus.APPROVED);

        LocalDateTime fromDate = switch (period) {
            case "24h" -> LocalDateTime.now().minusHours(24);
            case "7d" -> LocalDateTime.now().minusDays(7);
            case "31d" -> LocalDateTime.now().minusDays(31);
            default -> null;
        };

        return approved.stream()
                .filter(i -> type == null || i.getType() == type)
                .filter(i -> subtype == null || i.getSubtype() == subtype)
                .filter(i -> location == null || location.isBlank()
                        || (i.getLocation() != null
                        && i.getLocation().getAddress() != null
                        && i.getLocation().getAddress().toLowerCase().contains(location.toLowerCase())))
                .filter(i -> fromDate == null || i.getCreatedAt().isAfter(fromDate))
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<IncidentResponse> approveIncident(Long id) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatus(IncidentStatus.APPROVED);
                    return incidentRepository.save(incident);
                })
                .map(this::mapToResponse);
    }

    public Optional<IncidentResponse> rejectIncident(Long id) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatus(IncidentStatus.REJECTED);
                    return incidentRepository.save(incident);
                })
                .map(this::mapToResponse);
    }

    private void validateDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required.");
        }
    }

    private void validateLocation(String address, Double latitude, Double longitude) {
        boolean hasAddress = address != null && !address.trim().isEmpty();
        boolean hasLatitude = latitude != null;
        boolean hasLongitude = longitude != null;

        if (!hasAddress && !hasLatitude && !hasLongitude) {
            throw new IllegalArgumentException("Address or coordinates are required.");
        }

        if (hasLatitude && !hasLongitude) {
            throw new IllegalArgumentException("Longitude is required when latitude is provided.");
        }

        if (!hasLatitude && hasLongitude) {
            throw new IllegalArgumentException("Latitude is required when longitude is provided.");
        }

        if (hasLatitude && (latitude < -90 || latitude > 90)) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90.");
        }

        if (hasLongitude && (longitude < -180 || longitude > 180)) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180.");
        }
    }

    private void validateSubtype(IncidentType type, IncidentSubtype subtype) {
        if (type == null || subtype == null) {
            return;
        }

        if (subtype.getParentType() != type) {
            throw new IllegalArgumentException("Selected subtype does not belong to selected type.");
        }
    }

    private IncidentResponse mapToResponse(Incident incident) {
        IncidentResponse response = new IncidentResponse();
        response.setId(incident.getId());
        response.setType(incident.getType());
        response.setSubtype(incident.getSubtype());
        response.setStatus(incident.getStatus());
        response.setDescription(incident.getDescription());
        response.setImagePath(incident.getImagePath());
        response.setCreatedAt(incident.getCreatedAt());

        if (incident.getLocation() != null) {
            response.setAddress(incident.getLocation().getAddress());
            response.setLatitude(incident.getLocation().getLatitude());
            response.setLongitude(incident.getLocation().getLongitude());
        }

        return response;
    }
}