package com.example.e_learning.controller;

import com.example.e_learning.dto.ChatRequest;
import com.example.e_learning.dto.ChatResponse;
import com.example.e_learning.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String responseMessage = chatbotService.getChatResponse(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(responseMessage));
    }
}
