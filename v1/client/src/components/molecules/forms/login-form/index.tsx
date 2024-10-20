import React, { useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginData = {
            email,
            password,
        };

        try {
            const response = await axios.post('http://localhost:3333/api/v1/auth/login', loginData);
            setError(null);
            setSuccess(response.data.message);
            console.log('Login successful:', response.data);
        } catch (error: any) {
            setError(error.response?.data.message || 'Error occurred while logging in');
            setSuccess(null);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
