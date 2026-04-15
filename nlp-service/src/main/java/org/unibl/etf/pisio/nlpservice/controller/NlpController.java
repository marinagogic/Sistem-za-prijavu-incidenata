package org.unibl.etf.pisio.nlpservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unibl.etf.pisio.nlpservice.dto.SimilarIncidentGroupResponse;
import org.unibl.etf.pisio.nlpservice.service.NlpService;

import java.util.List;

@RestController
@RequestMapping("/api/nlp")
public class NlpController {

    private final NlpService nlpService;

    public NlpController(NlpService nlpService) {
        this.nlpService = nlpService;
    }

    @GetMapping("/test")
    public String test() {
        return "NLP service radi";
    }

    @GetMapping("/similar-groups")
    public List<SimilarIncidentGroupResponse> getSimilarGroups() {
        return nlpService.getSimilarGroups();
    }
}