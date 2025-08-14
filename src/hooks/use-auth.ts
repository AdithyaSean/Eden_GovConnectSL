
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User, Citizen } from '@/lib/types';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// This will be our combined user type for the hook
type AuthUser = User | Citizen;

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (uid: string) => {
        try {
            // Check users collection first
            let userDocRef = doc(db, "users", uid);
            let userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUser({ uid, ...userDoc.data() } as User);
                return;
            }

            // If not in users, check citizens collection by uid field
            // Note: This requires querying, as the doc ID is the NIC.
            // A more performant approach would be to have a 'users' collection for all auth users
            // with a 'role' field, but we will follow the prompt's structure.
            const citizenQuery = query(collection(db, "citizens"), where("uid", "==", uid));
            const citizenSnapshot = await getDocs(citizenQuery);

            if (!citizenSnapshot.empty) {
                const citizenDoc = citizenSnapshot.docs[0];
                setUser({ ...citizenDoc.data() } as Citizen);
            } else {
                 console.warn(`No Firestore profile found for user: ${uid}`);
                 setUser(null);
            }

        } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                fetchUserProfile(firebaseUser.uid);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [fetchUserProfile]);

    return { user, loading, refetch: () => auth.currentUser && fetchUserProfile(auth.currentUser.uid) };
}
