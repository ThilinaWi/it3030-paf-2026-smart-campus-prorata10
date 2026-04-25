package com.smartcampus.model.dto.request;

public class UpdateNotificationPreferencesRequest {

    private Boolean statusUpdates;
    private Boolean technicianUpdates;
    private Boolean assignments;
    private Boolean system;

    public Boolean getStatusUpdates() {
        return statusUpdates;
    }

    public void setStatusUpdates(Boolean statusUpdates) {
        this.statusUpdates = statusUpdates;
    }

    public Boolean getTechnicianUpdates() {
        return technicianUpdates;
    }

    public void setTechnicianUpdates(Boolean technicianUpdates) {
        this.technicianUpdates = technicianUpdates;
    }

    public Boolean getAssignments() {
        return assignments;
    }

    public void setAssignments(Boolean assignments) {
        this.assignments = assignments;
    }

    public Boolean getSystem() {
        return system;
    }

    public void setSystem(Boolean system) {
        this.system = system;
    }
}
