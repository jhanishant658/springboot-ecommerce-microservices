package MicroService.ECommerce.UserService.Service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import MicroService.ECommerce.UserService.Dto.UserDto;
import MicroService.ECommerce.UserService.Entity.User;
import MicroService.ECommerce.UserService.Repository.UserRepository;
import MicroService.ECommerce.UserService.Security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;
    @Transactional
    public UserDto.SignupResponse signup(UserDto.SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }
       User user = User.builder()
        .userName(request.userName())
        .email(request.email())
        .password(passwordEncoder.encode(request.password()))
        .phone(request.phone())
        .address(request.address())
        .build();

long otp = new SecureRandom().nextInt(9000) + 1000;

UserDto.SignupResponse response =
        new UserDto.SignupResponse(user, otp);

redisService.set(user.getUserName(), response);

return response;
       
    }

    public UserDto.AuthResponse login(UserDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return new UserDto.AuthResponse(jwtTokenProvider.createToken(user), toResponse(user));
    }

    public UserDto.UserResponse getProfile(String userName) {
        return userRepository.findByUserName(userName).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public UserDto.UserResponse updateProfile(String userName, UserDto.ProfileUpdateRequest request) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        return toResponse(userRepository.save(user));
    }

    private UserDto.UserResponse toResponse(User user) {
        return new UserDto.UserResponse(user.getUserName(),  user.getEmail(), user.getPhone(),
                user.getAddress());
    }
   @Transactional
public String verifyUser(String userName, long otp) {

    UserDto.SignupResponse response =
            (UserDto.SignupResponse) redisService.get(userName);

    if (response == null) {
        return "OTP expired";
    }

    if (response.otp() != otp) {
        return "Invalid OTP";
    }

    userRepository.save(response.user());

    redisService.delete(userName);

    return "User verified successfully";
}
}