package org.unibl.etf.pisio.alertservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alert_rule_settings")
public class AlertRuleSettings {

    @Id
    private Integer id;

    private Integer lookbackDays;
    private Integer radiusMeters;
    private Integer timeWindowHours;
    private Integer minIncidentCount;
    private Boolean enabled;

    public AlertRuleSettings() {
        this.id = 1;
        this.lookbackDays = 7;
        this.radiusMeters = 500;
        this.timeWindowHours = 24;
        this.minIncidentCount = 3;
        this.enabled = true;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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