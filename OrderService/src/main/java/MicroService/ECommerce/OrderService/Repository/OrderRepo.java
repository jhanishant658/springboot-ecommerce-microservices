package MicroService.ECommerce.OrderService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.OrderService.Model.Order;

/**
 * OrderRepo
 */
public interface OrderRepo extends JpaRepository<Order , Long> {

    
}