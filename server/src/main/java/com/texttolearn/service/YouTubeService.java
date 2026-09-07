package com.texttolearn.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Milestone 9: resolves a lesson's { type: "video", query } block into real YouTube results.
 * Supports official YouTube Data API v3 when key is provided, with an automatic
 * zero-config fallback to public YouTube search and search embeds so videos ALWAYS work.
 */
@Service
public class YouTubeService {

    private static final Logger log = LoggerFactory.getLogger(YouTubeService.class);

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://www.googleapis.com/youtube/v3")
            .build();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(6))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    private static final Pattern VIDEO_ID_PATTERN = Pattern.compile(
            "\"videoRenderer\":\\{\"videoId\":\"([a-zA-Z0-9_-]{11})\".*?\"title\":\\{\"runs\":\\[\\{\"text\":\"([^\"]+)\""
    );

    @Value("${youtube.api-key:}")
    private String apiKey;

    public record VideoResult(String videoId, String title, String embedUrl) {}

    @Cacheable(value = "youtubeVideos", key = "#query")
    public List<VideoResult> search(String query, int maxResults) {
        int limit = Math.max(1, Math.min(maxResults, 5));

        // 1. Try official YouTube Data API v3 if key is configured
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                JsonNode response = webClient.get()
                        .uri(uriBuilder -> uriBuilder.path("/search")
                                .queryParam("part", "snippet")
                                .queryParam("q", query)
                                .queryParam("maxResults", limit)
                                .queryParam("type", "video")
                                .queryParam("videoEmbeddable", "true")
                                .queryParam("key", apiKey)
                                .build())
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .block(Duration.ofSeconds(5));

                if (response != null && response.has("items") && response.path("items").size() > 0) {
                    List<VideoResult> results = new ArrayList<>();
                    for (JsonNode item : response.path("items")) {
                        String videoId = item.path("id").path("videoId").asText();
                        String title = item.path("snippet").path("title").asText();
                        results.add(new VideoResult(videoId, title, "https://www.youtube.com/embed/" + videoId));
                    }
                    return results;
                }
            } catch (Exception e) {
                log.warn("YouTube API search failed or quota exceeded: {}. Falling back to public search.", e.getMessage());
            }
        }

        // 2. Fast public search scrape (zero-config, extracts real video IDs directly)
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.youtube.com/results?search_query=" + encodedQuery))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .timeout(Duration.ofSeconds(6))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200 && response.body() != null) {
                Matcher matcher = VIDEO_ID_PATTERN.matcher(response.body());
                List<VideoResult> scraped = new ArrayList<>();
                while (matcher.find() && scraped.size() < limit) {
                    String videoId = matcher.group(1);
                    String title = matcher.group(2);
                    if (scraped.stream().noneMatch(v -> v.videoId().equals(videoId))) {
                        scraped.add(new VideoResult(videoId, title, "https://www.youtube.com/embed/" + videoId));
                    }
                }
                if (!scraped.isEmpty()) {
                    return scraped;
                }
            }
        } catch (Exception e) {
            log.warn("Public YouTube search failed: {}. Using search embed fallback.", e.getMessage());
        }

        // 3. Fallback: YouTube Search Embed (always playable directly in iframe)
        String encoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
        return List.of(new VideoResult(
                "search-embed",
                query + " (Recommended Lecture)",
                "https://www.youtube.com/embed?listType=search&list=" + encoded
        ));
    }
}
