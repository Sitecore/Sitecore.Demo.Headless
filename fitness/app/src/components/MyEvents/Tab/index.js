import React from "react";
import { withTranslation } from "react-i18next";

const Tab = ({ active, index, name, t, onTabChange }) => {
  return (
    <li className="tabsNav-item">
      <a
        href="#"
        name={index}
        onClick={active ? null : onTabChange}
        className={`${active ? "active " : ""}tabsNav-item-link`}
      >
        {t(name)}
      </a>
    </li>
  );
};

export default withTranslation()(Tab);
