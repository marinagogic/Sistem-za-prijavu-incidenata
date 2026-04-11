package org.unibl.etf.pisio.analyticsservice.dto;

import java.util.List;

public class OverviewDTO {

    private Long totalIncidents;
    private Long incidentsLast24Hours;
    private Long incidentsLast7Days;
    private Long incidentsLast31Days;
    private List<MetricCountDTO> byType;
    private List<MetricCountDTO> bySubtype;
    private List<PlaceCountDTO> topLocations;
    private List<TimeSeriesPointDTO> timeline;

    public OverviewDTO() {
    }

    public Long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(Long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public Long getIncidentsLast24Hours() {
        return incidentsLast24Hours;
    }

    public void setIncidentsLast24Hours(Long incidentsLast24Hours) {
        this.incidentsLast24Hours = incidentsLast24Hours;
    }

    public Long getIncidentsLast7Days() {
        return incidentsLast7Days;
    }

    public void setIncidentsLast7Days(Long incidentsLast7Days) {
        this.incidentsLast7Days = incidentsLast7Days;
    }

    public Long getIncidentsLast31Days() {
        return incidentsLast31Days;
    }

    public void setIncidentsLast31Days(Long incidentsLast31Days) {
        this.incidentsLast31Days = incidentsLast31Days;
    }

    public List<MetricCountDTO> getByType() {
        return byType;
    }

    public void setByType(List<MetricCountDTO> byType) {
        this.byType = byType;
    }

    public List<MetricCountDTO> getBySubtype() {
        return bySubtype;
    }

    public void setBySubtype(List<MetricCountDTO> bySubtype) {
        this.bySubtype = bySubtype;
    }

    public List<PlaceCountDTO> getTopLocations() {
        return topLocations;
    }

    public void setTopLocations(List<PlaceCountDTO> topLocations) {
        this.topLocations = topLocations;
    }

    public List<TimeSeriesPointDTO> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<TimeSeriesPointDTO> timeline) {
        this.timeline = timeline;
    }
}