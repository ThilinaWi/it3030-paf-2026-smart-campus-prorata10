package com.smartcampus.model.dto.response;

public class NotificationPreferencesResponse {

    private boolean statusUpdates;
    private boolean technicianUpdates;
    private boolean assignments;
    private boolean system;

    public NotificationPreferencesResponse() {
    }

    public NotificationPreferencesResponse(boolean statusUpdates,
                                           boolean technicianUpdates,
                                           boolean assignments,
                                           boolean system) {
        this.statusUpdates = statusUpdates;
        this.technicianUpdates = technicianUpdates;
        this.assignments = assignments;
        this.system = system;
    }

    public boolean isStatusUpdates() {
        return statusUpdates;
    }

    public void setStatusUpdates(boolean statusUpdates) {
        this.statusUpdates = statusUpdates;
    }

    public boolean isTechnicianUpdates() {
        return technicianUpdates;
    }

    public void setTechnicianUpdates(boolean technicianUpdates) {
        this.technicianUpdates = technicianUpdates;
    }

    public boolean isAssignments() {
        return assignments;
    }

    public void setAssignments(boolean assignments) {
        this.assignments = assignments;
    }

    public boolean isSystem() {
        return system;
    }

    public void setSystem(boolean system) {
        this.system = system;
    }
}
