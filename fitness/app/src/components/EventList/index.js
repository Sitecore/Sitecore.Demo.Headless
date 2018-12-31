import React from "react";
import EventListItem from "../EventListItem";
import { getAll } from "../../services/EventService";
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
    const takeParam = this.props.params.take;
    let take = -1;
    if (takeParam) {
      take = Number.parseInt(takeParam);
    }

    const personalizeParam = this.props.params.personalize;
    let personalize = false;
    if (personalizeParam) {
      personalize = personalizeParam === "1";
    }

    getAll({ take: takeParam, personalize: personalize })
      .then(response => {
        if (response && response.data && response.data.events) {
          this.setState({ events: response.data.events });
          this.setState({ error: false });
        } else {
          console.warn("unable to fetch any events");
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ error: true });
        console.error(error);
      });
  }

  render() {
    const { events, loading } = this.state;
    const { fields, params, width, height } = this.props;

    let eventItems = [];
    if (loading) {
      for (let i = 0; i < 9; i++) {
        eventItems.push(
          <EventItemLoader key={i} width={width} height={height} />
        );
      }
    } else {
      eventItems = events.map((e, i) => (
        <EventListItem
          key={i}
          {...e}
          showMetatags={false}
          showDescription={params.showEventDescription === "1"}
        />
      ));
    }

    return (
      <div
        className={`events ${params.showInGrid === "1" ? "eventsGrid" : ""}`}
      >
        {params.showTitle === "1" && fields && fields.title && (
          <div className="list-header">
            <Text tag="h4" field={fields.title} className="list-title" />
          </div>
        )}
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
