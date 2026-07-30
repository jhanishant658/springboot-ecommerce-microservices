package MicroService.ECommerce.InventoryService.Service;

import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import MicroService.ECommerce.InventoryService.Repository.InventoryRepo;
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
  
   public boolean verifyAllStock(OrderEvents event ,boolean isOrderSuccess){
    log.info("verifying product stock ");
       for(Product product : event.products()){
           Inventory inventory = inventoryRepo.findByProductId(product.productId());
           if(inventory.getStock()<product.quantity()){
            if(!isOrderSuccess){
                 kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.FAIL));
            }
               return false ; 
           }
       }
       if(!isOrderSuccess){ kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.SUCCESS));
        log.warn("verification successfull");}
        return true ; 
   }
   public void orderSuccess(OrderEvents event){
    log.info("started decreasing stocks");
        if(!verifyAllStock(event,true)) {

            log.warn("some one buyed before you now the stock is finished we will refund your money in 24hrs");
             kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.FAIL_WITH_MONEY));

            return ; 
        }
    
       for(Product product : event.products()){
           Inventory inventory = inventoryRepo.findByProductId(product.productId());
           
           inventory.setStock(inventory.getStock() - product.quantity());
           inventoryRepo.save(inventory);
       }
       kafka.send("Inventory-event",new InventoryEvent(event.orderId(),Status.SUCCESS_WITH_MONEY));
   }
   public String IncreaseStock(Product product){
       Inventory inventory = inventoryRepo.findByProductId(product.productId());
       inventory.setStock(inventory.getStock() + product.quantity());
       inventoryRepo.save(inventory);
       return "Stock increased successfully";
   }
    @KafkaListener(topics = "order-placed", groupId = "cart-group", containerFactory = "kafkaListenerContainerFactory")
    public void kafkaorderListner(OrderEvents event){
        switch(event.eventType()){
            case ORDER_VERIFICATION :
                 verifyAllStock(event,false);
                 break ; 
            case ORDER_SUCCESS :
                orderSuccess(event);
                break ;
            default :
             break ; 
        }
    }
}