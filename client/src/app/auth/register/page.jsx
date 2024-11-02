'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Alert from '../../../components/molecules/alert'
import Button from '../../../components/atoms/button/button'
import TextInput from '../../../components/atoms/text-input'
import PromotionBlob from '../../../components/molecules/promotion-blob'

const SignUpPage = () => {
    const router = useRouter()
    const [authError, setAuthError] = useState()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        lastName: Yup.string().required('Last name is required'),
        firstName: Yup.string().required('First name is required'),
    })

    const initialValues = {
        email: '',
        password: '',
        lastName: '',
        firstName: '',
    }

    const { mutate, isPending, error } = useMutation({
        mutationFn: (values) => {
            const BASE_URL = process.env.NEXT_PUBLIC_BEARER_API_URL

            return axios.post(`${BASE_URL}/register`, values)
        },
        onSuccess: (user) => {
            localStorage.setItem('biddar', user.data.firebaseToken)
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
                        <Alert message={authError} isVisible={!!error} />
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
                                        disabled={isPending || isSubmitting}
                                        isLoading={isPending}
                                        variant="secondary"
                                        className={`p-5 w-full my-10 text-white bg-bidder-primary ${isPending || isSubmitting ? 'cursor-not-allowed bg-bidder-primary/40' : ''}`}
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
