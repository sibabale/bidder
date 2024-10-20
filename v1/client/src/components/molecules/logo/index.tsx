import { Link } from 'react-router-dom';
import './index.scss';
import { useSelector } from 'react-redux';
import { isUserLoggedIn } from '../../../store/selectors/user';

function Logo() {
    const isUserSignedIn = useSelector(isUserLoggedIn);
    return (
        <Link to={isUserSignedIn ? '/welcome' : '/'} className="logo_container">
            <div className="logo" />
            <div className="titles">
                <span className="app_title">Bidder</span>
            </div>
        </Link>
    );
}

export default Logo;
