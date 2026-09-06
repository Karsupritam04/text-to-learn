package com.texttolearn.controller;

import com.texttolearn.service.HinglishNarrationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Milestone 10: Hinglish translation + TTS narration for a lesson's text. */
@RestController
public class NarrationController {

    private final HinglishNarrationService narrationService;

    public NarrationController(HinglishNarrationService narrationService) {
        this.narrationService = narrationService;
    }

    public record NarrationRequest(String text, String voiceName) {}

    @PostMapping("/api/narrate")
    public Map<String, String> narrate(@RequestBody NarrationRequest request) {
        String hinglish = narrationService.translateToHinglish(request.text());
        String audioBase64 = null;
        if (narrationService.isConfigured()) {
            try {
                audioBase64 = narrationService.synthesizeSpeech(hinglish, request.voiceName());
            } catch (Exception ignored) {}
        }
        
        java.util.HashMap<String, String> result = new java.util.HashMap<>();
        result.put("hinglishText", hinglish);
        result.put("status", "success");
        if (audioBase64 != null) {
            result.put("audioBase64", audioBase64);
        }
        return result;
    }
}
