package MicroService.ECommerce.InventoryService.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Inventory
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
@Id
private Long productId;
private Long Stock;
    
}
