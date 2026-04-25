package com.smartcampus.model.enums;

public enum TicketStatus {

    // Ticket is newly created and not yet handled
    OPEN,

    //  Ticket has been assigned to a technician
    ASSIGNED,

    // Work is currently in progress
    IN_PROGRESS,

    //  Issue has been resolved
    RESOLVED,

    //  Ticket is fully closed/completed
    CLOSED
}