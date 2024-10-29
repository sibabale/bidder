// import './index.scss'
import React from 'react'
import Avatar from '../../../assests/images/avatar-1.jpg'

const PromotionBlob = ({ blurry, heading, subHeading }) => {
    return (
        <div className={`${blurry ? 'blurry-bg' : ''} promo-blob`}>
            <div>
                <h1 className="promo-header mb-10 text-2xl text-white font-bold">
                    {heading}
                </h1>
                <p className="promo-subheader text-gray-200 mb-10">
                    {subHeading}
                </p>
            </div>
        </div>
    )
}

export default React.memo(PromotionBlob)
