import { motion } from 'framer-motion'
import React from 'react'

const Alert = ({ message, isVisible }) => {
    return (
        <motion.div
            className="bg-[#f8d7da] border border-red-500 p-2 mb-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ tension: 200, friction: 20 }}
        >
            {message}
        </motion.div>
    )
}

export default Alert
