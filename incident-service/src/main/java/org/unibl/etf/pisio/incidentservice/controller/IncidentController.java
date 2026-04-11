package org.unibl.etf.pisio.incidentservice.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
            @Valid @ModelAttribute CreateIncidentRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        return incidentService.createIncident(request, image);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse createIncidentJson(
            @Valid @RequestBody CreateIncidentRequest request
    ) throws IOException {
        return incidentService.createIncident(request, null);
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
    @GetMapping("/all")
    public List<IncidentResponse> getAllIncidents() {
        return incidentService.getAllIncidents();
    }
    @PutMapping("/{id}/reject")
    public ResponseEntity<IncidentResponse> rejectIncident(@PathVariable Long id) {
        return incidentService.rejectIncident(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();

        if (fieldError != null) {
            return ResponseEntity.badRequest().body(fieldError.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body("Validation failed.");
    }

}