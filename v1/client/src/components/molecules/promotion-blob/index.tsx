import React from 'react';
import './index.scss';
import Avatar from '../../../assests/images/avatar-1.jpg';

interface PromotionBlobProps {
    blurry?: boolean;
    heading: string;
    subHeading: string;
}
const PromotionBlob: React.FC<PromotionBlobProps> = ({
    blurry,
    heading,
    subHeading,
}) => {
    return (
        <div className={`${blurry ? 'blurry-bg' : ''} promo-blob`}>
            <div>
                <h1 className="promo-header">{heading}</h1>
                <p className="promo-subheader">{subHeading}</p>
                <div className="promo-reviews">
                    <div className="avatars">
                        <img src={Avatar} alt="User 1" className="avatar" />
                        <img src={Avatar} alt="User 2" className="avatar" />
                        <img src={Avatar} alt="User 3" className="avatar" />
                        <img src={Avatar} alt="User 4" className="avatar" />
                    </div>
                    <div className="review-info">
                        <div className="rating">★★★★★</div>
                        <small className="review-count">
                            5.0 from 200+ reviews
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PromotionBlob);
