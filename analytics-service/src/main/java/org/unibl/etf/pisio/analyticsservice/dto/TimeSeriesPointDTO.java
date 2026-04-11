package org.unibl.etf.pisio.analyticsservice.dto;

public class TimeSeriesPointDTO {

    private String date;
    private Long count;

    public TimeSeriesPointDTO() {
    }

    public TimeSeriesPointDTO(String date, Long count) {
        this.date = date;
        this.count = count;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}