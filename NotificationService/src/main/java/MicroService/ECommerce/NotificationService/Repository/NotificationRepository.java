package MicroService.ECommerce.NotificationService.Repository;

import MicroService.ECommerce.NotificationService.Model.Notification;
import MicroService.ECommerce.NotificationService.Dto.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    @Query("SELECT DISTINCT new MicroService.ECommerce.NotificationService.Dto.UserDetail(u.userId, u.recipient) FROM Notification u")
    List<UserDetail> findAllUserDetails();
}
