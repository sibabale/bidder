'use client'

import Link from 'next/link'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Alert from '../../../components/molecules/alert'
import Button from '../../../components/atoms/button/button'
import TextInput from '../../../components/atoms/text-input'
import { login } from '../../../lib/store/slices/user/index'
import PromotionBlob from '../../../components/molecules/promotion-blob'

const SignInPage = () => {
    const dispatch = useDispatch()
    const router = useRouter() // Using Next.js router for navigation

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

    const loginMutation = useMutation({
        mutationFn: async (values) => {
            const BASE_URL = process.env.NEXT_PUBLIC_BEARER_API_URL
            const response = await axios.post(`${BASE_URL}/api/login`, values)
            console.log(response)

            localStorage.setItem('bidder', response.data.firebaseToken)
            return response.data.user
        },
        onSuccess: (user) => {
            console.log(user)

            dispatch(
                login({
                    email: user.email,
                    userId: user.uid,
                    lastName: user.lastName,
                    firstName: user.firstName,
                })
            )
            router.replace('/auctions')
        },
        onError: (error) => {
            console.error(error)
            setError('Failed to log in. Please try again.')
        },
    })

    return (
        <div className="h-screen">
            <div className="p-5 absolute">
                <Link href="/" className="flex items-center outline-none">
                    <div className="h-10 w-10 bg-bidder-primary rounded-full"></div>
                    <h1 className="ml-3 text-black text-2xl font-bold">
                        Bidder
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
                            message={loginMutation.error?.message || ''}
                            isVisible={!!loginMutation.error}
                        />

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                loginMutation.mutate(values, {
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
                                            disabled={
                                                loginMutation.isLoading ||
                                                isSubmitting
                                            }
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
                                            required
                                            disabled={
                                                loginMutation.isLoading ||
                                                isSubmitting
                                            }
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
                                        disabled={
                                            loginMutation.isLoading ||
                                            isSubmitting
                                        }
                                        className="main_button p-5 w-full my-10 text-white bg-bidder-primary"
                                    />
                                </Form>
                            )}
                        </Formik>

                        <p className="mb-5">
                            Forgot password?
                            <Link
                                href="/reset-password"
                                className="ml-2 text-bidder-primary"
                            >
                                Reset
                            </Link>
                        </p>
                        <p>
                            Don’t have an account?
                            <Link
                                href="/signup"
                                className="ml-2 text-bidder-primary"
                            >
                                Signup
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="p-5 w-full sm:w-1/2 hidden sm:flex sm:flex-col justify-center bg-orange-500">
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
