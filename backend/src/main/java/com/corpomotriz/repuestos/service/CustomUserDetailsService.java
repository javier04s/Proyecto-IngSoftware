package com.corpomotriz.repuestos.service;

import com.corpomotriz.repuestos.model.Usuario;
import com.corpomotriz.repuestos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // Suponiendo que getRol() ahora devuelve una lista o un Set<String> de roles,
        // si solo tienes un rol, puedes convertirlo a lista con Collections.singletonList
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol()));

        // Si tienes múltiples roles (ejemplo):
        // List<GrantedAuthority> authorities = usuario.getRoles().stream()
        //      .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
        //      .collect(Collectors.toList());

        return new User(
                usuario.getEmail(),
                usuario.getContrasena(),
                authorities
        );
    }
}
