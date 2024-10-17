import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import '../styles/index.scss';
import Logo from '../../../molecules/logo';
import Alert from '../../../molecules/alert';
import Button from '../../../atoms/button';
import useAxios from '../../../../hooks/useAxios';
import TextInput from '../../../atoms/text-input';
import { login } from '../../../../store/slices/user';
import PromotionBlob from '../../../molecules/promotion-blob';

interface ISignInDetails {
    email: string;
    password: string;
}

const SignInPage: React.FC = () => {
    const axios = useAxios();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    });

    const initialValues: ISignInDetails = {
        email: '',
        password: '',
    };

    const handleSubmit = async (values: ISignInDetails) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/auth/login', values);

            await localStorage.setItem('bidder', response.data.user.firebaseToken);

            dispatch(
                login({
                    email: response.data.user.email,
                    userId: response.data.user.uid,
                    lastName: response.data.user.lastName,
                    firstName: response.data.user.firstName,
                })
            );

            navigate('/welcome', { replace: true });
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMessage =
                    err.response?.data?.error ||
                    'An error occurred during sign-in. Please try again.';
                console.error('Error during API call:', errorMessage);
                setError(errorMessage);
            } else {
                console.error('Unexpected error:', err);
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth_page_container">
            <div className="main_row">
                <header className="logo_wrapper">
                    <Logo />
                </header>
                <div className="item_one">
                    <div className="form_container">
                        <h1 className="form_header">Welcome back</h1>
                        <Alert message={error || ''} isVisible={!!error} />
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="text_input_wrapper">
                                        <Field
                                            name="email"
                                            type="email"
                                            as={TextInput}
                                            label="Email"
                                            required={true}
                                            disabled={isLoading || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>
                                    <div className="text_input_wrapper">
                                        <Field
                                            name="password"
                                            type="password"
                                            as={TextInput}
                                            label="Password"
                                            required={true}
                                            disabled={isLoading || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        text="Sign In"
                                        variant="primary"
                                        disabled={isLoading || isSubmitting}
                                        className="main_button"
                                    />
                                </Form>
                            )}
                        </Formik>
                        <p className="meta_text">
                            Forgot password?
                            <Link to="/reset-password">Reset</Link>
                        </p>
                        <p className="meta_text">
                            Already have an account?
                            <Link to="/signup">Signup</Link>
                        </p>
                    </div>
                </div>
                <div className="item_two signin_bg_image">
                    <div className="blob">
                        <PromotionBlob
                            blurry={true}
                            heading="Peeling back the layers, data insights where you least expect"
                            subHeading="Create a free account and get full access to all features
                for 30 days. No credit card needed. Trusted by over 4,000
                retailers."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
