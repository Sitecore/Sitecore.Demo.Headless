import React from "react";
import { translate } from "react-i18next";
import {
  addToFavorites,
  removeFromFavorites
} from "../../services/EventService";

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
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        this.setState({ favorited: false });
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

export default translate()(EventFavoriteButton);
