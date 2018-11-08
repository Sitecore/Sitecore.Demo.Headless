import React, { Component } from "react";
import { RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import { translate } from "react-i18next";
import EventDetail from "../EventDetail";
import { addToFavorites } from "../../utils/XConnectProxy";

class EventDetailAnonymous extends Component {
  state = {
    favorited: false
  };

  constructor(props) {
    super(props);
    this.onFavoriteClick = this.onFavoriteClick.bind(this);
  }

  onFavoriteClick() {
    // optimistic UI update
    this.setState({ favorited: true });
    addToFavorites(this.props.routeData.itemId)
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        this.setState({ favorited: false });
        console.log(err);
      });
  }

  render() {
    const { fields, routeData } = this.props;
    const routeFields = routeData.fields;
    const description = <RichText field={routeFields.description} tag="p" />;
    const { favorited } = this.state;

    const date = (
      <DateField
        field={routeFields.date}
        tag="p"
        className="eventDetail-date"
        render={date => dayjs(date).format("MMM D YYYY")}
      />
    );

    const cta = (
      <NavLink to={fields.ctaLink.value.href} className="btn btn-primary">
        {fields.ctaText.value}
      </NavLink>
    );

    const icon = (
      <div
        className={`event-action ${
          favorited ? "event-action-favorite-active" : "event-action-favorite"
        }`}
        onClick={this.onFavoriteClick}
      />
    );

    return (
      <EventDetail
        {...this.props}
        date={date}
        description={description}
        cta={cta}
        icon={icon}
      />
    );
  }
}

export default translate()(EventDetailAnonymous);
