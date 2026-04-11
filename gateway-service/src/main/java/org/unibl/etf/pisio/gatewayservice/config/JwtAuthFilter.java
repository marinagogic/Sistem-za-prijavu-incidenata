package org.unibl.etf.pisio.gatewayservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            return chain.filter(exchange);
        }

        if (isPublicRoute(path, method)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userId = String.valueOf(claims.get("userId"));

            Object rolesClaim = claims.get("roles");
            String role = extractPrimaryRole(rolesClaim);

            if (isModeratorRoute(path, method) && !isModeratorOrAdmin(role)) {
                return forbidden(exchange, "Access denied");
            }

            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(request -> request.headers(headers -> {
                        headers.remove("X-User-Id");
                        headers.remove("X-Role");
                        headers.add("X-User-Id", userId);
                        headers.add("X-Role", role);
                    }))
                    .build();

            return chain.filter(mutatedExchange);

        } catch (Exception e) {
            return unauthorized(exchange, "Invalid or expired token");
        }
    }

    private boolean isPublicRoute(String path, String method) {
        return path.startsWith("/api/auth/")
                || path.equals("/api/incidents/approved")
                || path.equals("/api/incidents/test")
                || path.startsWith("/uploads/")
                || (path.equals("/api/incidents") && method.equals("POST"));
    }

    private boolean isModeratorRoute(String path, String method) {
        return path.equals("/api/incidents/pending")
                || (path.matches("^/api/incidents/\\d+/approve$") && method.equals("PUT"))
                || (path.matches("^/api/incidents/\\d+/reject$") && method.equals("PUT"))
                || path.equals("/api/users")
                || path.equals("/api/users/employee")

                || path.startsWith("/api/analytics/")  || path.equals("/api/users/internal/auth-user")
                || (path.matches("^/api/users/\\d+$") && method.equals("DELETE"));

    }

    private boolean isModeratorOrAdmin(String role) {
        return "MODERATOR".equals(role) || "ADMIN".equals(role);
    }

    private String extractPrimaryRole(Object rolesClaim) {
        if (rolesClaim instanceof List<?> rolesList && !rolesList.isEmpty()) {
            return String.valueOf(rolesList.get(0));
        }
        return String.valueOf(rolesClaim);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse()
                        .bufferFactory()
                        .wrap(bytes))
        );
    }

    private Mono<Void> forbidden(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse()
                        .bufferFactory()
                        .wrap(bytes))
        );
    }

    @Override
    public int getOrder() {
        return -1;
    }
}