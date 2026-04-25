package com.smartcampus.dto.response;

import java.util.List;

public class TicketPageResponse {

    // List of tickets for the current page
    private List<TicketResponse> content;

    //  Current page number
    private int page;

    //  Number of items per page
    private int size;

    //  Total number of tickets available
    private long totalElements;

    //  Total number of pages
    private int totalPages;

    //  Indicates if this is the first page
    private boolean first;

    //  Indicates if this is the last page
    private boolean last;

    // Default constructor
    public TicketPageResponse() {
    }

    // Constructor to set all pagination details at once
    public TicketPageResponse(List<TicketResponse> content,
                              int page,
                              int size,
                              long totalElements,
                              int totalPages,
                              boolean first,
                              boolean last) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.first = first;
        this.last = last;
    }


    // Setter for ticket list
    public void setContent(List<TicketResponse> content) {
        this.content = content;
    }

    // Getter for current page
    public int getPage() {
        return page;
    }

    // Setter for page number
    public void setPage(int page) {
        this.page = page;
    }

    // Getter for page size
    public int getSize() {
        return size;
    }



    // Getter for total elements
    public long getTotalElements() {
        return totalElements;
    }



    // Getter for total pages
    public int getTotalPages() {
        return totalPages;
    }

    // Setter for total pages
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    // Check if this is the first page
    public boolean isFirst() {
        return first;
    }


    // Check if this is the last page
    public boolean isLast() {
        return last;
    }

    // Setter for last page flag
    public void setLast(boolean last) {
        this.last = last;
    }
}