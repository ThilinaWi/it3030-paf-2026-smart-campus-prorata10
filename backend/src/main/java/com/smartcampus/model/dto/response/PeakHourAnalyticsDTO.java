package com.smartcampus.model.dto.response;

public class PeakHourAnalyticsDTO {

    private int hour;
    private long bookingCount;

    public PeakHourAnalyticsDTO() {
    }

    public PeakHourAnalyticsDTO(int hour, long bookingCount) {
        this.hour = hour;
        this.bookingCount = bookingCount;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }
}
