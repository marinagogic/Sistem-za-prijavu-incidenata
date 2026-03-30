package org.unibl.etf.pisio.incidentservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.pisio.incidentservice.dto.CreateIncidentRequest;
import org.unibl.etf.pisio.incidentservice.dto.IncidentResponse;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentSubtype;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentType;
import org.unibl.etf.pisio.incidentservice.service.IncidentService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping("/test")
    public String test() {
        return "Incident service radi";
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse createIncident(
            @ModelAttribute CreateIncidentRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        return incidentService.createIncident(request, image);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse createIncidentJson(
            @RequestBody CreateIncidentRequest request
    ) throws IOException {
        return incidentService.createIncident(request, null);
    }

    @GetMapping
    public List<IncidentResponse> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/approved")
    public List<IncidentResponse> getApprovedIncidents(
            @RequestParam(required = false) IncidentType type,
            @RequestParam(required = false) IncidentSubtype subtype,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "all") String period
    ) {
        return incidentService.getApprovedIncidentsFiltered(type, subtype, location, period);
    }

    @GetMapping("/pending")
    public List<IncidentResponse> getPendingIncidents() {
        return incidentService.getPendingIncidents();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<IncidentResponse> approveIncident(@PathVariable Long id) {
        return incidentService.approveIncident(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<IncidentResponse> rejectIncident(@PathVariable Long id) {
        return incidentService.rejectIncident(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}