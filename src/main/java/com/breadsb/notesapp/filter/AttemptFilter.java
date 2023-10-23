package com.breadsb.notesapp.filter;


import com.breadsb.notesapp.services.LoginAttemptService;
import jakarta.servlet.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;

@Component
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class AttemptFilter implements Filter {
    public static final Logger LOGGER = LoggerFactory.getLogger(AttemptFilter.class);
    private final LoginAttemptService loginAttemptService;

    public AttemptFilter(LoginAttemptService service) {
        this.loginAttemptService = service;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String username = request.getParameter("username");
        if(null != username) {
            String userKey = username + request.getRemoteAddr();
            if (loginAttemptService.canAttemptNow(userKey)) {
                chain.doFilter(request, response);
            } else {
                AsyncContext ctx = request.startAsync();
                long l = Duration.between(Instant.now(), loginAttemptService.cantAttemptAfter(userKey)).toMillis();
                l = l > 0 ? l : 1;
                LOGGER.warn("Holding back reponse for next {} milliseconds", l);
                ctx.setTimeout(-1);
                loginAttemptService.addToWaitingQueue(userKey, ctx);
            }
        } else {
            chain.doFilter(request, response);
        }
    }
}
