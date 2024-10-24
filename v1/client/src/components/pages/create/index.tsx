import axios from 'axios';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import Alert from '../../molecules/alert';
import Button from '../../atoms/button';
import { app } from '../../../config/index';
import useAxios from '../../../hooks/useAxios';
import TextInput from '../../atoms/text-input';
import { loggedInUser } from '../../../store/selectors/user';

interface ISignUpDetails {
    email: string;
    title: string;
    image: File | null;
    description: string;
    endDate: string;
    endTime: string;
    startDate: string;
    startTime: string;
    startingPrice: number;
    incrementPrice: number;
}

const CreateAuctionPage: React.FC = () => {
    const axiosInstance = useAxios();
    const user = useSelector(loggedInUser);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // const validationSchema = Yup.object().shape({
    //     title: Yup.string().required('Title name is required'),
    //     image: Yup.mixed().required('Image is required'),
    //     description: Yup.string().required('Description is required'),
    //     startingPrice: Yup.number().required('Starting price is required'),
    //     incrementPrice: Yup.number().required('Increment price is required'),
    // });

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        image: Yup.mixed().required('Image is required'),
        description: Yup.string().required('Description is required'),
        startingPrice: Yup.number().required('Starting price is required').min(0),
        incrementPrice: Yup.number().required('Increment price is required').min(1),

        startDate: Yup.date()
            .required('Start date is required')
            .nullable()
            .test('is-future', 'Start date cannot be in the past', (value) => {
                return value ? new Date(value) >= new Date() : true;
            }),

        endDate: Yup.date()
            .required('End date is required')
            .nullable()
            .min(Yup.ref('startDate'), 'End date must be after start date'),

        startTime: Yup.string()
            .required('Start time is required')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),

        endTime: Yup.string()
            .required('End time is required')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
            .test('is-after', 'End time must be after start time', function (value) {
                const { startDate, endDate, startTime } = this.parent;
                if (startDate && endDate && startDate.toISOString() === endDate.toISOString()) {
                    return value > startTime;
                }
                return true;
            }),
    });

    const initialValues: ISignUpDetails = {
        email: '',
        title: '',
        image: null,
        endTime: '',
        endDate: '',
        startTime: '',
        startDate: '',
        description: '',
        startingPrice: 0,
        incrementPrice: 0,
    };

    const handleUploadImage = async (file: File): Promise<string> => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${file.name}`);

        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleSubmit = async (values: ISignUpDetails) => {
        setIsLoading(true);
        setError(null);

        try {
            const imageUrl = await handleUploadImage(values.image!);

            await axiosInstance.post('auctions/create', {
                title: values.title,
                image: imageUrl,
                userId: user.userId,
                startPrice: values.startingPrice,
                description: values.description,
                endTime: values.endTime,
                startTime: values.startTime,
                endDate: `${values.endDate?.toString()} `,
                startDate: `${values.startDate?.toString()}`,
                incrementPrice: values.incrementPrice,
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMessage =
                    err.response?.data?.error ||
                    'An error occurred during creating an auction. Please try again.';
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
        <div className="p-3 flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/4">
                <h1 className="form_header">Create Auction Item</h1>
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
                                    className="validation_msg"
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
                                    className="validation_msg"
                                />
                            </div>

                            <div className="my-2 flex justify-between">
                                <div className="">
                                    <Field
                                        name="startDate"
                                        type="date"
                                        as={TextInput}
                                        label="Start Date"
                                        required
                                    />
                                    <ErrorMessage
                                        name="startDate"
                                        component="small"
                                        className="validation_msg"
                                    />
                                </div>
                                <div className="">
                                    <Field
                                        name="startTime"
                                        type="time"
                                        as={TextInput}
                                        label="Start Date"
                                        required
                                    />
                                    <ErrorMessage
                                        name="startTime"
                                        component="small"
                                        className="validation_msg"
                                    />
                                </div>
                            </div>

                            <div className="my-2 flex justify-between">
                                <div className="">
                                    <Field
                                        name="endDate"
                                        type="date"
                                        as={TextInput}
                                        label="End Date"
                                        required
                                    />
                                    <ErrorMessage
                                        name="endDate"
                                        component="small"
                                        className="validation_msg"
                                    />
                                </div>
                                <div className="">
                                    <Field
                                        name="endTime"
                                        type="time"
                                        as={TextInput}
                                        label="End Date"
                                        required
                                    />
                                    <ErrorMessage
                                        name="endTime"
                                        component="small"
                                        className="validation_msg"
                                    />
                                </div>
                            </div>

                            <div className="my-2">
                                <Field
                                    name="startingPrice"
                                    type="number"
                                    as={TextInput}
                                    label="Starting Price"
                                    required={true}
                                    disabled={isLoading || isSubmitting}
                                />
                                <ErrorMessage
                                    name="startingPrice"
                                    component="small"
                                    className="validation_msg"
                                />
                            </div>
                            <div className="my-2">
                                <Field
                                    name="incrementPrice"
                                    type="number"
                                    as={TextInput}
                                    label="Increment Price"
                                    required={true}
                                    disabled={isLoading || isSubmitting}
                                />
                                <ErrorMessage
                                    name="incrementPrice"
                                    component="small"
                                    className="validation_msg"
                                />
                            </div>
                            <div className="my-2">
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={(event) => {
                                        if (event.currentTarget.files) {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue('image', file);
                                        }
                                    }}
                                    required
                                    disabled={isLoading || isSubmitting}
                                />
                                <ErrorMessage
                                    name="image"
                                    component="small"
                                    className="validation_msg"
                                />
                            </div>

                            <div className="mt-3">
                                <Button
                                    type="submit"
                                    text="Sell"
                                    disabled={isLoading || isSubmitting}
                                    variant="secondary"
                                    className="main_button"
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateAuctionPage;
