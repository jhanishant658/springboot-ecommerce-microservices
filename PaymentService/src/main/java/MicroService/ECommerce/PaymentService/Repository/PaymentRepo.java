package MicroService.ECommerce.PaymentService.Repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.PaymentService.Model.Payment;


/**
 * PaymentRepo
 */
public interface PaymentRepo extends JpaRepository<Payment , Long> {

    List<Payment> findByUserId(Long userId);

    
}