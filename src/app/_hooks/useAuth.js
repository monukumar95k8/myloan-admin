"use client"

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function useAuth() {
    console.log("UseAuth middleware triggered");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkUserRole = async (uid) => {
        try {
            let userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists() && userDoc.data().role == "admin") {
                return true
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    let superAdmin = await checkUserRole(firebaseUser.uid);
                    console.log(superAdmin, "Super Admin")
                    firebaseUser.superAdmin = superAdmin;
                    setUser(firebaseUser);
                } catch (err) {
                    console.log(err);
                }

            } else {
                setUser(null);
                router.push("/login")
            };
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);
    return { user, loading }
}