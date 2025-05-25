package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority; // Importar esta clase
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Importar esta clase
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections; // Importar esta clase

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // CRUCIAL:
        // En lugar de .roles(usuario.getRol()), que añade ROLE_ automáticamente,
        // creamos una autoridad explícitamente con el prefijo "ROLE_"
        // para que coincida con las expectativas de hasAuthority("ROLE_...") en SecurityConfig.
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getRol());

        // Construye el objeto UserDetails con la autoridad ya prefijada
        return new User(
                usuario.getEmail(),
                usuario.getContrasena(),
                Collections.singletonList(authority) // Pasa la lista de autoridades
        );
    }
}