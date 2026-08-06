package MicroService.ECommerce.NotificationService.Security;

/**
 * Holds the identity of the authenticated caller for the duration of the
 * current request. Populated by {@link UserContextFilter} from the headers
 * the API Gateway attaches after validating the JWT
 * (X-User-Id, X-User-Email, X-User-Name).
 *
 * Usage in a controller/service:
 *   Long userId    = UserContext.getUserId();
 *   String email   = UserContext.getEmail();
 *   String userName = UserContext.getUserName();
 */
public final class UserContext {

    private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> EMAIL = new ThreadLocal<>();
    private static final ThreadLocal<String> USER_NAME = new ThreadLocal<>();

    private UserContext() {}

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
