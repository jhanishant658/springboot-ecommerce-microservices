package MicroService.ECommerce.OrderService.Security;

import org.springframework.stereotype.Component;

@Component
public class UserContext {

    private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> EMAIL = new ThreadLocal<>();
    private static final ThreadLocal<String> USER_NAME = new ThreadLocal<>();

    public UserContext() {}

    static void set(String userId, String email, String userName) {
        USER_ID.set(userId);
        EMAIL.set(email);
        USER_NAME.set(userName);
    }

    static void clear() {
        USER_ID.remove();
        EMAIL.remove();
        USER_NAME.remove();
    }

    /** Raw string form of the user id, in case you need it as-is. */
    public static String getUserIdRaw() {
        return USER_ID.get();
    }

    /** Parsed numeric user id, or null if missing/not a number. */
    public static Long getUserId() {
        String raw = USER_ID.get();
        if (raw == null || raw.isBlank()) return null;
        try {
            return Long.valueOf(raw);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String getEmail() {
        return EMAIL.get();
    }

    public static String getUserName() {
        return USER_NAME.get();
    }
}
