import { createContext, useReducer, useEffect, useState } from 'react';
import AuthReducer from './AuthReducer';
import api from '../utils/axios';


const INITIAL_STATE = {
    user: null,
    isFetching: false,
    error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [loading, setLoading] = useState(true);

    // On mount: check if a token exists and fetch the user from /me
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/api/auth/me');
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            } catch (err) {
                // Token is invalid or expired — clear it
                console.log('Token validation failed:', err);
                localStorage.removeItem('token');
                dispatch({ type: "LOGOUT" });
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            loading,
            dispatch
        }}>{children}</AuthContext.Provider>
    )
}