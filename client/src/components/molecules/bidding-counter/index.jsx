'use client'

import { useState, useEffect } from 'react'
import TimerIcon from '../../atoms/icons/timer'

const calculateRemainingTime = (time) => {
    const now = new Date()
    const end = new Date(time)
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

const CountdownTimer = ({ status, startTime, endTime }) => {
    const [timeLeft, setTimeLeft] = useState(
        status === 'coming soon'
            ? calculateRemainingTime(
                  new Date(startTime).toLocaleString('en-ZA', {
                      timeZone: 'Africa/Johannesburg',
                  })
              )
            : calculateRemainingTime(
                  new Date(endTime).toLocaleString('en-ZA', {
                      timeZone: 'Africa/Johannesburg',
                  })
              )
    )

    useEffect(() => {
        const timerId = setInterval(() => {
            const timeToCount = status === 'coming soon' ? startTime : endTime
            setTimeLeft(
                calculateRemainingTime(
                    new Date(timeToCount).toLocaleString('en-ZA', {
                        timeZone: 'Africa/Johannesburg',
                    })
                )
            )
        }, 1000)

        return () => clearInterval(timerId)
    }, [status, startTime, endTime])

    const isAuctionFinished =
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0

    return (
        <div className="mt-5">
            {!isAuctionFinished && (
                <div className="flex items-center">
                    <TimerIcon />
                    <span className="ml-2 text-red-600">Time remaining:</span>
                </div>
            )}
            {!isAuctionFinished && (
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
                            <span className="text-sm text-gray-500">
                                Minutes
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-bold">
                            {timeLeft.seconds}
                        </span>
                        <span className="text-sm text-gray-500">Seconds</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CountdownTimer
