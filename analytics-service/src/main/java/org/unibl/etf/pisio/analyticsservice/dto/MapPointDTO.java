package org.unibl.etf.pisio.analyticsservice.dto;

public class MapPointDTO {

    private Double latitude;
    private Double longitude;

    public MapPointDTO() {
    }

    public MapPointDTO(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}