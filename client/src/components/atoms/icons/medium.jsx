import * as React from 'react'

const MediumIcon = ({ fill = '#A39D9D' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="none"
        viewBox="0 0 30 30"
    >
        <mask
            id="mask0_156_1352"
            width="30"
            height="30"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
        >
            <path fill={fill} d="M0 0h30v30H0z"></path>
        </mask>
        <g mask="url(#mask0_156_1352)">
            <path
                fill={fill}
                d="M14.952 26.25q-2.298 0-4.339-.888A11.5 11.5 0 0 1 7.05 22.95a11.4 11.4 0 0 1-2.41-3.576A10.9 10.9 0 0 1 3.75 15q0-2.354.907-4.406a11.3 11.3 0 0 1 2.474-3.572 11.6 11.6 0 0 1 3.674-2.396 11.6 11.6 0 0 1 4.493-.876q2.187 0 4.166.74a11.2 11.2 0 0 1 3.482 2.05 10 10 0 0 1 2.404 3.125q.9 1.813.9 3.955 0 2.897-1.67 4.638T20 20h-2.216q-.786 0-1.316.54-.53.543-.53 1.306 0 .784.468 1.33.47.548.469 1.262 0 .913-.51 1.363-.512.45-1.413.449M8.125 15.625q.524 0 .887-.363t.363-.887-.363-.887a1.2 1.2 0 0 0-.887-.363q-.524 0-.887.363a1.2 1.2 0 0 0-.363.887q0 .524.363.887t.887.363m3.75-5q.524 0 .887-.363t.363-.887-.363-.887a1.2 1.2 0 0 0-.887-.363q-.524 0-.887.363a1.2 1.2 0 0 0-.363.887q0 .524.363.887t.887.363m6.25 0q.525 0 .887-.363.363-.363.363-.887t-.363-.887a1.2 1.2 0 0 0-.887-.363q-.525 0-.887.363a1.2 1.2 0 0 0-.363.887q0 .524.363.887t.887.363m3.75 5q.525 0 .887-.363.363-.363.363-.887t-.363-.887a1.2 1.2 0 0 0-.887-.363q-.525 0-.887.363a1.2 1.2 0 0 0-.363.887q0 .524.363.887t.887.363M14.952 25q.33 0 .501-.144.172-.144.172-.419 0-.437-.469-.934t-.469-1.638q0-1.36.907-2.237.906-.878 2.219-.878H20q2.351 0 3.676-1.383Q25 15.982 25 13.62q0-3.805-2.927-6.212Q19.147 5 15.298 5q-4.322 0-7.31 2.906T5 15q0 4.156 2.922 7.078T14.952 25"
            ></path>
        </g>
    </svg>
)

export default MediumIcon