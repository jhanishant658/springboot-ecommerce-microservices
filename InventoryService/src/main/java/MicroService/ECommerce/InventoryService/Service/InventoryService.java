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
  
  
  
   @Transactional
   public void orderSuccess(OrderEvents event){
    if(event.eventType()!=EventType.INVENTORY_REQUEST) return ; 
// on success of order it will decrease the quantity of products
       for(Product product : event.products()){
           Inventory inventory = inventoryRepo.findByProductId(product.id());
           if(inventory.getStock()<product.quantity()){
           
            // help to rollback previous quantities 
            throw new RuntimeException("Stock not available");
           }
           inventory.setStock(inventory.getStock() - product.quantity());
           inventoryRepo.save(inventory);
       }
   }
   public String IncreaseStock(Product product){
       Inventory inventory = inventoryRepo.findByProductId(product.id());
       if(inventory==null){
        inventory = new Inventory();
        inventory.setProductId(product.id());
        inventory.setStock(0L);
       }
       inventory.setStock(inventory.getStock() + product.quantity());
       inventoryRepo.save(inventory);
       return "Stock increased successfully";
   }
   @KafkaListener(topics = "order-placed", groupId = "inventory-group", containerFactory = "kafkaListenerContainerFactory")
   public void kafkaListner(OrderEvents event){
   if(event.eventType()!=EventType.INVENTORY_REQUEST) return ; 
   try{
       orderSuccess(event);
       kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.SUCCESS ,event.email()));
   }
    catch(Exception e){
          log.error("Error processing order: " + e.getMessage());
           kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.FAIL,event.email()));
   }
}
}
