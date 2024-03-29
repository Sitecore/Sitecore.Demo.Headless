import React from "react";
import { RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import { withTranslation } from "react-i18next";
import EventDetail from "../EventDetail";
import EventFavoriteButton from "../EventFavoriteButton";
import {
  getGuestRef,
  getRegisteredEventsResponse,
  isAnonymousGuestInGuestResponse,
  isRegisteredToEventInGuestResponse,
  isEventFavorited,
  trackRegistration,
  isBoxeverConfigured
} from "../../services/BoxeverService";
import { register } from "../../services/EventService";
import RegistrationPrompt from "../RegistrationPrompt";
import Loading from "../Loading";

class EventDetailAnonymous extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.state = {
      shouldDisplayLoading: isBoxeverConfigured(),
      isAnonymousGuest: true,
      isRegistered: false,
      isFavorited: false,
    }
  }

  toggle() {
    this.setState({
      promptOpen: !this.state.promptOpen
    });
  }

  onRegister() {
    if (!isBoxeverConfigured()) {
      this.setState({
        promptOpen: !this.state.promptOpen,
        isRegistered: true,
      });
      return;
    }

    const eventId = this.props.routeData.itemId;
    const eventName = this.props.routeData.name;
    const eventDate = this.props.routeData.fields.date.value;
    const sportType = this.props.routeData.fields.sportType.value;
    const imageUrl = this.props.routeData.fields.image.value.src;
    const eventUrlPath = window.location.pathname;

    register(eventId, eventName, eventDate, sportType)
    .then(() => trackRegistration(eventId, eventName, eventDate, eventUrlPath, sportType, imageUrl))
    .then(() => {
      this.setState({
        promptOpen: !this.state.promptOpen,
        isRegistered: true,
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    if (!isBoxeverConfigured()) {
      return;
    }

    var guestRef;

    getGuestRef()
    .then(response => {
      guestRef = response.guestRef;

      return getRegisteredEventsResponse(guestRef);
    })
    .then(guestResponse => {
      const isAnonymousGuest = isAnonymousGuestInGuestResponse(guestResponse);
      const isRegistered = isRegisteredToEventInGuestResponse(this.props.routeData.itemId, guestResponse);

      this.setState({
        isAnonymousGuest,
        isRegistered
      });

      return isEventFavorited(this.props.routeData.itemId, guestRef);
    })
    .then(isFavorited => {
      this.setState({
        isFavorited,
        shouldDisplayLoading: false
      });
    })
    .catch(e => {
      console.log(e);
    });
  }

  render() {
    // Don't render anything if the Boxever state is not received yet.
    if (this.state.shouldDisplayLoading) {
      return <Loading />;
    }

    const { fields, routeData, t } = this.props;
    const routeFields = routeData.fields;

    var date;
    if (!this.state.isRegistered) {
      date = (
        <DateField
          field={routeFields.date}
          tag="p"
          className="eventDetail-date"
          render={date => dayjs(date).format("MMM D YYYY")}
        />
      );
    } else {
      const eventDate = dayjs(routeFields.date.value);
      const days = eventDate.diff(dayjs(Date()), "days");
      const hours = eventDate.diff(dayjs(Date()), "hours") - days * 24;

      const dayLabel = days > 1 ? t("days") : t("day");
      const hourLabel = hours > 1 ? t("hours") : t("hour");
      const countdown = `${days} ${dayLabel} ${hours} ${hourLabel}`;

      date = (
        <>
          {t("countdown")}
          <h3>{countdown}</h3>
        </>
      );
    }

    var cta;
    if (this.state.isAnonymousGuest) {
        cta = (
        <NavLink to={fields.ctaLink.value.href} className="btn btn-primary">
          {t("register-to-signup")}
        </NavLink>
      );
    } else if (!this.state.isRegistered) {
      cta = (
        <button
          onClick={() => this.setState({ promptOpen: true })}
          className="btn btn-primary"
        >
          {t("register")}
        </button>
      );
    } else {
      const lat = parseFloat(routeFields.latitude.value);
      const lng = parseFloat(routeFields.longitude.value);
      const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      cta = (
        <a
          href={directionsLink}
          target="_new"
          className="btn btn-primary"
          style={{ marginTop: 0 }}
        >
          {t("directions")}
        </a>
      );
    }

    var icon= (
      <EventFavoriteButton {...this.props} isFavorited={this.state.isFavorited} />
    );
    // TODO: Bring back the EventSubscribeButton button when the user is already registered

    return (
      <>
        <EventDetail
          {...this.props}
          date={date}
          description={<RichText field={routeFields.description} tag="p" />}
          cta={cta}
          icon={icon}
        />
        <RegistrationPrompt
          open={this.state.promptOpen}
          toggle={this.toggle}
          onRegister={this.onRegister}
        />
      </>
    );
  }
}

export default withTranslation()(EventDetailAnonymous);
