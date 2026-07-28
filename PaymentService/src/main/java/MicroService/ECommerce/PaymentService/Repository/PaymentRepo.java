package MicroService.ECommerce.PaymentService.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.PaymentService.Model.Payment;


/**
 * PaymentRepo
 */
public interface PaymentRepo extends JpaRepository<Payment , Long> {

    Optional<Payment> findByUserId(Long userId);

    
}