package com.smartcampus.model.dto.response;

public class BookingTrendPointDTO {

    private String date;
    private long bookingCount;

    public BookingTrendPointDTO() {
    }

    public BookingTrendPointDTO(String date, long bookingCount) {
        this.date = date;
        this.bookingCount = bookingCount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }
}
