import React from "react";
import { translate } from "react-i18next";

const Consent = ({t}) => {
  return (
    <div className="consent">
      <p dangerouslySetInnerHTML={{__html: t('consent')}} />
    </div>
  );
};

export default translate()(Consent);
