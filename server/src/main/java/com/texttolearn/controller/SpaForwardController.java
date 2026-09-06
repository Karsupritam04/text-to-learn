package com.texttolearn.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards client-side React routes to index.html so direct URL navigation
 * and page reloads work seamlessly in production.
 */
@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/course/**",
            "/courses/**",
            "/lesson/**",
            "/my-courses",
            "/login",
            "/signup"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
