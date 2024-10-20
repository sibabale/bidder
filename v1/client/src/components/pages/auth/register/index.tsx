import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios'; // Import Axios types

import '../styles/index.scss';
import Logo from '../../../molecules/logo';
import Button from '../../../atoms/button';
import useAxios from '../../../../hooks/useAxios';
import TextInput from '../../../atoms/text-input';
import PromotionBlob from '../../../molecules/promotion-blob';
import Alert from '../../../molecules/alert';

interface ISignUpDetails {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
}

const SignUpPage: React.FC = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        lastName: Yup.string().required('First name is required'),
        firstName: Yup.string().required('First name is required'),
    });

    const initialValues: ISignUpDetails = {
        email: '',
        password: '',
        lastName: '',
        firstName: '',
    };

    const handleSubmit = async (values: ISignUpDetails) => {
        setIsLoading(true);
        setError(null);

        try {
            await axiosInstance.post('/auth/register', values);
            navigate('/signin');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMessage =
                    err.response?.data?.error ||
                    'An error occurred during sign-up. Please try again.';
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
                        <h1 className="form_header">Create Account</h1>
                        <Alert message={error || ''} isVisible={!!error} />{' '}
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="text_input_wrapper">
                                        <Field
                                            name="firstName"
                                            type="text"
                                            as={TextInput}
                                            label="First Name"
                                            required={true}
                                            disabled={isLoading || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="firstName"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>
                                    <div className="text_input_wrapper">
                                        <Field
                                            name="lastName"
                                            type="text"
                                            as={TextInput}
                                            label="Last Name"
                                            required={true}
                                            disabled={isLoading || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="lastName"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>
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
                                        text="Sign Up"
                                        disabled={isLoading || isSubmitting}
                                        variant="secondary"
                                        className="main_button"
                                    />
                                </Form>
                            )}
                        </Formik>
                        <p className="meta_text">
                            Already have an account?
                            <Link to="/signin">Sign in</Link>
                        </p>
                    </div>
                </div>
                <div className="item_two signup_bg_image">
                    <div className="blob">
                        <PromotionBlob
                            heading="We gather fruitful data about your customers"
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

export default SignUpPage;
