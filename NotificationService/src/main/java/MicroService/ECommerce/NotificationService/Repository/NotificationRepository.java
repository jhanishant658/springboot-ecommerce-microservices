package MicroService.ECommerce.NotificationService.Repository;

import MicroService.ECommerce.NotificationService.Model.Notification;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    void deleteNotificationsByUserId(Long userId);
}
