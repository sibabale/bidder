import axios from 'axios';
import { useMemo } from 'react';

const useAxios = () => {
    return useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:3333/api/v1',
        });

        const authToken = localStorage.getItem('bidder');

        if (authToken) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        }

        return instance;
    }, []);
};

export default useAxios;
