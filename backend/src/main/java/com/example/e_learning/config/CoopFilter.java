package com.example.e_learning.config;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Simple filter that sets Cross-Origin-Opener-Policy to allow popups opened by
 * the frontend to
 * still be able to call window.closed without being blocked by COOP.
 */
@Component
public class CoopFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // Allow popups to be opened and controlled by the opener
        response.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        filterChain.doFilter(request, response);
    }
}
