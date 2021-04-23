import React, { Fragment } from "react";
import { RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import dayjs from "dayjs";
import { withTranslation } from "react-i18next";
import EventDetail from "../EventDetail";
import RegistrationPrompt from "../RegistrationPrompt";
import { register } from "../../services/EventService";
import EventFavoriteButton from "../EventFavoriteButton";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { withRouter } from "react-router";

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
    const eventId = this.props.routeData.itemId;
    const eventName = this.props.routeData.name;

    register(eventId, eventName)
      .then(response => {
        this.toggle();
        // refreshing the current route
        // workaround for https://github.com/ReactTraining/react-router/issues/1982#issuecomment-172040295
        const currentLocation = this.props.history.location.pathname;
        this.props.history.push("/null");
        setTimeout(() => {
          this.props.history.push(currentLocation);
        });
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
          icon={<EventFavoriteButton {...this.props} />}
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

export default withTranslation()(withRouter(EventDetailLoggedIn));
