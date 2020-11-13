import React from "react";
import { withTranslation } from "react-i18next";
import {
  addToFavorites,
  removeFromFavorites
} from "../../services/EventService";
import {
  trackEventFavorite,
  trackEventUnfavorite
} from "../../services/TrackingService";

class EventFavoriteButton extends React.Component {
  state = {
    favorited:
      this.props.context &&
      this.props.context.event &&
      this.props.context.event.favorited
  };

  constructor(props) {
    super(props);
    this.onFavoriteClick = this.onFavoriteClick.bind(this);
  }

  onFavoriteClick() {
    // optimistic UI update
    this.setState({ favorited: !this.state.favorited });
    const eventId = this.props.routeData.itemId;
    const operation = this.state.favorited
      ? removeFromFavorites(eventId)
      : addToFavorites(eventId);

    operation
      .catch(err => {
        this.setState({ favorited: false });
        console.log(err);
      });

    const trackingPromise = this.state.favorited
      ? trackEventUnfavorite(eventId)
      : trackEventFavorite(eventId);

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
