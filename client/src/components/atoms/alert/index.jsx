import React from 'react'
import { motion } from 'framer-motion'

const Alert = ({ message, isVisible }) => {
    // Define animation variants
    const variants = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    }

    return (
        <motion.div
            className="error_message"
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {message}
        </motion.div>
    )
}

export default Alert
