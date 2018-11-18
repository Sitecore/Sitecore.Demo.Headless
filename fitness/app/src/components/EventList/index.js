import React from "react";
import EventListItem from "../EventListItem";
import { getAll } from "../../services/EventService";
import { Text } from "@sitecore-jss/sitecore-jss-react";

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
    const { fields } = this.props;

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (error) {
      return <h1>Error</h1>;
    }

    return (
      <div className="events">
        <div class="productRecommendationList-header">
          <Text
            tag="h4"
            field={fields.title}
            className="productRecommendationList-title"
          />
        </div>
        <div className="events-items">
          {events.map((e, i) => (
            <EventListItem key={i} {...e} />
          ))}
        </div>
      </div>
    );
  }
}

export default EventList;
