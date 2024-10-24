'use client'
import * as Yup from 'yup'
import moment from 'moment-timezone'
import { TimeInput } from '@nextui-org/date-input'
import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../../components/ui/popover'
import Alert from '../../../components/atoms/alert'
import TextInput from '../../../components/atoms/text-input'
import { format } from 'date-fns'
import { app } from '../../../config/index'
import { Button } from '../../../components/ui/button'
import { Calendar } from '../../../components/ui/calendar'
import CalenderIcon from '../../../components/atoms/icons/calender'
import { loggedInUser } from '../../../lib/store/selectors/user'

const CreateAuctionPage = () => {
    const user = useSelector(loggedInUser)
    const [error, setError] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
            .test(
                'max-words',
                'You must have a maximum of 3 words',
                (value) => value && value.trim().split(/\s+/).length <= 3
            ),
        image: Yup.mixed().required('Image is required'),
        description: Yup.string().required('Description is required'),
        startingPrice: Yup.number()
            .transform((value, originalValue) => {
                if (originalValue) {
                    const numericValue = originalValue.replace(/[^0-9.-]+/g, '')
                    return Number(numericValue)
                }
                return 0
            })
            .required('Starting price is required')
            .min(10, 'Starting price must be at least R10'),
        subTitle: Yup.string()
            .required('Sub Title is required')
            .test(
                'max-words',
                'You must have a maximum of 3 words',
                (value) => value && value.trim().split(/\s+/).length <= 3
            ),
        startDate: Yup.date()
            .required('Start date is required')
            .min(
                new Date(new Date().setHours(0, 0, 0, 0)),
                'Start date must be today or in the future'
            ),
        endDate: Yup.date()
            .required('End date is required')
            .min(
                Yup.ref('startDate'),
                'End date must be after or equal to the start date'
            ),

        startTime: Yup.string()
            .required('Start time is required')
            .test(
                'is-future-time',
                'Start time must be in the future relative to the selected date',
                function (value) {
                    const { startDate } = this.parent

                    if (!value || !startDate) return false
                    const date = moment(startDate)
                        .tz('Africa/Johannesburg')
                        .format('YYYY-MM-DD')

                    const selectedDateTime = moment(
                        `${date}T${value}`,
                        'YYYY-MM-DDTHH:mm:ss'
                    )

                    console.log(selectedDateTime.format())
                    const now = moment.tz('Africa/Johannesburg')

                    return selectedDateTime.isAfter(now.format())
                }
            ),

        endTime: Yup.string()
            .required('End time is required')
            .test(
                'is-valid-end-time',
                'End time must be after start time, considering the date difference',
                function (value) {
                    const { startDate, endDate, startTime } = this.parent

                    if (!value || !startTime || !startDate || !endDate)
                        return true

                    // Set the time zone to South Africa (UTC+2)
                    const formattedStartDate = moment(startDate)
                        .tz('Africa/Johannesburg')
                        .format('YYYY-MM-DD')
                    const formattedEndDate = moment(endDate)
                        .tz('Africa/Johannesburg')
                        .format('YYYY-MM-DD')

                    const startDateTime = moment.tz(
                        `${formattedStartDate} ${startTime}`,
                        'Africa/Johannesburg'
                    )
                    const endDateTime = moment.tz(
                        `${formattedEndDate} ${value}`,
                        'Africa/Johannesburg'
                    )

                    return endDateTime.isAfter(startDateTime)
                }
            ),
    })

    const initialValues = {
        title: '',
        image: null,
        endDate: '',
        endTime: '',
        subTitle: '',
        startTime: '',
        startDate: '',
        description: '',
        startingPrice: 0,
    }

    const handleUploadImage = async (file) => {
        const storage = getStorage(app)
        const storageRef = ref(storage, `images/${file.name}`)
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        return downloadURL
    }

    const handleSubmit = async (values) => {
        setIsLoading(true)
        setError(null)

        try {
            if (!values.image) {
                throw new Error('Image is required')
            }
            const token = process.env.NEXT_PUBLIC_BEARER_API_TOKEN
            const baseURL = process.env.NEXT_PUBLIC_BEARER_API_URL

            const imageUrl = await handleUploadImage(values.image)

            await fetch(`${baseURL}/api/products`, {
                method: 'POST',
                body: JSON.stringify({
                    title: values.title,
                    image: imageUrl,
                    // userId: user.userId,
                    userId: 'Bv2HMmL2NANdxUaLHzLbnl6lYOy1',
                    endTime: values.endTime,
                    endDate: endDate.toISOString(),
                    subTitle: values.subTitle,
                    startTime: values.startTime,
                    startDate: startDate.toISOString(),
                    startPrice: values.startingPrice,
                    description: values.description,
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-3 flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/4">
                <h1 className="mt-5 text-xl font-bold underline">
                    Create Auction Item
                </h1>
                <Alert message={error || ''} isVisible={!!error} />{' '}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className="my-2">
                                <Field
                                    name="title"
                                    type="text"
                                    as={TextInput}
                                    label="Title"
                                    required={true}
                                    disabled={isLoading || isSubmitting}
                                />
                                <ErrorMessage
                                    name="title"
                                    component="small"
                                    className="text-red-400"
                                />
                            </div>

                            <div className="my-2">
                                <Field
                                    name="subTitle"
                                    type="text"
                                    as={TextInput}
                                    label="Sub Title"
                                    required={true}
                                    disabled={isLoading || isSubmitting}
                                />
                                <ErrorMessage
                                    name="subTitle"
                                    component="small"
                                    className="text-red-400"
                                />
                            </div>

                            <div className="my-2">
                                <Field
                                    name="description"
                                    type="text"
                                    as={TextInput}
                                    label="Description"
                                    required={true}
                                    disabled={isLoading || isSubmitting}
                                />
                                <ErrorMessage
                                    name="description"
                                    component="small"
                                    className="text-red-400"
                                />
                            </div>

                            <div className="my-2 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div className="w-full sm:w-1/2 pr-0 sm:pr-2 mb-2 sm:mb-0">
                                    <Popover>
                                        <p>Start Date *</p>
                                        <PopoverTrigger
                                            asChild
                                            className="border-secondary-primary hover:bg-bg-bidder-primary/40"
                                        >
                                            <Button
                                                variant={'outline'}
                                                className="w-full text-left flex justify-between shadow-none"
                                            >
                                                {startDate ? (
                                                    format(startDate, 'PPP')
                                                ) : (
                                                    <span className="text-gray-500">
                                                        MM/DD/YYY
                                                    </span>
                                                )}
                                                <CalenderIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) => {
                                                    setStartDate(date)
                                                    setFieldValue(
                                                        'startDate',
                                                        date
                                                    )
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <ErrorMessage
                                        name="startDate"
                                        component="small"
                                        className="text-red-400"
                                    />
                                </div>

                                <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
                                    Start Time *
                                    <Field name="startTime">
                                        {({
                                            field,
                                            form: { setFieldValue },
                                        }) => (
                                            <TimeInput
                                                aria-label="Start Time"
                                                isRequired
                                                {...field}
                                                classNames={{
                                                    base: 'h-[36px] border border-secondary-primary rounded-none',
                                                    input: 'pb-2 rounded-none focus:outline-none focus:ring-2 focus:ring-bidder-primary',
                                                    inputWrapper:
                                                        'bg-transparent shadow-none hover:bg-transparent focus:bg-transparent  focus-within:hover:bg-transparent',
                                                }}
                                                onChange={(time) =>
                                                    setFieldValue(
                                                        'startTime',
                                                        time
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="startTime"
                                        component="small"
                                        className="text-red-400"
                                    />
                                </div>
                            </div>

                            <div className="my-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div className="w-full sm:w-1/2 pr-0 sm:pr-2 mb-2 sm:mb-0">
                                    <Popover>
                                        <p>End Date *</p>
                                        <PopoverTrigger
                                            asChild
                                            className="border-secondary-primary hover:bg-bg-bidder-primary/40"
                                        >
                                            <Button
                                                variant={'outline'}
                                                className="w-full text-left flex justify-between shadow-none"
                                            >
                                                {endDate ? (
                                                    format(endDate, 'PPP')
                                                ) : (
                                                    <span className="text-gray-500">
                                                        MM/DD/YYY
                                                    </span>
                                                )}
                                                <CalenderIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={(date) => {
                                                    setEndDate(date)
                                                    setFieldValue(
                                                        'endDate',
                                                        date
                                                    )
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <ErrorMessage
                                        name="endDate"
                                        component="small"
                                        className="text-red-400"
                                    />
                                </div>

                                <div className="w-full sm:w-1/2 pl-0 sm:pl-2">
                                    End Time *
                                    <Field name="endTime">
                                        {({ field }) => (
                                            <TimeInput
                                                aria-label="End Time"
                                                {...field}
                                                isRequired
                                                classNames={{
                                                    base: 'h-[36px] border border-secondary-primary rounded-none',
                                                    input: 'pb-2 rounded-none focus:outline-none focus:ring-2 focus:ring-bidder-primary',
                                                    inputWrapper:
                                                        'bg-transparent shadow-none hover:bg-transparent focus:bg-transparent  focus-within:hover:bg-transparent',
                                                }}
                                                onChange={(time) => {
                                                    setFieldValue(
                                                        'endTime',
                                                        time
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="endTime"
                                        component="small"
                                        className="text-red-400"
                                    />
                                </div>
                            </div>

                            <div className="my-2">
                                <Field name="startingPrice">
                                    {({ field, form }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="Enter price"
                                            value={`R${field.value ? Number(field.value).toLocaleString('en-ZA') : ''}`} // Format value with thousands separator
                                            onChange={(e) => {
                                                const rawValue =
                                                    e.target.value.replace(
                                                        /[^0-9.]/g,
                                                        ''
                                                    )
                                                form.setFieldValue(
                                                    'startingPrice',
                                                    rawValue
                                                )
                                            }}
                                            className="w-full px-2 h-[36px] border border-secondary-primary rounded-none focus:outline-none focus:ring-2 focus:ring-bidder-primary"
                                        />
                                    )}
                                </Field>

                                <ErrorMessage
                                    name="startingPrice"
                                    component="small"
                                    className="text-red-400"
                                />
                            </div>

                            <div className="my-2">
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        setFieldValue(
                                            'image',
                                            event.currentTarget.files[0]
                                        )
                                    }}
                                    required
                                />
                                <ErrorMessage
                                    name="image"
                                    component="small"
                                    className="text-red-400"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-bidder-primary"
                                disabled={isLoading || isSubmitting}
                            >
                                {isLoading || isSubmitting
                                    ? 'Creating...'
                                    : 'Create Auction'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default CreateAuctionPage
