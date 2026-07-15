package tz.ac.suza.wt.smchmsapi.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String bearerPrefix = "Bearer ";

        if (authHeader == null || !authHeader.startsWith(bearerPrefix)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(bearerPrefix.length());

        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        Claims claims = jwtService.extractAllClaims(token);

        UUID userId = UUID.fromString(claims.get("userId", String.class));
        String role = claims.get("role", String.class);
        String email = claims.getSubject();
        String name = claims.get("name", String.class);

        // Spring Security expects ROLE_ prefix in authorities when using hasRole("ADMIN")
        String authority = "ROLE_" + role;

        var authentication = new UsernamePasswordAuthenticationToken(
                name + " <" + email + ">",
                userId,
                List.of(new SimpleGrantedAuthority(authority))
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}

