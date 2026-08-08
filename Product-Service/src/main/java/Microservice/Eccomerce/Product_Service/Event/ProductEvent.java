package Microservice.Eccomerce.Product_Service.Event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProductEvent(EventType eventType, Long productId, Long stock) {}
enum EventType {
    PRODUCT_CREATED,
    
}