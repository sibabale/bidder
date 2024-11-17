'use client'

import Link from 'next/link'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Alert from '../../../components/molecules/alert'
import Button from '../../../components/atoms/button/button'
import TextInput from '../../../components/atoms/text-input'
import PromotionBlob from '../../../components/molecules/promotion-blob'

const SignUpPage = () => {
    const router = useRouter()
    const [authError, setAuthError] = useState()
    const [complycubeInstance, setComplycubeInstance] = useState(null)

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .test(
                'hasUpperCase',
                'Password must contain at least one uppercase letter',
                (value) => /[A-Z]/.test(value)
            )
            .test(
                'hasLowerCase',
                'Password must contain at least one lowercase letter',
                (value) => /[a-z]/.test(value)
            )
            .test(
                'hasNumber',
                'Password must contain at least one number',
                (value) => /\d/.test(value)
            )
            .test(
                'hasSpecialChar',
                'Password must contain at least one special character',
                (value) => /[@$!%*?&]/.test(value)
            ),
        lastName: Yup.string().required('Last name is required'),
        firstName: Yup.string().required('First name is required'),
    })

    const initialValues = {
        email: '',
        password: '',
        lastName: '',
        firstName: '',
    }

    const { mutate: verifyMutate, isPending: isVerifying } = useMutation({
        mutationFn: async (values) => {
            return axios.post(`${BASE_URL}/register/verify`, values)
        },
        onSuccess: async (_, values) => {
            await startVerification(values)
        },
        onError: (error) => {
            setAuthError(error.response?.data?.message || 'Verification failed')
        },
    })

    const { mutate: mutateRegistration, isPending: isRegistering } =
        useMutation({
            mutationFn: (values) => {
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL
                return axios.post(`${BASE_URL}/register`, values)
            },
            onSuccess: async (user) => {
                localStorage.setItem('biddar', user.data.jwtToken)
                await new Promise((resolve) => setTimeout(resolve, 100))
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

    const isPending = isVerifying || isRegistering

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setAuthError(null)
            await verifyMutate(values)
        } catch (error) {
            console.error('Error during registration process:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const [isSDKLoaded, setIsSDKLoaded] = useState(false)

    useEffect(() => {
        const checkSDK = () => {
            if (window.ComplyCube) {
                setIsSDKLoaded(true)
                return
            }
            setTimeout(checkSDK, 500)
        }
        checkSDK()

        return () => {
            if (complycubeInstance) {
                complycubeInstance.unmount()
            }
        }
    }, [])

    const startVerification = async (userData) => {
        if (window.ComplyCube) {
            try {
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL
                const response = await fetch(`${BASE_URL}/generate-kyc-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(
                        errorData.error || 'Failed to generate KYC token'
                    )
                }

                const { token, clientId } = await response.json()

                if (!token) {
                    throw new Error('No token received from server')
                }

                const instance = window.ComplyCube.mount({
                    token,
                    containerId: 'complycube-mount',
                    stages: [
                        'intro',
                        'documentCapture',
                        {
                            name: 'faceCapture',
                            options: {
                                mode: 'video',
                            },
                        },
                        'completion',
                    ],
                    onComplete: async (data) => {
                        try {
                            const response = await axios.post(
                                `${BASE_URL}/identity-check`,
                                {
                                    data,
                                    clientId,
                                }
                            )

                            console.log(response.data)

                            if (response.data.result === 'clear') {
                                try {
                                    await mutateRegistration(userData)
                                    if (instance) {
                                        instance.unmount()
                                        setComplycubeInstance(null)
                                    }
                                    await new Promise((resolve) =>
                                        setTimeout(resolve, 100)
                                    )
                                    router.push('/auctions')
                                } catch (error) {
                                    console.error(
                                        'Registration failed after verification:',
                                        error
                                    )
                                    setAuthError(
                                        'Registration failed after verification. Please try again.'
                                    )
                                }
                            } else if (response.data.result === 'rejected') {
                                setAuthError('Your verification was not successful. Please ensure your documents are valid and try again.')
                            } else {
                                setAuthError('Identity verification failed. Please try again.')
                            }
                        } catch (error) {
                            console.error('Identity check error:', error)
                            setAuthError(
                                error.response?.data?.message ||
                                    'Identity check failed'
                            )
                        }
                    },
                    onModalClose: () => {
                        if (instance) {
                            instance.unmount()
                            setComplycubeInstance(null)
                        }
                    },
                    onError: ({ type, message }) => {
                        console.error('Error:', message)
                        setAuthError(message)
                    },
                })
                setComplycubeInstance(instance)
            }
        }
    }

    return (
        <div className="h-screen">
            <div className="p-5 md:absolute">
                <Link href="/" className="flex items-center">
                    <div className="h-10 w-10 bg-bidder-primary rounded-full"></div>
                    <h1 className="ml-3 text-black text-2xl font-bold">
                        Biddar
                    </h1>
                </Link>
            </div>
            <div className="flex h-full">
                <div className="item_one w-full h-full flex flex-col lg:items-center justify-center sm:w-1/2">
                    <div className="p-5 w-full lg:w-1/2">
                        <h1 className="text-2xl font-bold mb-10">
                            Create Account
                        </h1>
                        <Alert message={authError} isVisible={!!authError} />
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            validateOnChange={true}
                            validateOnBlur={true}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-5">
                                        <Field
                                            name="firstName"
                                            type="text"
                                            as={TextInput}
                                            label="First Name"
                                            required
                                            autoComplete="given-name"
                                            disabled={isPending || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="firstName"
                                            component="small"
                                            className="text-red-400"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Field
                                            name="lastName"
                                            type="text"
                                            as={TextInput}
                                            label="Last Name"
                                            required
                                            autoComplete="family-name"
                                            disabled={isPending || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="lastName"
                                            component="small"
                                            className="text-red-400"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Field
                                            name="email"
                                            type="email"
                                            as={TextInput}
                                            label="Email"
                                            required
                                            autoComplete="email"
                                            disabled={isPending || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="small"
                                            className="text-red-400"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Field
                                            name="password"
                                            type="password"
                                            as={TextInput}
                                            label="Password"
                                            required
                                            autoComplete="new-password"
                                            disabled={isPending || isSubmitting}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="small"
                                            className="text-red-400"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        text="Register"
                                        disabled={isPending || !isSDKLoaded}
                                        isLoading={isPending}
                                        variant="secondary"
                                        className={`p-5 w-full my-10 text-white bg-bidder-primary ${
                                            isPending || !isSDKLoaded
                                                ? 'cursor-not-allowed bg-bidder-primary/40'
                                                : ''
                                        }`}
                                    />
                                </Form>
                            )}
                        </Formik>
                        <p className="meta_text">
                            Already have an account?
                            <Link
                                href="/auth/login"
                                className="ml-2 text-bidder-primary"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
                <div
                    className={`item_two p-5 w-full sm:w-1/2 hidden sm:flex sm:flex-col justify-center bg-orange-500 bg-cover bg-center bg-[url(/images/bg.png)]`}
                >
                    <div className="blob">
                        <PromotionBlob
                            heading="Sell to the highest biddar"
                            subHeading="Create a free account and get full access to all features"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage
