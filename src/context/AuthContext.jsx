
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If supabase is not configured, stop loading
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, metadata) => {
        if (!supabase) return { error: { message: "Supabase not configured" } };
        return supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
    };

    const signIn = async (email, password) => {
        if (!supabase) return { error: { message: "Supabase not configured" } };
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = async () => {
        if (!supabase) return;
        return supabase.auth.signOut();
    };

    const value = {
        user,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
