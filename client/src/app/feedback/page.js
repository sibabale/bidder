'use client'
import React from 'react'
import Link from 'next/link'
import { useForm, ValidationError } from '@formspree/react'

import Button from '@/components/atoms/button/button'
import Header from '@/components/molecules/header/header'
import TextArea from '@/components/atoms/text-area/text-area'
import TextInput from '../../components/atoms/text-input'

const ContactForm = () => {
    const [state, handleSubmit] = useForm('mldejpwd')
    if (state.succeeded) {
        return (
            <>
                <Header />
                <div className="h-screen w-screen flex flex-col items-center justify-center">
                    <p>Thanks we value you feedback!</p>
                    <Link
                        href="/auctions"
                        className="p-3 mt-5 bg-bidder-primary text-white"
                    >
                        View auctions
                    </Link>
                </div>
            </>
        )
    }
    return (
        <>
            <Header />
            <div className="h-screen w-screen flex flex-col items-center justify-center">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl mb-5 underline">Feedback</h1>
                    <label htmlFor="email">Email Address</label>
                    <TextInput id="email" type="email" name="email" />
                    <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                    />
                    <label htmlFor="email" className="mt-50">
                        Feedback
                    </label>
                    <TextArea id="message" name="message" />
                    <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                    />
                    <Button
                        text="Submit"
                        type="submit"
                        disabled={state.submitting}
                        isLoading={state.submitting}
                        className={`bg-bidder-primary ${state.submitting ? 'bg-bidder-primary/40 cursor-not-allowed' : ''} p-5 w-full text-white mt-5`}
                    ></Button>
                </form>
            </div>
        </>
    )
}

export default ContactForm
