'use client';

import { createContext, useEffect, useState, useCallback } from "react";
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
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)

        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    }, [backendUrl])


    const getAuthState = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')

            if (data.success) {
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            console.error('Error fetching auth state:', error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, getUserData]);

    useEffect(() => {
        if (backendUrl) {
            getAuthState();
        }
    }, [backendUrl, getAuthState]);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        getAuthState,
        loading,
        healthInsights, setHealthInsights,
        language, setLanguage
    }

    return (
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    )
}
