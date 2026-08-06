package MicroService.QuizApp.GateWay.Security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Validates the JWT on every request that hits the gateway (except the
 * whitelisted public paths) and, if valid, forwards the identity of the
 * caller to downstream services as plain headers (X-User-Email, X-User-Name).
 *
 * Downstream services do NOT need to know anything about JWT - they just
 * trust these headers, because (in this setup) the gateway is the only
 * entry point services are reachable from.
 */
@Component
@Order(1)
public class JwtAuthFilter implements Filter {

    private final SecretKey key;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Paths that do NOT require a token. Adjust as you add more public
    // endpoints (e.g. product browsing without login).
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/v1/user/auth/signup",
            "/api/v1/user/auth/login",
            "/api/v1/user/auth/health",
            "/api/v1/user/verifyUser/**",
            "/actuator/**"
    );

    public JwtAuthFilter(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String path = request.getRequestURI();

        if (isPublic(path)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            unauthorized(response, "Missing or malformed Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.get("email", String.class);
            String userName = claims.get("userName", String.class);
            Object userIdClaim = claims.get("userId");
            String userId = userIdClaim == null ? "" : String.valueOf(userIdClaim);

            HttpServletRequest wrapped = new HeaderAddingRequestWrapper(request, userId, email, userName);
            chain.doFilter(wrapped, response);

        } catch (JwtException | IllegalArgumentException ex) {
            unauthorized(response, "Invalid or expired token");
        }
    }

    private boolean isPublic(String path) {
        return PUBLIC_PATHS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }

    /**
     * Adds X-User-Email / X-User-Name headers on top of the original request
     * without mutating it (HttpServletRequest headers are otherwise read-only).
     */
    private static class HeaderAddingRequestWrapper extends HttpServletRequestWrapper {
        private final String userId;
        private final String email;
        private final String userName;

        HeaderAddingRequestWrapper(HttpServletRequest request, String userId, String email, String userName) {
            super(request);
            this.userId = userId == null ? "" : userId;
            this.email = email == null ? "" : email;
            this.userName = userName == null ? "" : userName;
        }

        @Override
        public String getHeader(String name) {
            if ("X-User-Id".equalsIgnoreCase(name)) return userId;
            if ("X-User-Email".equalsIgnoreCase(name)) return email;
            if ("X-User-Name".equalsIgnoreCase(name)) return userName;
            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            if ("X-User-Id".equalsIgnoreCase(name) || "X-User-Email".equalsIgnoreCase(name) || "X-User-Name".equalsIgnoreCase(name)) {
                return java.util.Collections.enumeration(List.of(getHeader(name)));
            }
            return super.getHeaders(name);
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            List<String> names = java.util.Collections.list(super.getHeaderNames());
            names.add("X-User-Id");
            names.add("X-User-Email");
            names.add("X-User-Name");
            return java.util.Collections.enumeration(names);
        }
    }
}
