package com.smartcampus.controller;

import com.smartcampus.model.dto.response.BookingTrendPointDTO;
import com.smartcampus.model.dto.response.IncidentsSummaryDTO;
import com.smartcampus.model.dto.response.PeakHourAnalyticsDTO;
import com.smartcampus.model.dto.response.TopResourceAnalyticsDTO;
import com.smartcampus.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    public AdminAnalyticsController(AdminAnalyticsService adminAnalyticsService) {
        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping("/top-resources")
    public ResponseEntity<List<TopResourceAnalyticsDTO>> getTopResources(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminAnalyticsService.getTopResources(limit));
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<List<PeakHourAnalyticsDTO>> getPeakHours() {
        return ResponseEntity.ok(adminAnalyticsService.getPeakHours());
    }

    @GetMapping("/booking-trends")
    public ResponseEntity<List<BookingTrendPointDTO>> getBookingTrends() {
        return ResponseEntity.ok(adminAnalyticsService.getBookingTrends());
    }

    @GetMapping("/incidents-summary")
    public ResponseEntity<IncidentsSummaryDTO> getIncidentsSummary() {
        return ResponseEntity.ok(adminAnalyticsService.getIncidentsSummary());
    }
}
