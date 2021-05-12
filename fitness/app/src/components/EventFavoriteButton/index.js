import React from "react";
import { withTranslation } from "react-i18next";
import {
  addToFavorites,
  removeFromFavorites
} from "../../services/EventService";
import {
  trackEventFavorite,
  trackEventUnfavorite
} from "../../services/BoxeverService";

class EventFavoriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.onFavoriteClick = this.onFavoriteClick.bind(this);
    this.state = {
      favorited: props.isFavorited
    };
  }

  onFavoriteClick() {
    // optimistic UI update
    this.setState({ favorited: !this.state.favorited });

    const eventId = this.props.routeData.itemId;
    const eventName = this.props.routeData.name;
    const eventDate = this.props.routeData.fields.date.value;
    const sportType = this.props.routeData.fields.sportType.value;

    const operation = this.state.favorited
    ? removeFromFavorites(eventId, eventName)
    : addToFavorites(eventId, eventName, eventDate, sportType);

    operation
      .catch(err => {
        this.setState({ favorited: false });
        console.log(err);
      });

    const trackingPromise = this.state.favorited
      ? trackEventUnfavorite(eventId, eventName, eventDate, sportType)
      : trackEventFavorite(eventId, eventName, eventDate, sportType);

    trackingPromise
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { favorited } = this.state;
    return (
      <div
        className={`event-action event-action-favorite${
          favorited ? "-active" : ""
        }`}
        onClick={this.onFavoriteClick}
      />
    );
  }
}

export default withTranslation()(EventFavoriteButton);
