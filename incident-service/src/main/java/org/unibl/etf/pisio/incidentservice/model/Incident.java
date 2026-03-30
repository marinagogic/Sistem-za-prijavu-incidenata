package org.unibl.etf.pisio.incidentservice.model;

import jakarta.persistence.*;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentStatus;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentSubtype;
import org.unibl.etf.pisio.incidentservice.model.enums.IncidentType;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private IncidentType type;

    @Enumerated(EnumType.STRING)
    private IncidentSubtype subtype;

    @Enumerated(EnumType.STRING)
    private IncidentStatus status;

    @Column(length = 1000)
    private String description;

    @Embedded
    private Location location;

    private String imagePath;

    private LocalDateTime createdAt;

    public Incident() {
        this.status = IncidentStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public IncidentType getType() {
        return type;
    }

    public void setType(IncidentType type) {
        this.type = type;
    }

    public IncidentSubtype getSubtype() {
        return subtype;
    }

    public void setSubtype(IncidentSubtype subtype) {
        this.subtype = subtype;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}