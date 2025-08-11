
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            // For this prototype, we get the logged-in user's NIC from localStorage.
            // In a real app, this would come from the Firebase Auth session.
            const loggedInNic = localStorage.getItem("loggedInNic");

            if (loggedInNic) {
                const usersRef = collection(db, "users");
                // Query for the user with the matching NIC
                const q = query(usersRef, where("nic", "==", loggedInNic), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    setUser({ id: userDoc.id, ...userDoc.data() } as User);
                } else {
                    // Handle case where NIC is not found
                    console.warn(`No user found with NIC: ${loggedInNic}`);
                    setUser(null);
                }
            } else {
                // No user is "logged in"
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);
        
    useEffect(() => {
        fetchUser();
        
        // Listen for storage changes to update auth state if needed elsewhere
        const handleStorageChange = () => {
            fetchUser();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, [fetchUser]);

    return { user, loading, refetch: fetchUser };
}
