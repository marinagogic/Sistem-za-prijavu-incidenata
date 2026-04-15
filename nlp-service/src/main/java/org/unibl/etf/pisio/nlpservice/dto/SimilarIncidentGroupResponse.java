package org.unibl.etf.pisio.nlpservice.dto;

import java.util.List;

public class SimilarIncidentGroupResponse {

    private Integer groupId;
    private Double averageSimilarity;
    private List<SimilarIncidentItemResponse> incidents;

    public SimilarIncidentGroupResponse() {
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Double getAverageSimilarity() {
        return averageSimilarity;
    }

    public void setAverageSimilarity(Double averageSimilarity) {
        this.averageSimilarity = averageSimilarity;
    }

    public List<SimilarIncidentItemResponse> getIncidents() {
        return incidents;
    }

    public void setIncidents(List<SimilarIncidentItemResponse> incidents) {
        this.incidents = incidents;
    }
}