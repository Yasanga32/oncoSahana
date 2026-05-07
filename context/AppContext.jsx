'use client';

import { createContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [healthInsights, setHealthInsights] = useState(null);
    const [language, setLanguage] = useState('en'); // 'en' or 'si'

    // Ensure axios sends cookies
    axios.defaults.withCredentials = true;

    const getUserData = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                // If user data fetch fails, the session is likely stale or invalid
                setIsLoggedin(false);
                setUserData(null);
                // We don't toast "User not found" on every refresh for guests
                if (data.message !== 'User not found') {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            setIsLoggedin(false);
            setUserData(null);
        }
    }, [backendUrl]);


    const getAuthState = useCallback(async () => {
        try {
            // If we're already logged in, don't block
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');

            if (data.success) {
                setIsLoggedin(true);
                // Fetch user data without blocking the main loading state if possible
                getUserData();
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Error fetching auth state:', error.message);
            setIsLoggedin(false);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, getUserData]);

    // Track if we've already tried to wake up services to avoid spamming
    const wakeupAttempted = useRef(false);

    // Wake up Render services in the background
    const wakeUpServices = useCallback(async () => {
        if (wakeupAttempted.current) return;
        wakeupAttempted.current = true;

        const services = ['/api/auth/is-auth', '/blog-api/blog', '/feedback-api/feedback'];
        services.forEach(url => {
            axios.get(url).catch(() => {}); // We don't care about the result, just want to wake them up
        });
    }, []);

    useEffect(() => {
        if (backendUrl) {
            getAuthState();
            wakeUpServices(); // Start waking up other services
        }
        
        // Safety timeout
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000);

        return () => clearTimeout(timeout);
    }, [backendUrl, getAuthState, wakeUpServices]);

    const value = useMemo(() => ({
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        getAuthState,
        loading,
        healthInsights, setHealthInsights,
        language, setLanguage
    }), [
        backendUrl, isLoggedin, userData, loading, healthInsights, language,
        getUserData, getAuthState
    ]);

    return (
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    )
}
