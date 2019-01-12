import React from "react";
import { translate } from "react-i18next";

const AnchorText = ({ t }) => {
  return (
    <span>
      <span>{t("scroll-top")}</span>
    </span>
  );
};

export default translate()(AnchorText);
