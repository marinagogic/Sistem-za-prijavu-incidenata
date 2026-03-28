package org.unibl.etf.pisio.incidentservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IncidentController {

    @GetMapping("/api/incidents/test")
    public String test() {
        return "Incident service radi";
    }
}