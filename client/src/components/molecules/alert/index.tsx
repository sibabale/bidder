import { useSpring, animated } from '@react-spring/web';
import React from 'react';
import './index.scss';

interface AlertProps {
    message: string;
    isVisible: boolean;
}

const Alert: React.FC<AlertProps> = ({ message, isVisible }) => {
    const animationProps = useSpring({
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        config: { tension: 200, friction: 20 },
    });

    return (
        <animated.div style={animationProps} className="error_message">
            {message}
        </animated.div>
    );
};

export default Alert;
