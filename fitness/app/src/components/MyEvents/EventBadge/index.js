import React from "react";

class EventBadge extends React.Component {
  state = {
    active: this.props.active === undefined ? true : this.props.active
  };

  constructor(props) {
    super(props);
    this.onBadgeClick = this.onBadgeClick.bind(this);
  }

  onBadgeClick() {
    this.setState({ active: !this.state.active });
    this.props.action(this.props.eventId);
    this.props.onAction();
  }

  render() {
    const { eventId, className } = this.props;
    const { active } = this.state;

    debugger;

    return (
      <div
        className={`event-action ${className}${
          active === false ? "" : "-active"
        }`}
        onClick={this.onBadgeClick}
      />
    );
  }
}

export default EventBadge;
