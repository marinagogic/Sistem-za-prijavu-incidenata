package org.unibl.etf.pisio.alertservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.unibl.etf.pisio.alertservice.dto.IncidentAlertDTO;

import java.util.List;

@FeignClient(name = "incident-service")
public interface IncidentAlertClient {

    @GetMapping("/api/incidents/alert-candidates")
    List<IncidentAlertDTO> getAlertCandidates(@RequestParam("days") Integer days);
}