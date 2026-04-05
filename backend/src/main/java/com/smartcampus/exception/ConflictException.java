package com.smartcampus.exception;

/**
 * Exception thrown when a scheduling conflict is detected for a resource booking.
 */
public class ConflictException extends RuntimeException {

    private final String resourceName;
    private final String conflictDetails;

    public ConflictException(String resourceName, String conflictDetails) {
        super(String.format("Scheduling conflict for %s: %s", resourceName, conflictDetails));
        this.resourceName = resourceName;
        this.conflictDetails = conflictDetails;
    }

    public String getResourceName() { return resourceName; }
    public String getConflictDetails() { return conflictDetails; }
}
