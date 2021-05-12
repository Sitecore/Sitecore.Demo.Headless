import React from "react";
import { withTranslation } from 'react-i18next';
import { getGuestFullName } from "../../services/BoxeverService";

class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: ""
    }
  }

  componentDidMount() {
    getGuestFullName()
    .then(fullName => {
      this.setState({
        fullName
      });
    });
  }

  render() {
  const { t } = this.props;
    const fullName = this.state.fullName;

    if (!fullName) {
      return (
        <div className="greeting">&nbsp;</div>
      );
    }

    return (
      <div className="greeting">
        {t("hello")} {fullName}!
      </div>
    );
  }
}

export default withTranslation()(Greeting);
