package MicroService.ECommerce.NotificationService.Controller;

import MicroService.ECommerce.NotificationService.Dto.NotificationDtos;
import MicroService.ECommerce.NotificationService.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    public NotificationDtos.NotificationResponse send(@RequestBody NotificationDtos.NotificationRequest request) {
        return notificationService.send(request);
    }

    @GetMapping("/users")
    public List<NotificationDtos.NotificationResponse> userNotifications() {
        return notificationService.userNotifications();
    }
}
