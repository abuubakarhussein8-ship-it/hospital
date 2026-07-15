package tz.ac.suza.wt.smchmsapi.security;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final Key signingKey;
    private final long jwtExpirationMillis;

    public JwtService(
            @Value("${security.jwt.secret:change-me-secret-please-change-me-12345}") String secret,
            @Value("${security.jwt.expirationMillis:900000}") long jwtExpirationMillis // default 15 minutes
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.jwtExpirationMillis = jwtExpirationMillis;
    }

    public String generateToken(UUIDClaims claims) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMillis);

        return Jwts.builder()
                .setClaims(Map.of(
                        "userId", claims.userId().toString(),
                        "role", claims.role(),
                        "name", claims.name(),
                        "email", claims.email(),
                        "type", "access"
                ))
                .setSubject(claims.email())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Claims extractAllClaims(String token) {
        // jjwt 0.12.x compatible parsing
        return Jwts.parser()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }



    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public record UUIDClaims(java.util.UUID userId, String email, String name, String role) {}
}

