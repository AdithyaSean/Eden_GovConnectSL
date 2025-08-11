
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from '@/lib/firebase';


export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

    // This effect handles the initial Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
            setLoading(false); // Auth state is now known
        });
        return () => unsubscribe();
    }, []);


    const fetchUser = useCallback(async () => {
        if (loading) return; // Don't fetch if auth state is still loading

        setLoading(true);
        if (firebaseUser) {
            // User is logged in via Firebase Auth, fetch their profile from Firestore
             try {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUser({ id: userDoc.id, ...userDoc.data() } as User);
                } else {
                     console.warn(`No Firestore profile found for user: ${firebaseUser.uid}`);
                     setUser(null);
                }
             } catch (error) {
                console.error("Error fetching Firestore user profile:", error);
                setUser(null);
             }
        } else {
            // No firebase user, so no app user
            setUser(null);
        }
        setLoading(false);

    }, [firebaseUser, loading]);
        
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    

    return { user, loading, refetch: fetchUser };
}
