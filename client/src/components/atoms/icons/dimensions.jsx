import * as React from 'react'

const DimensionIcon = ({ fill = '#A39D9D' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="30"
        fill="none"
        viewBox="0 0 31 30"
    >
        <mask
            id="mask0_156_1331"
            width="31"
            height="30"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
        >
            <path fill={fill} d="M.5 0h30v30H.5z"></path>
        </mask>
        <g mask="url(#mask0_156_1331)">
            <path
                fill={fill}
                d="M18.625 20.625h5v-5h-1.25v3.75h-3.75zm-11.25-6.25h1.25v-3.75h3.75v-1.25h-5zM4.25 23.75V6.25h22.5v17.5zM5.5 22.5h20v-15h-20z"
            ></path>
        </g>
    </svg>
)

export default DimensionIcon
