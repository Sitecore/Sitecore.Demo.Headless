import React from "react";
import { withTranslation } from "react-i18next";
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
    const eventName = this.props.routeData.name;

    if( this.state.subscribed){
      unsubscribe(eventId,eventName);
    } else {
      subscribe(eventId,eventName);
    }

    const trackingPromise = this.state.subscribed
      ? trackEventUnsubscription(eventId)
      : trackEventSubscribe(eventId);

    trackingPromise
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

export default withTranslation()(EventSubscribeButton);
