import * as React from 'react'

const FrameIcon = ({ fill = '#A39D9D' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="none"
        viewBox="0 0 30 30"
    >
        <mask
            id="mask0_156_1324"
            width="30"
            height="30"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
        >
            <path fill={fill} d="M0 0h30v30H0z"></path>
        </mask>
        <g mask="url(#mask0_156_1324)">
            <path
                fill={fill}
                d="M5 26.25v-20h6.106L15 2.356l3.894 3.894H25v20zM6.25 25h17.5V7.5H6.25zm3.125-3.125h11.442l-3.533-4.712-3.27 4.135-2.187-2.644zM12.673 6.25h4.654L15 3.923z"
            ></path>
        </g>
    </svg>
)

export default FrameIcon
