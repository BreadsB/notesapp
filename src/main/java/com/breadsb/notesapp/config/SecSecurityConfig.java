package com.breadsb.notesapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@PropertySource("classpath:security-config.properties")
public class SecSecurityConfig {

    @Value("${=}")
    private String userLogin;

    @Value("${security.password.user}")
    private String userPassword;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsManager() {
        UserDetails user = User
                .withUsername(userLogin)
                .password(passwordEncoder().encode(userPassword))
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/app/**")
                        .hasRole("USER")
                        .requestMatchers("/login")
                        .permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login-action")
                        .defaultSuccessUrl("/view-messages", true)
                        .permitAll()
                )
                .sessionManagement(session -> session
                        .maximumSessions(2)
//                        .maxSessionsPreventsLogin(true)

                )
                .logout(logout -> logout
                        .logoutUrl("/perform_logout")
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        return http.build();
    }
}