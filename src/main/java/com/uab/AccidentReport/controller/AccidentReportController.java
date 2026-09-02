package com.uab.AccidentReport.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uab.AccidentReport.service.AccidentReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accident")
@RequiredArgsConstructor
public class AccidentReportController {

    private final AccidentReportService accidentReportService;

    @GetMapping(value = "/kirim-raporu", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getKazaKirimRaporu(@RequestParam String licensePlate, @RequestParam LocalDate date) {
        String report = accidentReportService.getKazaKirimRaporu(licensePlate, date);
        Map<String, String> jsonResponse = new HashMap<>();
        jsonResponse.put("report", report);
        return ResponseEntity.ok(jsonResponse);
    }
}