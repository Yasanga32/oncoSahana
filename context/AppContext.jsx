'use client';

import { createContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [healthInsights, setHealthInsights] = useState(null);
    const [language, setLanguage] = useState('en'); // 'en' or 'si'

    const getUserData = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            setIsLoggedin(false);
            setUserData(null);
        }
    }, [backendUrl]);


    const getAuthState = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');

            if (data.success) {
                setIsLoggedin(true);
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

    useEffect(() => {
        if (backendUrl) {
            getAuthState();
        }
        
        // Safety timeout
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000);

        return () => clearTimeout(timeout);
    }, [backendUrl, getAuthState]);

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
