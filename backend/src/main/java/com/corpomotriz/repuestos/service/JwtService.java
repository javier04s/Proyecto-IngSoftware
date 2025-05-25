package com.corpomotriz.repuestos.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException; // Importar para manejar tokens expirados
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException; // Importar para tokens mal formados
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException; // Importar para tokens no soportados
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Importar para errores de firma
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct; // Usar jakarta.annotation si tu Spring Boot es Jakarta EE 9+ (Spring Boot 3+)

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private Key signingKey;

    @PostConstruct
    public void init() {
        // --- AGREGA ESTOS LOGS PARA DEPURACIÓN ---
        System.out.println("DEBUG JWT Service: jwt.secret cargado: " + secret);
        if (secret == null || secret.isEmpty()) {
            System.err.println("DEBUG JWT Service: ¡ADVERTENCIA! jwt.secret es nulo o vacío. El token fallará.");
            throw new RuntimeException("jwt.secret no configurado correctamente en application.properties/yml.");
        } else {
            System.out.println("DEBUG JWT Service: Longitud del secret (Base64): " + secret.length());
        }
        // --- FIN LOGS DE DEPURACIÓN ---

        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            this.signingKey = Keys.hmacShaKeyFor(keyBytes);

            // --- AGREGA ESTE LOG PARA VERIFICAR LA CLAVE GENERADA ---
            System.out.println("DEBUG JWT Service: signingKey generado exitosamente. Algoritmo: " + signingKey.getAlgorithm());
            // --- FIN LOG ---

        } catch (IllegalArgumentException e) {
            System.err.println("ERROR JWT Service: No se pudo decodificar la clave secreta Base64 o longitud incorrecta: " + e.getMessage());
            throw new RuntimeException("Error al inicializar JwtService con la clave secreta.", e);
        } catch (Exception e) {
            System.err.println("ERROR JWT Service: Un error inesperado ocurrió durante la inicialización de la clave: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error crítico al inicializar JwtService.", e);
        }
    }

    /**
     * Genera un token JWT con el nombre de usuario y rol.
     * @param username El nombre de usuario (subject del token).
     * @param role El rol del usuario.
     * @return El token JWT generado.
     */
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Puedes agregar más claims si quieres
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256) // Usa la clave Key generada
                .compact();
    }

    /**
     * Obtiene el username (subject) del token.
     * @param token El token JWT.
     * @return El nombre de usuario.
     */
    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Obtiene el rol del token.
     * @param token El token JWT.
     * @return El rol del usuario.
     */
    public String getRoleFromToken(String token) {
        return getClaims(token).get("role", String.class); // Obtiene el claim llamado "role"
    }

    /**
     * Valida el token (firma y expiración).
     * @param token El token JWT a validar.
     * @return true si el token es válido y no ha expirado, false en caso contrario.
     */
    public boolean validateToken(String token) {
        try {
            getClaims(token); // Al intentar obtener los claims, JJWT valida la firma y la expiración.
            System.out.println("DEBUG JWT Service: Token " + token.substring(0, Math.min(token.length(), 20)) + "... es VÁLIDO.");
            return true;
        } catch (SignatureException e) {
            System.err.println("ERROR JWT Service: Firma JWT inválida: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("ERROR JWT Service: Token JWT mal formado: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("ERROR JWT Service: Token JWT expirado: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("ERROR JWT Service: Token JWT no soportado: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("ERROR JWT Service: Argumento JWT ilegal o cadena vacía: " + e.getMessage());
        } catch (Exception e) { // Captura cualquier otra excepción inesperada
            System.err.println("ERROR JWT Service: Error inesperado al validar token: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("DEBUG JWT Service: Token " + token.substring(0, Math.min(token.length(), 20)) + "... es INVÁLIDO.");
        return false;
    }

    /**
     * Extrae los claims del token.
     * @param token El token JWT.
     * @return Los claims (cuerpo) del token.
     */
    private Claims getClaims(String token) {
        return Jwts.parserBuilder() // Usa parserBuilder()
                .setSigningKey(signingKey) // Usa la clave Key generada
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}