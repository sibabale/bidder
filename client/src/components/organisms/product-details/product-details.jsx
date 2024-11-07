import React, { useState } from 'react'

import FrameIcon from '../../../components/atoms/icons/frame'
import MediumIcon from '../../../components/atoms/icons/medium'
import SignatureIcon from '../../../components/atoms/icons/signature'
import DimensionsIcon from '../../../components/atoms/icons/dimensions'
import CertificateIcon from '../../../components/atoms/icons/certificate'

const ProductDetails = ({
    frame = false,
    medium = '',
    signature = false,
    dimensions = '',
    certificate = false,
}) => {
    const [activeDetailsIcon, setActiveDetailsIcon] = useState('')

    const toggleIcon = (icon) => {
        setActiveDetailsIcon((prevIcon) => (prevIcon === icon ? '' : icon))
    }

    const renderDetails = () => {
        switch (activeDetailsIcon) {
            case 'frame':
                return 'Frame included'
            case 'medium':
                return medium
            case 'signature':
                return 'Signed by the artist'
            case 'dimensions':
                return dimensions
            case 'certificate':
                return 'Certificate of authenticity included'
            default:
                return null
        }
    }

    return (
        <div className="mt-6">
            <div className="flex">
                {frame && (
                    <button
                        className="mr-5"
                        onClick={() => toggleIcon('frame')}
                    >
                        <FrameIcon
                            fill={
                                activeDetailsIcon === 'frame'
                                    ? '#ef4444'
                                    : '#A39D9D'
                            }
                        />
                    </button>
                )}
                {medium && (
                    <button
                        className="mr-5"
                        onClick={() => toggleIcon('medium')}
                    >
                        <MediumIcon
                            fill={
                                activeDetailsIcon === 'medium'
                                    ? '#ef4444'
                                    : '#A39D9D'
                            }
                        />
                    </button>
                )}
                {signature && (
                    <button
                        className="mr-5"
                        onClick={() => toggleIcon('signature')}
                    >
                        <SignatureIcon
                            fill={
                                activeDetailsIcon === 'signature'
                                    ? '#ef4444'
                                    : '#A39D9D'
                            }
                        />
                    </button>
                )}
                {dimensions && (
                    <button
                        className="mr-5"
                        onClick={() => toggleIcon('dimensions')}
                    >
                        <DimensionsIcon
                            fill={
                                activeDetailsIcon === 'dimensions'
                                    ? '#ef4444'
                                    : '#A39D9D'
                            }
                        />
                    </button>
                )}
                {certificate && (
                    <button
                        className="mr-5"
                        onClick={() => toggleIcon('certificate')}
                    >
                        <CertificateIcon
                            fill={
                                activeDetailsIcon === 'certificate'
                                    ? '#ef4444'
                                    : '#A39D9D'
                            }
                        />
                    </button>
                )}
            </div>
            {renderDetails() && (
                <div className="mt-2 p-2 flex items-center bg-gray-200">
                    <span className="text-sm">{renderDetails()}</span>
                </div>
            )}
        </div>
    )
}

export default React.memo(ProductDetails)
