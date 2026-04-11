package org.unibl.etf.pisio.analyticsservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.pisio.analyticsservice.dto.MapPointDTO;
import org.unibl.etf.pisio.analyticsservice.dto.MetricCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.OverviewDTO;
import org.unibl.etf.pisio.analyticsservice.dto.PlaceCountDTO;
import org.unibl.etf.pisio.analyticsservice.dto.TimeSeriesPointDTO;
import org.unibl.etf.pisio.analyticsservice.service.ReportingService;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/summary")
    public OverviewDTO summary() {
        return reportingService.overview();
    }

    @GetMapping("/time/24h")
    public long incidentsLast24Hours() {
        return reportingService.countLast24Hours();
    }

    @GetMapping("/time/7d")
    public long incidentsLast7Days() {
        return reportingService.countLast7Days();
    }

    @GetMapping("/time/31d")
    public long incidentsLast31Days() {
        return reportingService.countLast31Days();
    }

    @GetMapping("/time/timeline")
    public List<TimeSeriesPointDTO> timeline() {
        return reportingService.timelineForLast31Days();
    }

    @GetMapping("/type")
    public List<MetricCountDTO> byType() {
        return reportingService.countByType();
    }

    @GetMapping("/subtype")
    public List<MetricCountDTO> bySubtype() {
        return reportingService.countBySubtype();
    }

    @GetMapping("/location/top")
    public List<PlaceCountDTO> topLocations() {
        return reportingService.topLocations();
    }

    @GetMapping("/location/points")
    public List<MapPointDTO> mapPoints() {
        return reportingService.allMapPoints();
    }

    @GetMapping("/location/radius")
    public long countInRadius(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radiusMeters
    ) {
        return reportingService.countInsideRadius(lat, lng, radiusMeters);
    }
}