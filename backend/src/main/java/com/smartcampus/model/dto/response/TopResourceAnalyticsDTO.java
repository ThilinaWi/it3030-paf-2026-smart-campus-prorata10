package com.smartcampus.model.dto.response;

public class TopResourceAnalyticsDTO {

    private String resourceId;
    private String resourceName;
    private long bookingCount;

    public TopResourceAnalyticsDTO() {
    }

    public TopResourceAnalyticsDTO(String resourceId, String resourceName, long bookingCount) {
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.bookingCount = bookingCount;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }
}
