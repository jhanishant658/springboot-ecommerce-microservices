package MicroService.ECommerce.UserService.Security;

import java.nio.charset.StandardCharsets;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import MicroService.ECommerce.UserService.Entity.User;

@Component
public class JwtTokenProvider {
    private final Key key;
    private final long expirationMs;
 
    public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String createToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getUserName())
                
                .expiration(expiry)
                .signWith(key)
                .compact();
    }
}