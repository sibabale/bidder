import * as React from 'react'

const CertificateIcon = ({ fill = '#A39D9D' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="none"
        viewBox="0 0 30 30"
    >
        <mask
            id="mask0_156_1338"
            width="30"
            height="30"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
        >
            <path fill={fill} d="M0 0h30v30H0z"></path>
        </mask>
        <g mask="url(#mask0_156_1338)">
            <path
                fill={fill}
                d="M11.279 26.538 9.192 23.02l-3.97-.856.389-4.096L2.933 15l2.678-3.067-.39-4.097 3.971-.856 2.087-3.519 3.72 1.573 3.722-1.573 2.087 3.52 3.97.855-.389 4.097L27.067 15l-2.678 3.067.39 4.096-3.971.856-2.087 3.52L15 24.965zm.533-1.6L15 23.61l3.202 1.327 1.798-3 3.437-.764-.312-3.548L25.437 15l-2.312-2.64.312-3.548L20 8.062l-1.813-3L15 6.39l-3.202-1.327-1.798 3-3.438.75.313 3.549L4.562 15l2.313 2.625-.313 3.562 3.438.75zm1.875-6.366 6.198-6.197-.885-.9-5.313 5.313L11 14.115l-.885.885z"
            ></path>
        </g>
    </svg>
)

export default CertificateIcon
