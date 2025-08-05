"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { services } from "@/lib/data";
import { Button } from "./ui/button";

export function SearchBar() {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredServices =
    search.trim().length > 1
      ? services.filter((s) =>
          s.title.toLowerCase().includes(search.toLowerCase())
        )
      : [];
  
  React.useEffect(() => {
    if (search.trim().length > 1 && filteredServices.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [search, filteredServices.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <PopoverTrigger asChild>
          <Input
            placeholder="Search services..."
            className="pl-9 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-1">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <Button
                key={service.title}
                variant="ghost"
                className="flex items-center justify-start gap-2"
                asChild
              >
                <a href="#">
                  <service.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{service.title}</span>
                </a>
              </Button>
            ))
          ) : (
             <div className="p-4 text-sm text-center text-muted-foreground">
               No services found.
             </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
