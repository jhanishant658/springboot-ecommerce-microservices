package MicroService.ECommerce.NotificationService.Repository;
import MicroService.ECommerce.NotificationService.Model.Users;

import org.springframework.data.jpa.repository.JpaRepository;

public interface  UserRepositoy extends JpaRepository<Users , Long>{

    
}