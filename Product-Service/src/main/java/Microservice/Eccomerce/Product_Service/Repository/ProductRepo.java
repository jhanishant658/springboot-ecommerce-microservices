package Microservice.Eccomerce.Product_Service.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import Microservice.Eccomerce.Product_Service.Entity.Product;


public interface ProductRepo extends JpaRepository< Product , Long> {

    Optional<Product> findById(@NonNull Long id);

}
