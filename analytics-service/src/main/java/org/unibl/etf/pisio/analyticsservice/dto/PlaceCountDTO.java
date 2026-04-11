package org.unibl.etf.pisio.analyticsservice.dto;

public class PlaceCountDTO {

    private String address;
    private Long count;

    public PlaceCountDTO() {
    }

    public PlaceCountDTO(String address, Long count) {
        this.address = address;
        this.count = count;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}