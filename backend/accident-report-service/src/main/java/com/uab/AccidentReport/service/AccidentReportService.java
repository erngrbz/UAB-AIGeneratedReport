package com.uab.AccidentReport.service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccidentReportService {

    private final JdbcTemplate jdbcTemplate;

    public String getKazaKirimRaporu(String licensePlate, LocalDate date){
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    String formattedDate = date.format(formatter);
    String sql = "SELECT public.kaza_kirim_rapor(?, ?)";
    try {
        Date sqlDate = Date.valueOf(date);
        String result = jdbcTemplate.queryForObject(sql, String.class, licensePlate, sqlDate);
        if (result == null) {
            return licensePlate + " plakalı taşıt hakkında " + formattedDate + " tarihi baz alarak Bakanlığımız kayıtlarında yapılan inceleme neticesinde; \n* Herhangi bir kayda ulaşılamamıştır, \nArz ederim.";
        } else {
            if (result.contains("tespit edilmiştir") || result.contains("Arz ederim")) {
                return result;
            } else {
                return result + "\n* Herhangi bir kayda ulaşılamamıştır, \nArz ederim." ;
            }
        }
    } catch (Exception e) {
        return licensePlate + " plakalı taşıt hakkında " + formattedDate + " tarihi baz alarak Bakanlığımız kayıtlarında yapılan inceleme neticesinde; \n* Herhangi bir kayda ulaşılamamıştır, \nArz ederim.";
    }
    }

}