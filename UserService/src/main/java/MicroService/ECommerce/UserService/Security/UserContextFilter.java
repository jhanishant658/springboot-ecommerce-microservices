package MicroService.ECommerce.UserService.Security;

import java.io.IOException;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Reads the identity headers set by the API Gateway (X-User-Id, X-User-Email,
 * X-User-Name) and exposes them via {@link UserContext} for the duration of
 * the request. This service does NOT validate the JWT itself - it trusts the
 * gateway, which is the only entry point this service should be reachable
 * from in production (block direct access at the network/ingress level).
 */
@Component
@Order(1)
public class UserContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        try {
            UserContext.set(
                    request.getHeader("X-User-Id"),
                    request.getHeader("X-User-Email"),
                    request.getHeader("X-User-Name")
            );
            chain.doFilter(servletRequest, servletResponse);
        } finally {
            UserContext.clear();
        }
    }
}
