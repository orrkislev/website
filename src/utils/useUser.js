import { atom } from 'recoil';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { auth, firestore } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const userAtom = atom({
    key: 'userAtom',
    default: null
});

export function useUser(){
    const [user, setUser] = useRecoilState(userAtom);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            signInWithPopup(auth, provider);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const userDocRef = doc(firestore, 'users', authUser.uid);
                let userDoc = await getDoc(userDocRef);
                
                if (!userDoc.exists()) {
                    await setDoc(userDocRef, {
                        plan: 'free'
                    });
                    userDoc = await getDoc(userDocRef);
                }
                
                setUser({
                    name: authUser.displayName,
                    uid: authUser.uid,
                    plan: userDoc.data().plan
                });
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, [setUser]);

    const getPlan = ()=>{
        if (!user) return 'none';
        else return user.plan;
    }

    const upgrade = () => {
        setUser((prev) => {
            return {...prev, plan: 'pro'};
        });
    }

    return { user, login, logout, getPlan, upgrade};
};