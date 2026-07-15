package MicroService.ECommerce.CartService.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import MicroService.ECommerce.CartService.Dto.Product;
import MicroService.ECommerce.CartService.Model.Cart;
import MicroService.ECommerce.CartService.Repository.CartRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class CartService {
    
    private final CartRepository cartRepo ; 
    public Cart createCart(long userId , Product product){
         Cart cart = new Cart();
        
        cart.setId(userId);
        List<Product> products = new ArrayList<>();
        products.add(product); 
        cart.setProducts(new ArrayList<>(products));
         log.info("Creating cart for user with ID: {}", userId);
         return cartRepo.save(cart);
    }    
    public List<Product> getProductsByCartId(Long cartId) {
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
            return cart.getProducts();
        }
        return null;
    }
    public Cart addProductToCart(Long cartId, Product product) {
        log.info("adding item in cart : {}", product);
        Cart cart = cartRepo.findById(cartId).orElse(null);
        if (cart != null) {
            List<Product> products = cart.getProducts();
            if(!products.contains(product)) {
                products.add(product);
            }
            else {
                log.info("Product already in cart : {} , update its quantity", product);
                // Implement quantity update logic here
                Product existingProduct = products.get(products.indexOf(product));
                existingProduct.setQuantity(product.getQuantity());
                log.info("Updated quantity for product : {}", existingProduct);
            }
            cart.setProducts(products);
            cartRepo.save(cart);

            
        }
        log.warn("there is no cart for this id : {}",cartId);
        log.info("creating cart with product : {}",product);


        return createCart(cartId , product);
    }


}