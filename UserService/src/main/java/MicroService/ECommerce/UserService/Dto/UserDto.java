package MicroService.ECommerce.UserService.Dto;

import MicroService.ECommerce.UserService.Entity.User;

public class UserDto {
    public record SignupRequest(String userName, String email, String password, String phone, String address) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token) {}
    public record ProfileUpdateRequest(String email, String phone, String address) {}
    public record UserResponse( String userName, String email, String phone, String address) {}
    public record SignupResponse(User user , long otp){}
    public record UserEvent(long userId , String email , long otp){ }
    public record otpVerification(String userName , long otp){}
}