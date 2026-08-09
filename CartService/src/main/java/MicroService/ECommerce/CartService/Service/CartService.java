package MicroService.ECommerce.CartService.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import MicroService.ECommerce.CartService.Dto.CartProduct;
import MicroService.ECommerce.CartService.Dto.Product;

import MicroService.ECommerce.CartService.Events.OrderEvents;
import MicroService.ECommerce.CartService.Security.UserContext;
import MicroService.ECommerce.CartService.Events.UserEvent;
import MicroService.ECommerce.CartService.Events.CartEvent;
import MicroService.ECommerce.CartService.Model.Cart;
import MicroService.ECommerce.CartService.Repository.CartRepository;
import MicroService.ECommerce.CartService.Client.ProductService;
import MicroService.ECommerce.CartService.ClientRequest.PlaceOrderRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class CartService {
    
    private final CartRepository cartRepo ; 
    private final ProductService productService ;
    private final RedisService redisService ;
    private final KafkaTemplate<String , CartEvent> kafka ; 
    private final UserContext userContext ;
    // create cart if it does n't exist 
    @Transactional
     @KafkaListener(topics = "user-event", groupId = "cart-group", containerFactory = "userkafkaListenerContainerFactory")
    public Cart createCart(UserEvent event){
        // when user signup cart will created 
        long userId = event.userId();
         Cart cart = new Cart();
         cart.setId(userId);
         log.info("Creating cart for user with ID: {}", userId);
         return cartRepo.save(cart);
    }   
    //Get all product of cart  
    public List<CartProduct> getProductsByCartId() {
        Long cartId = userContext.getUserId();
      if(redisService.get("cart.cartProducts." + cartId) != null){
        log.info("Retrieved products for cart ID {} from Redis cache", cartId);
        return (List<CartProduct>) redisService.get("cart.cartProducts." + cartId);
      }
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
           List<Long> productIds = cart.getProducts().stream()
                    .map(Product::getId)
                    .toList();
            List<CartProduct> cartProducts = productService.getProductsByIds(productIds);
            redisService.set("cart.cartProducts." + cartId, cartProducts);
            log.info("Retrieved products for cart ID {}: {}", cartId, cartProducts);
            return cartProducts;
        }
        return null;
    }
    // add product to cart if it exist else create new cart with product
    @Transactional
    public Cart addProductToCart( Product product) {
        Long cartId = userContext.getUserId();
        log.info("adding item in cart : {}", product);
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
            List<Product> products = cart.getProducts();
            if(!products.contains(product)) {
                products.add(product);
            }
            else {
                log.info("Product already in cart : {} ", product);
                return cart; 
            }
            cart.setProducts(products);
           return cartRepo.save(cart);
        }
        log.warn("there is no cart for this id : {}",cartId);
        


        return null;
    }
    // update cart product and its quantiy
    public Cart updateCart(List<Product> product) {
        Long cartId = userContext.getUserId();
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
            cart.setProducts(product);
            return cartRepo.save(cart);
        }
        log.warn("there is no cart for this id : {}",cartId);
        log.info("creating cart with product : {}",product);

       return null ; 
    }
   
    public void deleteProducts(OrderEvents event){
        log.info(" delete product function run start");
        log.info("event recieved:{}",event);
        
        
        log.info("event type matched");
            long cartId = event.userId();
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if(cart==null){
           log.warn("there is no cart for this id : {}",cartId);
           return ; 
        }
        if(redisService.get("cart.cartProducts." + cartId) != null){
            redisService.delete("cart.cartProducts." + cartId);
            log.info("deleted cart products from redis for cart id : {}",cartId);
        }
        
        if (!cart.getProducts().isEmpty()) {
            cart.setProducts(new ArrayList<>());
            cartRepo.save(cart);
            log.info("cart cleared successfully");
            return ; 
        }
        log.warn("there is no product in this cart for this id : {}",cartId);
        
    

    }
     
    public void  getCartDetailsForOrder(OrderEvents event) {
       log.info("get cart detail starts"); 
        long userId = event.userId();
        Cart cart = cartRepo.findById(userId).orElse(null);
        
        if (cart != null) {
            List<Product> products = cart.getProducts();
            long totalAmount = products.stream()
                    .mapToLong(product -> product.getPrice() * product.getQuantity())
                    .sum();
            PlaceOrderRequest req = new PlaceOrderRequest(userId, products, totalAmount);
            
            log.info("cart details for order: {}", req);
            CartEvent ev = new CartEvent(event.orderId(),event.email(),req);
            log.info("sending cart event to order service");
            kafka.send("cart-event", ev);


        }
        
        
    }
    @KafkaListener(topics = "order-placed", groupId = "cart-group", containerFactory = "kafkaListenerContainerFactory")
    public void kafkaorderListner(OrderEvents event){
       switch(event.eventType()){
        case ORDER_PENDING :
             getCartDetailsForOrder(event);
             break ;
        case ORDER_PLACED :
             deleteProducts(event);
             break ;
        default:
            break; 
       }
    }
}