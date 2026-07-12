package MicroService.ECommerce.UserService.Dto;


public class UserDto {
    public record SignupRequest(String userName, String email, String password, String phone, String address) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token, UserResponse user) {}
    public record ProfileUpdateRequest(String email, String phone, String address) {}
    public record UserResponse( String userName, String email, String phone, String address) {}
}