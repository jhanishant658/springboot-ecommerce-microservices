package MicroService.ECommerce.PaymentService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.PaymentService.Model.Wallet;

/**
 * WalletRepo
 */
public interface WalletRepo extends JpaRepository<Wallet ,Long> {

    
}
