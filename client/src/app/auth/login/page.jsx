'use client'

import Link from 'next/link'
import axios from 'axios'
import * as Yup from 'yup'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Alert from '../../../components/molecules/alert'
import Button from '../../../components/atoms/button/button'
import TextInput from '../../../components/atoms/text-input'
import { login } from '../../../lib/store/slices/user/index'
import PasswordInput from '../../../components/atoms/password-input/password-input'
import PromotionBlob from '../../../components/molecules/promotion-blob'

const SignInPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const [authError, setAuthError] = useState()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    })

    const initialValues = {
        email: '',
        password: '',
    }

    const { error, mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            const BASE_URL = process.env.NEXT_PUBLIC_BEARER_API_URL
            const response = await axios.post(`${BASE_URL}/api/login`, values)

            localStorage.setItem('biddar', response.data.firebaseToken)
            return response.data.user
        },
        onSuccess: (user) => {
            dispatch(
                login({
                    email: user.email,
                    userId: user.userId,
                    lastName: user.lastName,
                    firstName: user.firstName,
                })
            )
            router.replace('/auctions')
        },
        onError: (error) => {
            if (error.response) {
                setAuthError(
                    error.response.data.message ||
                        (error.response.data.errors
                            ? error.response.data.errors[0].msg
                            : 'Unknown error')
                )
            } else if (error.request) {
                console.error('Network Error:', error.request)
                setAuthError('Network error, please try again later.')
            } else {
                console.error('Error:', error.message)
                setAuthError(error.message)
            }
        },
    })

    return (
        <div className="h-screen">
            <div className="p-5 absolute">
                <Link href="/" className="flex items-center outline-none">
                    <div className="h-10 w-10 bg-bidder-primary rounded-full"></div>
                    <h1 className="ml-3 text-black text-2xl font-bold">
                        Biddar
                    </h1>
                </Link>
            </div>

            <div className="flex h-full">
                <div className="w-full h-full flex flex-col lg:items-center justify-center sm:w-1/2">
                    <div className="w-full lg:w-1/2 p-5">
                        <h1 className="text-2xl font-bold mb-10">
                            Welcome back
                        </h1>

                        <Alert
                            message={
                                authError || 'An unexpected error occurred'
                            }
                            isVisible={!!error}
                        />

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                mutate(values, {
                                    onSuccess: () => {
                                        setSubmitting(false)
                                    },
                                    onError: (error) => {
                                        setSubmitting(false)
                                    },
                                })
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="text_input_wrapper mb-5">
                                        <Field
                                            name="email"
                                            type="email"
                                            as={TextInput}
                                            label="Email"
                                            required
                                            disabled={isPending || isSubmitting}
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
                                            as={PasswordInput}
                                            label="Password"
                                            required
                                            disabled={isPending || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="small"
                                            className="validation_msg"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        text="Login"
                                        variant="primary"
                                        isLoading={isPending}
                                        disabled={isPending || isSubmitting}
                                        className={`p-5 w-full my-10 text-white bg-bidder-primary ${isPending || isSubmitting ? 'cursor-not-allowed bg-bidder-primary/40' : ''}`}
                                    />
                                </Form>
                            )}
                        </Formik>

                        <p className="mb-5">
                            Forgot password?
                            <Link
                                href="/auth/reset-password"
                                className="ml-2 text-bidder-primary"
                            >
                                Reset
                            </Link>
                        </p>
                        <p>
                            Don’t have an account?
                            <Link
                                href="/auth/register"
                                className="ml-2 text-bidder-primary"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="p-5 w-full sm:w-1/2 hidden sm:flex sm:flex-col justify-center bg-orange-500 bg-cover bg-center  bg-[url(/images/bg.png)]">
                    <div className="blob">
                        <PromotionBlob
                            blurry
                            heading="Verified seller, Meet serious buyer"
                            subHeading="Create a free account and get full access to all features
                            for 30 days. No credit card needed. Trusted by over 4,000
                            retailers."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage
