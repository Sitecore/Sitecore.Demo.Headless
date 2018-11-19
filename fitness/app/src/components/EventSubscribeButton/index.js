import React from "react";
import { translate } from "react-i18next";
import { subscribe, unsubscribe } from "../../services/SubscriptionService";
import {
  trackEventSubscribe,
  trackEventUnsubscription
} from "../../services/TrackingService";

class EventSubscribeButton extends React.Component {
  state = {
    subscribed:
      this.props.context &&
      this.props.context.event &&
      this.props.context.event.subscribed
  };

  constructor(props) {
    super(props);
    this.onSubscribeClick = this.onSubscribeClick.bind(this);
  }

  onSubscribeClick() {
    // optimistic UI update
    this.setState({ subscribed: !this.state.subscribed });
    const eventId = this.props.routeData.itemId;
    const operation = this.state.subscribed
      ? unsubscribe(eventId)
      : subscribe(eventId);

    operation
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        this.setState({ subscribed: false });
        console.log(err);
      });

    const trackingPromise = this.state.subscribed
      ? trackEventUnsubscription(eventId)
      : trackEventSubscribe(eventId);

    trackingPromise
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { subscribed } = this.state;
    const suffix = subscribed ? "-active" : "";
    return (
      <div
        className={`event-action event-action-subscribe${suffix}`}
        onClick={this.onSubscribeClick}
      />
    );
  }
}

export default translate()(EventSubscribeButton);
