package Microservice.Eccomerce.Product_Service.Event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProductEvent( Long productId, Long stock) {}
