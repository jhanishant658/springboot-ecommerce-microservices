package MicroService.ECommerce.UserService.Controller;

import MicroService.ECommerce.UserService.Dto.UserDto;
import MicroService.ECommerce.UserService.Service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuthController {
    private final UserService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<UserDto.AuthResponse> signup(@RequestBody UserDto.SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.signup(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserDto.AuthResponse> login(@RequestBody UserDto.LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/users/{UserName}")
    public ResponseEntity<UserDto.UserResponse> profile(@PathVariable String UserName) {
        return ResponseEntity.ok(userService.getProfile(UserName));
    }

    @PutMapping("/users/{UserName}")
    public ResponseEntity<UserDto.UserResponse> updateProfile(@PathVariable String UserName, @RequestBody UserDto.ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(UserName, request));
    }

    @GetMapping("/auth/health")
    public String health() {
        return "user-service is running";
    }
}