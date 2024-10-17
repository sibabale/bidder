import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

import './index.scss';
import Logo from '../logo';
import Button from '../../atoms/button/index';
import useLogout from '../../../hooks/useLogout';
import { isUserLoggedIn } from '../../../store/selectors/user';
import { useSelector } from 'react-redux';

interface HeaderProps {
    isLoggedIn: boolean;
}

function Header({ isLoggedIn = false }: HeaderProps) {
    const logout = useLogout();
    const isUserSignedIn = useSelector(isUserLoggedIn);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuAnimation = useSpring({
        config: { tension: 200, friction: 15 },
        opacity: menuOpen ? 1 : 0,
        transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
    });

    return (
        <header className="header">
            <Logo />
            <nav className="navigation_menu">
                <ul>
                    {isLoggedIn && (
                        <li>
                            <a href="/">Profile</a>
                        </li>
                    )}
                    <li>
                        <a href="/auctions">Auctions</a>
                    </li>
                    <li>
                        <a href="/">Insights</a>
                    </li>
                    <li>
                        <a href="/">About</a>
                    </li>
                    <li>
                        {!isUserSignedIn && (
                            <div>
                                <Button
                                    text="Sign In"
                                    isLink={true}
                                    linkRoute="/signin"
                                    className="mobile_button_link"
                                />
                                <Button
                                    text="Sign up"
                                    isLink={true}
                                    linkRoute="/signup"
                                    variant="secondary"
                                    className="sign_up_button mobile_button_link"
                                />
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
            {menuOpen && (
                <animated.nav style={menuAnimation} className="mobile_menu">
                    <ul>
                        {isLoggedIn && (
                            <li>
                                <a href="/" onClick={() => setMenuOpen(false)}>
                                    Profile
                                </a>
                            </li>
                        )}
                        <li>
                            <a href="/" onClick={() => setMenuOpen(false)}>
                                Products
                            </a>
                        </li>
                        <li>
                            <a href="/auctions" onClick={() => setMenuOpen(false)}>
                                Auctions
                            </a>
                        </li>
                        <li>
                            <a href="/" onClick={() => setMenuOpen(false)}>
                                Insights
                            </a>
                        </li>
                        <li>
                            <a href="/" onClick={() => setMenuOpen(false)}>
                                About
                            </a>
                        </li>
                        <li className="mobile_auth_buttons">
                            {isUserSignedIn ? (
                                <Button text="Logout" onClick={() => logout()} />
                            ) : (
                                <div>
                                    <Button text="Sign In" isLink={true} linkRoute="/signin" />
                                    <Button
                                        text="Sign up"
                                        isLink={true}
                                        linkRoute="/signup"
                                        variant="secondary"
                                        className="sign_up_button"
                                    />
                                </div>
                            )}
                        </li>
                    </ul>
                </animated.nav>
            )}
            <span
                className="material-symbols-sharp hamburger_menu"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                menu
            </span>
            <div className="auth_buttons">
                {isUserSignedIn ? (
                    <div className="flex items-center">
                        <div className="mr-5">
                            <Button
                                text="Sell"
                                isLink
                                variant="secondary"
                                linkRoute="/auctions/create"
                            />
                        </div>
                        <Button className="w-full" text="Logout" onClick={() => logout()} />
                    </div>
                ) : (
                    <div>
                        <Button text="Sign In" isLink={true} linkRoute="/signin" />
                        <Button
                            text="Sign up"
                            isLink={true}
                            variant="secondary"
                            linkRoute="/signup"
                            className="sign_up_button"
                        />
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
