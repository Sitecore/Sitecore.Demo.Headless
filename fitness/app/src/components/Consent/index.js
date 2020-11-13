import React from "react";
import { withTranslation } from "react-i18next";

const Consent = ({t}) => {
  return (
    <div className="consent">
      <p dangerouslySetInnerHTML={{__html: t('consent')}} />
    </div>
  );
};

export default withTranslation()(Consent);
