package MicroService.ECommerce.NotificationService.Model;

import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "emails")
@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor
public class Users {
@Id
private long userId ; 
private String email ;
    
}