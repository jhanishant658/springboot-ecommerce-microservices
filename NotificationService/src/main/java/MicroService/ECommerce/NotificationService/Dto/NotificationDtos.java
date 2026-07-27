package MicroService.ECommerce.NotificationService.Dto;

import MicroService.ECommerce.NotificationService.Model.Notification;

import java.time.Instant;

public class NotificationDtos {
    public record NotificationRequest(Long userId, String recipient, Notification.Channel channel, String subject, String message) {}

    public record NotificationResponse(Long id, Long userId, String recipient, Notification.Channel channel, String subject, String message, Instant sentAt,
    Notification.Status status, String errorMessage) {}
    public record UserEvent(String email , long otp){
        
    }
}
