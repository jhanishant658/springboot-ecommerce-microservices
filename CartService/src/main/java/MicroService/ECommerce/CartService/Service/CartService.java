package MicroService.ECommerce.CartService.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import MicroService.ECommerce.CartService.Dto.CartProduct;
import MicroService.ECommerce.CartService.Dto.Product;

import MicroService.ECommerce.CartService.Events.OrderEvents;
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
    // create cart if it does n't exist 
    @Transactional
    public Cart createCart(long userId , Product product){
         Cart cart = new Cart();
        
        cart.setId(userId);
        List<Product> products = new ArrayList<>();
        products.add(product); 
        cart.setProducts(new ArrayList<>(products));
         log.info("Creating cart for user with ID: {}", userId);
         return cartRepo.save(cart);
    }   
    //Get all product of cart  
    public List<CartProduct> getProductsByCartId(Long cartId) {
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
           List<Long> productIds = cart.getProducts().stream()
                    .map(Product::getId)
                    .toList();
            return productService.getProductsByIds(productIds);
        }
        return null;
    }
    // add product to cart if it exist else create new cart with product
    @Transactional
    public Cart addProductToCart(Long cartId, Product product) {
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
        log.info("creating cart with product : {}",product);


        return createCart(cartId , product);
    }
    // update cart product and its quantiy
    public Cart updateCart(Long cartId, List<Product> product) {
      
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
            cart.setProducts(product);
            return cartRepo.save(cart);
        }
        log.warn("there is no cart for this id : {}",cartId);
        log.info("creating cart with product : {}",product);

        return createCart(cartId , product.get(0));
    }
   @KafkaListener(topics = "order-events", groupId = "cart-group")
    public void deleteProducts(OrderEvents event){
        if ("ORDER_PLACED".equals(event.eventType())){
            long cartId = event.userId();
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
            cart.setProducts(new ArrayList<>());
            cartRepo.save(cart);
            log.info("cart cleared successfully");
            return ; 
        }
        log.warn("there is no cart for this id : {}",cartId);
        
    }

    }
    public PlaceOrderRequest getCartDetailsForOrder(long userId) {
        Cart cart = cartRepo.findById(userId).orElse(null);
        if (cart != null) {
            List<Product> products = cart.getProducts();
            long totalAmount = products.stream()
                    .mapToLong(product -> product.getPrice() * product.getQuantity())
                    .sum();
            return new PlaceOrderRequest(userId, products, totalAmount);
        }
        log.warn("there is no cart for this user id : {}",userId);
        return null;
    }


}