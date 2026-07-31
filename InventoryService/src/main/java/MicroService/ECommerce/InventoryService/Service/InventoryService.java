package MicroService.ECommerce.InventoryService.Service;



import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import MicroService.ECommerce.InventoryService.Repository.InventoryRepo;
import MicroService.ECommerce.InventoryService.Events.EventType;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import MicroService.ECommerce.InventoryService.Dtos.InventoryDtos.Product;
import MicroService.ECommerce.InventoryService.Events.InventoryEvent;
import MicroService.ECommerce.InventoryService.Events.Status;
import MicroService.ECommerce.InventoryService.Events.OrderEvents;
import MicroService.ECommerce.InventoryService.Model.Inventory;

/**
 * InventoryService
 */
@Service
@AllArgsConstructor
@Slf4j
public class InventoryService {
   private final InventoryRepo inventoryRepo;
   private final KafkaTemplate<String , InventoryEvent> kafka ; 
  
  
   @KafkaListener(topics = "order-placed", groupId = "inventory-group", containerFactory = "kafkaListenerContainerFactory")
   @Transactional
   public void orderSuccess(OrderEvents event){
    if(event.eventType()!=EventType.INVENTORY_REQUEST) return ; 
// on success of order it will decrease the quantity of products
       for(Product product : event.products()){
           Inventory inventory = inventoryRepo.findByProductId(product.productId());
           if(inventory.getStock()<product.quantity()){
            kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.FAIL));
            // help to rollback previous quantities 
            throw new RuntimeException("Stock not available");
           }
           inventory.setStock(inventory.getStock() - product.quantity());
           inventoryRepo.save(inventory);
       }
       kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.SUCCESS));
   }
   public String IncreaseStock(Product product){
       Inventory inventory = inventoryRepo.findByProductId(product.productId());
       inventory.setStock(inventory.getStock() + product.quantity());
       inventoryRepo.save(inventory);
       return "Stock increased successfully";
   }
}
