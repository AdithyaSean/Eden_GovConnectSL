
"use client";

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';

// This is a mock authentication hook for the prototype.
// In a real application, this would be replaced with Firebase Auth.
const mockUser: User = {
    id: "user-nimal",
    name: "Nimal Silva",
    email: "nimal.s@example.com",
    nic: "199012345V",
    role: "Citizen",
    status: "Active",
    joined: new Date().toISOString(),
};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user data
        setTimeout(() => {
            setUser(mockUser);
            setLoading(false);
        }, 500); // Simulate network delay
    }, []);

    return { user, loading };
}
