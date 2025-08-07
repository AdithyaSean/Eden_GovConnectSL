
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

type Message = {
    role: "user" | "assistant";
    content: string;
}

const sampleQueries = [
    "How do I renew my driving license?",
    "What documents are needed for a passport application?",
    "Find the nearest Divisional Secretariat office.",
    "Explain the process of registering a new business."
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length > 0 ? (
            messages.map((message, index) => (
            <div
                key={index}
                className={cn(
                "flex items-start gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
                )}
            >
                {message.role === "assistant" && (
                <Avatar className="h-9 w-9">
                    <AvatarImage data-ai-hint="avatar character" src="https://placehold.co/100x100/4A7C59/FFFFFF.png" />
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                )}
                <div
                className={cn(
                    "rounded-xl p-4 text-sm max-w-lg shadow-sm",
                    message.role === "assistant"
                    ? "bg-card text-card-foreground"
                    : "bg-primary text-primary-foreground"
                )}
                >
                <p>{message.content}</p>
                </div>
                {message.role === "user" && (
                <Avatar className="h-9 w-9">
                    <AvatarImage data-ai-hint="avatar user" src="https://placehold.co/100x100/F2F4F7/30475E.png" />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                )}
            </div>
            ))
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage data-ai-hint="avatar character" src="https://placehold.co/100x100/4A7C59/FFFFFF.png" />
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">e-Citizen AI Assistant</h2>
                <p className="text-muted-foreground mb-2 max-w-md">
                    Hello! I am your e-Citizen AI Assistant for Sri Lanka. How can I help you today? You can ask me about services like 'how to apply for a passport' or 'renew my driving license'.
                </p>
                <p className="text-muted-foreground mb-8">Or, get started with one of the suggestions below.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {sampleQueries.map(query => (
                        <Card key={query} className="p-4 text-left hover:bg-muted transition-colors cursor-pointer" onClick={() => setInput(query)}>
                            <p className="font-medium">{query}</p>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </div>
      <div className="p-4 bg-background border-t">
        <form className="relative max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about passport renewal, vehicle registration, etc."
            className="pr-14 h-12 rounded-full shadow-sm"
            aria-label="Chat message input"
          />
          <Button
            size="icon"
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
            aria-label="Send message"
            disabled={!input}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
