import React, { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

// import '../styles/index.scss';
import Logo from '../../../molecules/alert';
import Alert from '../../../molecules/alert';
import Button from '../../../atoms/button';
import useAxios from '../../../../hooks/useAxios';
import TextInput from '../../../atoms/text-input';
import PromotionBlob from '../../../molecules/promotion-blob';

interface IResetPasswordDetails {
    email: string;
    newPassword: string;
    oldPassword: string;
}

const ResetPasswordPage: React.FC = () => {
    const axios = useAxios();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .min(8, 'New password must be at least 8 characters')
            .required('New password is required'),
    });

    const initialValues: IResetPasswordDetails = {
        email: '',
        newPassword: '',
        oldPassword: '',
    };

    const handleSubmit = async (values: IResetPasswordDetails) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.post('/reset-password', values);

            if (response.data.status === 200) {
                navigate('/signin');
            } else {
                setError(response.data.error || 'Password reset failed. Please try again.');
            }
        } catch (error) {
            const errorMessage =
                (error as any).response?.data?.error ||
                'An error occurred during password reset. Please try again.';
            console.error('Error during API call:', errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth_page_container">
            <div className="main_row">
                {/* <header className="logo_wrapper">
                    <Logo />
                </header> */}
                <div className="item_one">
                    <div className="form_container">
                        <h1 className="form_header">Reset Password</h1>
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
                                            name="oldPassword"
                                            type="password"
                                            as={TextInput}
                                            label="Old Password"
                                            required={true}
                                            disabled={isLoading || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="oldPassword"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>
                                    <div className="text_input_wrapper">
                                        <Field
                                            name="newPassword"
                                            type="password"
                                            as={TextInput}
                                            label="New Password"
                                            required={true}
                                        />
                                        <ErrorMessage
                                            name="newPassword"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        text="Reset Password"
                                        variant="primary"
                                        disabled={isLoading || isSubmitting}
                                        className="main_button"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="item_two password_reset_bg">
                    <div className="blob">
                        <PromotionBlob
                            blurry={true}
                            heading="Squeezing every drop of data for you"
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

export default ResetPasswordPage;
