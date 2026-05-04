import toast from 'react-hot-toast';
import api from './utils/axios';


export const loginCall = async (userCredentials, dispatch) => {

    dispatch({ type: "LOGIN_START" });
    try {
        const res = await api.post('/api/auth/login', userCredentials);
        const { token, ...userData } = res.data;

        // Save token to localStorage for persistent auth
        localStorage.setItem('token', token);

        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: "LOGIN_FAILURE", payload: error });
    }

};