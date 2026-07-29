package MicroService.ECommerce.InventoryService.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import MicroService.ECommerce.InventoryService.Repository.InventoryRepo;
import lombok.AllArgsConstructor;
import MicroService.ECommerce.InventoryService.Dtos.InventoryDtos.Product;
import MicroService.ECommerce.InventoryService.Model.Inventory;

/**
 * InventoryService
 */
@Service
@AllArgsConstructor
public class InventoryService {
   private final InventoryRepo inventoryRepo;
  
   public void verifyAllStock(List<Product> products){
       for(Product product : products){
           Inventory inventory = inventoryRepo.findByProductId(product.productId());
           if(inventory.getStock()<product.quantity()){
               throw new IllegalArgumentException("Product is out of stock");
           }
       }
   }
   public void orderSuccess(List<Product> products){
       for(Product product : products){
           Inventory inventory = inventoryRepo.findByProductId(product.productId());
           if(inventory.getStock()<product.quantity()){
               throw new IllegalArgumentException("Product is out of stock");
           }
           inventory.setStock(inventory.getStock() - product.quantity());
           inventoryRepo.save(inventory);
       }
   }
   public String IncreaseStock(Product product){
       Inventory inventory = inventoryRepo.findByProductId(product.productId());
       inventory.setStock(inventory.getStock() + product.quantity());
       inventoryRepo.save(inventory);
       return "Stock increased successfully";
   }
    
}