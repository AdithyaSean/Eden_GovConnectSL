"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

const messages = [
  {
    role: "assistant",
    content:
      "Hello! I am your e-Citizen AI Assistant. How can I help you today? You can ask me about services like 'how to apply for a passport' or 'renew my driving license'.",
  },
  {
    role: "user",
    content: "I need to renew my National ID card.",
  },
  {
    role: "assistant",
    content:
      "To renew your National Identity Card, you will need to visit a Divisional Secretariat office with your current NIC, a new photograph, and the relevant application form. Would you like me to find the nearest office for you?",
  },
];

export function AiChatbot() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          size="icon"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline">e-Citizen AI Assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about Sri Lankan e-citizen services.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-1 pr-4 mt-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  data-ai-hint="avatar character"
                  src={
                    message.role === "assistant"
                      ? "https://placehold.co/100x100/30475E/FFFFFF.png"
                      : "https://placehold.co/100x100/F2F4F7/30475E.png"
                  }
                />
                <AvatarFallback>
                  {message.role === "assistant" ? "AI" : <User />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg p-3 text-sm max-w-xs",
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <SheetFooter className="mt-auto pt-4">
          <form className="relative w-full">
            <Input
              placeholder="Type your message..."
              className="pr-12"
              aria-label="Chat message input"
            />
            <Button
              size="icon"
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
