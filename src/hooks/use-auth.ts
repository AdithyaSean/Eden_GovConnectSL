
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
        });
        return () => unsubscribe();
    }, []);


    const fetchUser = useCallback(async () => {
        // Don't fetch if we are in the initial loading state for auth
        if (firebaseUser === undefined) {
           setLoading(true);
           return;
        }

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
            // For prototype purposes, fall back to localStorage if no Firebase user
            // In a real app, you would likely just set user to null here.
            const loggedInNic = localStorage.getItem("loggedInNic");
            if (loggedInNic) {
                 try {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("nic", "==", loggedInNic), limit(1));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setUser({ id: userDoc.id, ...userDoc.data() } as User);
                    } else {
                        setUser(null);
                    }
                 } catch(e) {
                     console.error("Error fetching user by NIC:", e);
                     setUser(null);
                 }
            } else {
                setUser(null);
            }
        }
        setLoading(false);

    }, [firebaseUser]);
        
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    

    return { user, loading, refetch: fetchUser };
}
