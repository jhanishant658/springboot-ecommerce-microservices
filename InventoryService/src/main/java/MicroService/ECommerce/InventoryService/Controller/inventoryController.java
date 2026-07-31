package MicroService.ECommerce.InventoryService.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import MicroService.ECommerce.InventoryService.Dtos.InventoryDtos.Product;
import MicroService.ECommerce.InventoryService.Service.InventoryService;
import lombok.AllArgsConstructor;

/**
 * inventoryController
 */
@RestController
@RequestMapping("/api/v1/stocks")
@AllArgsConstructor
public class inventoryController {
private final InventoryService inventoryService ; 
    public String increaseStock(@RequestBody Product product){
     return inventoryService.IncreaseStock(product);
    }
}