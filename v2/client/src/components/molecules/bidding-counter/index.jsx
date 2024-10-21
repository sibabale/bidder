'use client'

import { useState, useEffect } from 'react'

import TimerIcon from '../../atoms/icons/timer'

const calculateRemainingTime = (endTime) => {
    const now = new Date()
    const end = new Date(endTime)
    const remaining = end - now

    if (remaining < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const seconds = Math.floor((remaining / 1000) % 60)
    const minutes = Math.floor((remaining / 1000 / 60) % 60)
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))

    return { days, hours, minutes, seconds }
}

const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime(endTime))

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft(calculateRemainingTime(endTime))
        }, 1000)

        return () => clearInterval(timerId)
    }, [endTime])

    if (
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
    ) {
        return <p className="text-red-600">Time is up!</p>
    }

    return (
        <div className="mt-5">
            <div className="flex items-center">
                <TimerIcon />
                <span className="ml-2 text-red-600">Time remaining:</span>
            </div>
            <div className="flex space-x-4 mt-2">
                {timeLeft.days > 0 && (
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                            {timeLeft.days}
                        </span>
                        <span className="text-sm text-gray-500">Days</span>
                    </div>
                )}
                {timeLeft.hours > 0 && (
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                            {timeLeft.hours}
                        </span>
                        <span className="text-sm text-gray-500">Hours</span>
                    </div>
                )}
                {timeLeft.minutes > 0 && (
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                            {timeLeft.minutes}
                        </span>
                        <span className="text-sm text-gray-500">Minutes</span>
                    </div>
                )}
                <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">
                        {timeLeft.seconds}
                    </span>
                    <span className="text-sm text-gray-500">Seconds</span>
                </div>
            </div>
        </div>
    )
}

export default CountdownTimer
