package com.example.e_learning.controller;

import com.example.e_learning.model.SystemSetting;
import com.example.e_learning.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SystemController {

    private final SystemSettingRepository systemSettingRepository;

    @GetMapping("/maintenance-status")
    public ResponseEntity<?> getMaintenanceStatus() {
        String status = systemSettingRepository.findById("maintenance_mode")
                .map(SystemSetting::getValeur)
                .orElse("false");
        return ResponseEntity.ok(Map.of("maintenanceMode", Boolean.parseBoolean(status)));
    }
}
