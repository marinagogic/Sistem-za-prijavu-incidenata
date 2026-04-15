package org.unibl.etf.pisio.nlpservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.unibl.etf.pisio.nlpservice.dto.IncidentNlpDto;
import org.unibl.etf.pisio.nlpservice.dto.SimilarIncidentGroupResponse;
import org.unibl.etf.pisio.nlpservice.dto.SimilarIncidentItemResponse;
import org.unibl.etf.pisio.nlpservice.util.TextSimilarityUtil;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NlpService {

    private final RestTemplate restTemplate;

    @Value("${incident-service.url}")
    private String incidentServiceUrl;

    @Value("${nlp.text-threshold:0.35}")
    private double textThreshold;

    @Value("${nlp.min-group-size:2}")
    private int minGroupSize;

    public NlpService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<SimilarIncidentGroupResponse> getSimilarGroups() {
        List<IncidentNlpDto> incidents = fetchAllIncidents();

        List<IncidentNlpDto> usableIncidents = incidents.stream()
                .filter(i -> i.getDescription() != null && !i.getDescription().isBlank())
                .filter(i -> i.getStatus() == null || !i.getStatus().equalsIgnoreCase("REJECTED"))
                .toList();

        List<SimilarIncidentGroupResponse> groups = new ArrayList<>();
        Set<Long> groupedIds = new HashSet<>();
        int groupId = 1;

        for (int i = 0; i < usableIncidents.size(); i++) {
            IncidentNlpDto base = usableIncidents.get(i);

            if (base.getId() == null || groupedIds.contains(base.getId())) {
                continue;
            }

            List<IncidentNlpDto> currentGroup = new ArrayList<>();
            List<Double> similarities = new ArrayList<>();

            currentGroup.add(base);
            groupedIds.add(base.getId());

            for (int j = i + 1; j < usableIncidents.size(); j++) {
                IncidentNlpDto candidate = usableIncidents.get(j);

                if (candidate.getId() == null || groupedIds.contains(candidate.getId())) {
                    continue;
                }

                double similarity = TextSimilarityUtil.calculateSimilarity(
                        base.getDescription(),
                        candidate.getDescription()
                );

                if (similarity >= textThreshold) {
                    currentGroup.add(candidate);
                    groupedIds.add(candidate.getId());
                    similarities.add(similarity);
                }
            }

            if (currentGroup.size() >= minGroupSize) {
                SimilarIncidentGroupResponse response = new SimilarIncidentGroupResponse();
                response.setGroupId(groupId++);
                response.setAverageSimilarity(calculateAverage(similarities));
                response.setIncidents(
                        currentGroup.stream()
                                .map(this::mapToItem)
                                .toList()
                );
                groups.add(response);
            } else {
                groupedIds.remove(base.getId());
            }
        }

        return groups;
    }

    private List<IncidentNlpDto> fetchAllIncidents() {
        String url = incidentServiceUrl + "/all";

        ResponseEntity<List<IncidentNlpDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        List<IncidentNlpDto> body = response.getBody();
        return body != null ? body : List.of();
    }

    private SimilarIncidentItemResponse mapToItem(IncidentNlpDto dto) {
        SimilarIncidentItemResponse item = new SimilarIncidentItemResponse();
        item.setId(dto.getId());
        item.setType(dto.getType());
        item.setSubtype(dto.getSubtype());
        item.setStatus(dto.getStatus());
        item.setDescription(dto.getDescription());
        item.setAddress(dto.getAddress());
        item.setLatitude(dto.getLatitude());
        item.setLongitude(dto.getLongitude());
        item.setImagePath(dto.getImagePath());
        item.setCreatedAt(dto.getCreatedAt());
        return item;
    }

    private double calculateAverage(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return 1.0;
        }

        return values.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(1.0);
    }
}