package MicroService.ECommerce.InventoryService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import MicroService.ECommerce.InventoryService.Model.Inventory;

/**
 * InventoryRepo
 */
public interface InventoryRepo extends JpaRepository<Inventory, Long> {

    Inventory findByProductId(Long productId);

    
}
