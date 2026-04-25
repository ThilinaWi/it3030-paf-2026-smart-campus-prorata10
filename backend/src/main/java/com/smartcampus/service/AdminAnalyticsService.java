package com.smartcampus.service;

import com.smartcampus.model.Resource;
import com.smartcampus.model.dto.response.BookingTrendPointDTO;
import com.smartcampus.model.dto.response.IncidentStatusPointDTO;
import com.smartcampus.model.dto.response.IncidentsSummaryDTO;
import com.smartcampus.model.dto.response.PeakHourAnalyticsDTO;
import com.smartcampus.model.dto.response.TopResourceAnalyticsDTO;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    private static final String BOOKINGS_COLLECTION = "bookings";
    private static final String INCIDENTS_COLLECTION = "incident_tickets";

    private final MongoTemplate mongoTemplate;
    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public AdminAnalyticsService(MongoTemplate mongoTemplate,
                                 BookingRepository bookingRepository,
                                 ResourceRepository resourceRepository) {
        this.mongoTemplate = mongoTemplate;
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<TopResourceAnalyticsDTO> getTopResources(int requestedLimit) {
        long safeLimit = Math.max(1, Math.min(requestedLimit, 10));

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("resourceId").count().as("bookingCount"),
                Aggregation.sort(Sort.Direction.DESC, "bookingCount"),
                Aggregation.limit(safeLimit)
        );

        List<Document> rows = mongoTemplate
                .aggregate(aggregation, BOOKINGS_COLLECTION, Document.class)
                .getMappedResults();

        List<String> resourceIds = rows.stream()
                .map(row -> row.getString("_id"))
                .filter(id -> id != null && !id.isBlank())
                .toList();

        Map<String, String> resourceNames = resourceRepository.findAllById(resourceIds)
                .stream()
                .collect(Collectors.toMap(Resource::getId, Resource::getName));

        List<TopResourceAnalyticsDTO> response = new ArrayList<>();
        for (Document row : rows) {
            String resourceId = row.getString("_id");
            long bookingCount = toLong(row.get("bookingCount"));
            String resourceName = resourceNames.getOrDefault(resourceId, "Unknown Resource");
            response.add(new TopResourceAnalyticsDTO(resourceId, resourceName, bookingCount));
        }
        return response;
    }

    public List<PeakHourAnalyticsDTO> getPeakHours() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("createdAt").ne(null)),
                Aggregation.project()
                        .and(DateOperators.Hour.hourOf("createdAt"))
                        .as("hour"),
                Aggregation.group("hour").count().as("bookingCount"),
                Aggregation.sort(Sort.Direction.DESC, "bookingCount")
        );

        List<PeakHourAnalyticsDTO> result = mongoTemplate
                .aggregate(aggregation, BOOKINGS_COLLECTION, Document.class)
                .getMappedResults()
                .stream()
                .map(row -> new PeakHourAnalyticsDTO(toInt(row.get("_id")), toLong(row.get("bookingCount"))))
                .sorted(Comparator.comparingInt(PeakHourAnalyticsDTO::getHour))
                .toList();

        return result;
    }

    public List<BookingTrendPointDTO> getBookingTrends() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("createdAt").ne(null)),
                Aggregation.project()
                        .and(DateOperators.dateOf("createdAt").toString("%Y-%m-%d"))
                        .as("day"),
                Aggregation.group("day").count().as("bookingCount"),
                Aggregation.sort(Sort.Direction.ASC, "_id")
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, BOOKINGS_COLLECTION, Document.class);

        return results.getMappedResults()
                .stream()
                .map(row -> new BookingTrendPointDTO(row.getString("_id"), toLong(row.get("bookingCount"))))
                .toList();
    }

    public IncidentsSummaryDTO getIncidentsSummary() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("isDeleted").ne(true)),
                Aggregation.group("status").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count")
        );

        List<Document> rows = mongoTemplate
                .aggregate(aggregation, INCIDENTS_COLLECTION, Document.class)
                .getMappedResults();

        Map<String, Long> rawStatusCounts = new HashMap<>();
        for (Document row : rows) {
            String status = row.getString("_id");
            rawStatusCounts.put(status, toLong(row.get("count")));
        }

        long open = rawStatusCounts.getOrDefault("OPEN", 0L);
        long inProgress = rawStatusCounts.getOrDefault("IN_PROGRESS", 0L) + rawStatusCounts.getOrDefault("ASSIGNED", 0L);
        long resolved = rawStatusCounts.getOrDefault("RESOLVED", 0L);
        long closed = rawStatusCounts.getOrDefault("CLOSED", 0L);

        long totalIncidents = open + inProgress + resolved + closed;
        long activeIncidents = open + inProgress;
        long totalBookings = bookingRepository.count();

        Map<String, Long> pieStatusMap = new LinkedHashMap<>();
        pieStatusMap.put("OPEN", open);
        pieStatusMap.put("IN_PROGRESS", inProgress);
        pieStatusMap.put("RESOLVED", resolved);
        pieStatusMap.put("CLOSED", closed);

        List<IncidentStatusPointDTO> statusCounts = pieStatusMap.entrySet()
                .stream()
                .map(entry -> new IncidentStatusPointDTO(entry.getKey(), entry.getValue()))
                .toList();

        return new IncidentsSummaryDTO(totalBookings, totalIncidents, activeIncidents, resolved, statusCounts);
    }

    private long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }

    private int toInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }
}
