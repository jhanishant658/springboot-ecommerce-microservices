package Microservice.Eccomerce.Product_Service.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import Microservice.Eccomerce.Product_Service.Entity.Product;
import org.springframework.data.domain.Page;

public interface ProductRepo extends JpaRepository< Product , Long> {

    Optional<Product> findById(@NonNull Long id);

    Page<Product> findByCategory(String category, Pageable pageable);

    List<Product> findByIdIn(List<Long> productIds);
    
    List<Product> findByTitleContainingIgnoreCase(String keyword);

    List<Product> findByPriceBetween(double min, double max);

    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();


    boolean existsById(@NonNull Long id);

}
