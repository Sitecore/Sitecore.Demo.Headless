import React from "react";

const Loading = ({ size, path }) => {
  return (
    <svg
      style={{
        position: "absolute",
        margin: "auto",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 200,
        height: 200,
        background: "none"
      }}
      width="200px"
      height="200px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        ng-attr-r="{{config.radius}}"
        fill="#f7c51e"
        stroke="#201f21"
        strokeWidth="2"
        r="40"
      />
      <path d="M50 10L50 90" stroke="#201f21" strokeWidth="2" />
      <path
        fill="none"
        d="M21.715728752538098 21.7157287525381 A40 40 0 0 1 21.715728752538098 78.2842712474619"
        stroke="#201f21"
        strokeWidth="2"
      />
      <path
        fill="none"
        d="M78.2842712474619 21.7157287525381 A40 40 0 0 0 78.2842712474619 78.2842712474619"
        stroke="#201f21"
        strokeWidth="2"
      />
      <g transform="translate(0 50)">
        <g>
          <path
            fill="none"
            d="M 10 0 A 40 35.6272 0 0 1 90 0"
            stroke="#201f21"
            strokeWidth="2"
          >
            <animate
              attributeName="d"
              calcMode="spline"
              values="M10 0A40 40 0 0 1 90 0;M10 0A40 0 0 0 1 90 0;M10 0A40 0 0 0 0 90 0;M10 0A40 40 0 0 0 90 0"
              keyTimes="0;0.499999;0.5;1"
              dur="1"
              keySplines="0.1 0 1 0.9;0.5 0.5 0.5 0.5;0 0.1 0.9 1"
              begin="0s"
              repeatCount="indefinite"
            />
          </path>
          <path
            fill="none"
            d="M 10 0 A 40 8.79325 0 0 0 90 0"
            stroke="#201f21"
            strokeWidth="2"
          >
            <animate
              attributeName="d"
              calcMode="spline"
              values="M10 0A40 40 0 0 1 90 0;M10 0A40 0 0 0 1 90 0;M10 0A40 0 0 0 0 90 0;M10 0A40 40 0 0 0 90 0"
              keyTimes="0;0.499999;0.5;1"
              dur="1"
              keySplines="0.1 0 1 0.9;0.5 0.5 0.5 0.5;0 0.1 0.9 1"
              begin="-0.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
};

export default Loading;
