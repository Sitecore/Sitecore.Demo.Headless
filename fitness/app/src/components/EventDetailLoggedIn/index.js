import React, { Fragment } from "react";
import { RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import dayjs from "dayjs";
import { translate } from "react-i18next";
import EventDetail from "../EventDetail";
import RegistrationPrompt from "../RegistrationPrompt";
import { register } from "../../utils/XConnectProxy";

class EventDetailLoggedIn extends React.Component {
  state = {
    promptOpen: false
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onRegister = this.onRegister.bind(this);
  }

  toggle() {
    this.setState({
      promptOpen: !this.state.promptOpen
    });
  }

  onRegister() {
    register(this.props.routeData.itemId)
      .then(response => {
        this.toggle();
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { fields, routeData } = this.props;
    const routeFields = routeData.fields;
    const description = <RichText field={routeFields.description} tag="p" />;

    const date = (
      <DateField
        field={routeFields.date}
        tag="p"
        className="eventDetail-date"
        render={date => dayjs(date).format("MMM D YYYY")}
      />
    );

    const cta = (
      <button
        onClick={() => this.setState({ promptOpen: true })}
        className="btn btn-primary"
      >
        {fields.ctaText.value}
      </button>
    );

    return (
      <Fragment>
        <EventDetail
          {...this.props}
          date={date}
          description={description}
          cta={cta}
        />
        <RegistrationPrompt
          open={this.state.promptOpen}
          toggle={this.toggle}
          onRegister={this.onRegister}
        />
      </Fragment>
    );
  }
}

export default translate()(EventDetailLoggedIn);
