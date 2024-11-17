import * as React from 'react'

const SignatureIcon = ({ fill = '#A39D9D' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="30"
        fill="none"
        viewBox="0 0 31 30"
    >
        <mask
            id="mask0_156_1345"
            width="31"
            height="30"
            x="0"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
        >
            <path fill={fill} d="M.5 0h30v30H.5z"></path>
        </mask>
        <g mask="url(#mask0_156_1345)">
            <path
                fill={fill}
                d="M16.82 16.315q2.738-1.832 4.332-4.052t1.593-4.388q0-1.312-.532-2.094-.532-.78-1.408-.781-1.83 0-3.05 2.508-1.221 2.51-1.221 6.21 0 .776.075 1.418.075.643.21 1.179M5.476 25v-1.827h1.827V25zm4.543 0v-1.827h1.827V25zm4.544 0v-1.827h1.826V25zm4.543 0v-1.827h1.827V25zm4.543 0v-1.827h1.827V25zM5.111 20.36l-.861-.86 2-2-2-2 .86-.86 2 2 2-2 .861.86-2 2 2 2-.86.86-2-2zM19.019 20q-.937 0-1.658-.443-.722-.444-1.188-1.329a16 16 0 0 1-1.537.806q-.804.367-1.655.711l-.443-1.166a29 29 0 0 0 1.624-.72 20 20 0 0 0 1.523-.813 9.3 9.3 0 0 1-.306-1.536 15 15 0 0 1-.102-1.834q0-4.38 1.552-7.153t3.976-2.773q1.434 0 2.308 1.13.875 1.133.875 3.024 0 2.567-1.811 5.108-1.812 2.541-4.915 4.539.315.602.765.905.451.3 1.014.301 1.005 0 2.13-.959 1.128-.959 2.026-2.575l1.08.51q-.171.988-.128 1.738t.416 1.289a6 6 0 0 0 .782-.472q.375-.267.908-.901l.983.786q-.812.885-1.502 1.356T24.428 20q-.56 0-.968-.63-.407-.632-.558-1.589a5.7 5.7 0 0 1-1.83 1.62q-1.074.6-2.053.599"
            ></path>
        </g>
    </svg>
)

export default SignatureIcon