
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User as AppUser } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from '@/lib/firebase';


export function useAuth() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
        let userProfile: AppUser | null = null;
        
        // 1. Check 'users' collection (for workers/admins)
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            userProfile = { id: userDoc.id, ...userDoc.data() } as AppUser;
        } else {
            // 2. If not in 'users', check 'citizens' collection
            const citizensQuery = query(collection(db, "citizens"), where("uid", "==", firebaseUser.uid));
            const citizenSnapshot = await getDocs(citizensQuery);
            if (!citizenSnapshot.empty) {
                const citizenDoc = citizenSnapshot.docs[0];
                const citizenData = citizenDoc.data();
                // Construct a user profile from citizen data
                userProfile = {
                    id: citizenDoc.id, // This will be the NIC
                    uid: firebaseUser.uid,
                    name: citizenData.fullName,
                    email: citizenData.email,
                    nic: citizenData.nic,
                    role: 'Citizen',
                    status: 'Active',
                    joined: firebaseUser.metadata.creationTime || new Date().toISOString(),
                } as unknown as AppUser;
            }
        }
        
        return userProfile;
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                 try {
                    const userProfile = await fetchUserProfile(firebaseUser);
                    setUser(userProfile);
                 } catch(error) {
                    console.error("Error fetching user profile:", error);
                    setUser(null);
                 }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [fetchUserProfile]);
    
    const refetch = useCallback(async () => {
        if (auth.currentUser) {
            setLoading(true);
            const userProfile = await fetchUserProfile(auth.currentUser);
            setUser(userProfile);
            setLoading(false);
        }
    }, [fetchUserProfile]);


    return { user, loading, refetch };
}
