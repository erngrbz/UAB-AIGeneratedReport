package com.uab.AccidentReport2.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uab.AccidentReport2.service.AccidentReportService2;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accident")
@RequiredArgsConstructor
public class AccidentReportController2 {
    
    private final AccidentReportService2 accidentReportService;

    @GetMapping(value = "/konum-zamani", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getLocationTimeByPlate(@RequestParam String licensePlate) {
        String locationTime = accidentReportService.getLocationTimeByPlate(licensePlate);
        Map<String, String> jsonResponse = new HashMap<>();
        jsonResponse.put("location_time", locationTime);
        return ResponseEntity.ok(jsonResponse);
    }
}