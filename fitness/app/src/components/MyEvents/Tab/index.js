import React from "react";
import { withTranslation } from "react-i18next";

const Tab = ({ active, index, name, t, onTabChange }) => {
  return (
    <li className="tabsNav-item">
      <button
        name={index}
        onClick={active ? null : onTabChange}
        className={`${active ? "active " : ""}tabsNav-item-link`}
        value={t(name)}
      >
      </button>
    </li>
  );
};

export default withTranslation()(Tab);
