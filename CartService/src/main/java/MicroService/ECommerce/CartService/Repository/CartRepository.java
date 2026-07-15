package MicroService.ECommerce.CartService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.CartService.Model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    
}
