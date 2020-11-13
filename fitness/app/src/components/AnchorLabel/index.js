import React from "react";
import { withTranslation } from "react-i18next";

const AnchorText = ({ t }) => {
  return (
    <span>
      <span>{t("scroll-top")}</span>
    </span>
  );
};

export default withTranslation()(AnchorText);
