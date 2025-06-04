import React, {Fragment, memo} from 'react'

export const Toggle = memo(function Toggle(props: {
  className?: string
  isChecked: boolean
  toggle: () => void
}) {
  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      role="button"
      onClick={props.toggle}
    >
      <rect width="40" height="24" rx="12" fill={props.isChecked ? '#191C20' : '#D6D9DD'} />

      {props.isChecked ? (
        <Fragment>
          <rect width="40" height="24" rx="12" fill="url(#paint0_linear_208_31519)" fillOpacity="0.12" />
          <rect
            x="1"
            y="1"
            width="38"
            height="22"
            rx="11"
            stroke="url(#paint1_linear_208_31519)"
            strokeOpacity="0.12"
            strokeWidth="2"
          />
          <rect x="18.75" y="2.75" width="18.5" height="18.5" rx="9.25" fill="white" />
          <rect
            x="18.75"
            y="2.75"
            width="18.5"
            height="18.5"
            rx="9.25"
            fill="url(#paint2_linear_208_31519)"
            fillOpacity="0.45"
          />
          <rect x="18.75" y="2.75" width="18.5" height="18.5" rx="9.25" stroke="white" strokeWidth="1.5" />
        </Fragment>
      ) : (
        <Fragment>
          <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="9.25" fill="white" />
          <rect
            x="2.75"
            y="2.75"
            width="18.5"
            height="18.5"
            rx="9.25"
            fill="url(#paint0_linear_13_30)"
            fillOpacity="0.45"
          />
          <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="9.25" stroke="white" strokeWidth="1.5" />
        </Fragment>
      )}

      <defs>
        <linearGradient id="paint0_linear_208_31519" x1="20" y1="0" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear_208_31519" x1="20" y1="0" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint2_linear_208_31519" x1="28" y1="2" x2="28" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D3D4D6" />
          <stop offset="1" stopColor="#D2D3D6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint0_linear_13_30" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D3D4D6" />
          <stop offset="1" stopColor="#D2D3D6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
})
