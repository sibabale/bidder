import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import useAxios from './useAxios';
import { logout as LogoutAction } from '../store/slices/user';

const useLogout = () => {
    const axios = useAxios();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = useCallback(async () => {
        await axios.post('/auth/logout');
        localStorage.removeItem('bidder');
        dispatch(LogoutAction());
        navigate('/signin');
    }, [axios, dispatch, navigate]);

    return logout;
};

export default useLogout;
