package com.uab.AccidentReport2.service;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccidentReportService2 {
    
    private final JdbcTemplate jdbcTemplate;


    public String getLocationTimeByPlate(String licensePlate) {
        String sql = "SELECT konum_zamani FROM unet.uetds_ats_son_konum WHERE plaka = ?";
        
        try {
            String result = jdbcTemplate.queryForObject(sql, String.class, licensePlate);
            
            if (result == null || result.trim().isEmpty()) {
                return "Bahse konu araç için bakanlığımız sistemine konum verisi iletilmediği,";
            }
            
            String base = result.substring(8, 10) + "." + result.substring(5, 7) + "." + result.substring(0, 4) + " " + result.substring(11, 19);
            return "*Bahse konu araç için en son " + base + " tarihinde bakanlığımız sistemine konum verisi iletildiği,";
            
        } catch (EmptyResultDataAccessException e) {
            return "Bahse konu araç için bakanlığımız sistemine konum verisi iletilmediği,";
        } catch (Exception e) {
            return "Bahse konu araç için bakanlığımız sistemine konum verisi iletilmediği,";
        }
    }

    }


