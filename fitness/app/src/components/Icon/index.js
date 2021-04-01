import React from "react";
import { v1 as uuidv1 } from "uuid";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import PropTypes from "prop-types";

const Icon = ({ size, path }) => {
  const id = uuidv1();
  const maskId = `mask-${id}`;
  return (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" className="icon-svg">
      <defs>
        <path d={path} id={id} />
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <mask id={maskId} fill="white">
          <use xlinkHref={`#${id}`} />
        </mask>
        <g id="Combined-Shape" fillRule="nonzero" />
        <g mask={`url(#${maskId})`} className="icon-mask">
          <rect id="Color" x="0" y="0" width="24" height="24" />
        </g>
      </g>
    </svg>
  );
};

Icon.defaultProps = {
  size: 48
};

Icon.propTypes = {
  size: PropTypes.number
};

export default Icon;
