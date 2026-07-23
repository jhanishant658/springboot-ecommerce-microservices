package MicroService.ECommerce.CartService.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import MicroService.ECommerce.CartService.Dto.CartProduct;
import MicroService.ECommerce.CartService.Dto.Product;
import MicroService.ECommerce.CartService.Model.Cart;
import MicroService.ECommerce.CartService.Service.CartService;
import MicroService.ECommerce.CartService.ClientRequest.PlaceOrderRequest;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


/**
 * CartController
 */
@RestController
@RequestMapping("api/v1/cart")
@AllArgsConstructor
public class CartController {
    
    private final CartService cartService;
    @PostMapping("/addProduct")
    public ResponseEntity<Cart> addProductToCart(@RequestParam Long cartId, @RequestBody Product product) {
        Cart updatedCart = cartService.addProductToCart(cartId, product);
        return ResponseEntity.ok(updatedCart);
    }
    @PutMapping("/updateProduct")
    public ResponseEntity<Cart> updateProductInCart(@RequestParam Long cartId, @RequestBody List<Product> product) {
        Cart updatedCart = cartService.updateCart(cartId, product);
        return ResponseEntity.ok(updatedCart);
    }
    @PostMapping("getCart")
    public List<CartProduct> getCart(@RequestParam Long cartId) {
        return cartService.getProductsByCartId(cartId);
    }
    @GetMapping("/{userId}/")
    public PlaceOrderRequest placeOrderDetails(@PathVariable("userId") long userId){
        return cartService.getCartDetailsForOrder(userId);
    }
   

    
}