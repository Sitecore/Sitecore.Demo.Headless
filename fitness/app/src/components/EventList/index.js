import React from "react";
import EventListItem from "../EventListItem";
import { getAll, EventDisplayCount } from "../../services/EventService";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import withSizes from "react-sizes";
import EventItemLoader from "../EventItemLoader";

class EventList extends React.Component {
  state = {
    events: [],
    loading: true,
    error: false
  };

  componentDidMount() {
    getAll()
      .then(response => {
        this.setState({ events: response.data });
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ error: true });
        console.error(error);
      });
  }

  render() {
    const { events, loading, error } = this.state;
    const { fields, width, height } = this.props;

    let eventItems = [];
    if (loading) {
      for (let i = 0; i < EventDisplayCount; i++) {
        eventItems.push(
          <EventItemLoader key={i} width={width} height={height} />
        );
      }
    } else {
      eventItems = events.map((e, i) => <EventListItem key={i} {...e} />);
    }

    return (
      <div className="events">
        <div className="list-header">
          <Text tag="h4" field={fields.title} className="list-title" />
        </div>
        <div className="events-items">{eventItems}</div>
      </div>
    );
  }
}

const mapSizesToProps = function(sizes) {
  return {
    width: sizes.width,
    height: sizes.height
  };
};

export default withSizes(mapSizesToProps)(EventList);
