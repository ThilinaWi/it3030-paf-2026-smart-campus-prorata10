package com.smartcampus.model.dto.response;

import java.util.List;

public class IncidentsSummaryDTO {

    private long totalBookings;
    private long totalIncidents;
    private long activeIncidents;
    private long resolvedIncidents;
    private List<IncidentStatusPointDTO> statusCounts;

    public IncidentsSummaryDTO() {
    }

    public IncidentsSummaryDTO(long totalBookings,
                               long totalIncidents,
                               long activeIncidents,
                               long resolvedIncidents,
                               List<IncidentStatusPointDTO> statusCounts) {
        this.totalBookings = totalBookings;
        this.totalIncidents = totalIncidents;
        this.activeIncidents = activeIncidents;
        this.resolvedIncidents = resolvedIncidents;
        this.statusCounts = statusCounts;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public long getActiveIncidents() {
        return activeIncidents;
    }

    public void setActiveIncidents(long activeIncidents) {
        this.activeIncidents = activeIncidents;
    }

    public long getResolvedIncidents() {
        return resolvedIncidents;
    }

    public void setResolvedIncidents(long resolvedIncidents) {
        this.resolvedIncidents = resolvedIncidents;
    }

    public List<IncidentStatusPointDTO> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(List<IncidentStatusPointDTO> statusCounts) {
        this.statusCounts = statusCounts;
    }
}
