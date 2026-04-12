package org.unibl.etf.pisio.alertservice.dto;

public class AlertSettingsRequest {

    private Integer lookbackDays;
    private Integer radiusMeters;
    private Integer timeWindowHours;
    private Integer minIncidentCount;
    private Boolean enabled;

    public Integer getLookbackDays() {
        return lookbackDays;
    }

    public void setLookbackDays(Integer lookbackDays) {
        this.lookbackDays = lookbackDays;
    }

    public Integer getRadiusMeters() {
        return radiusMeters;
    }

    public void setRadiusMeters(Integer radiusMeters) {
        this.radiusMeters = radiusMeters;
    }

    public Integer getTimeWindowHours() {
        return timeWindowHours;
    }

    public void setTimeWindowHours(Integer timeWindowHours) {
        this.timeWindowHours = timeWindowHours;
    }

    public Integer getMinIncidentCount() {
        return minIncidentCount;
    }

    public void setMinIncidentCount(Integer minIncidentCount) {
        this.minIncidentCount = minIncidentCount;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}