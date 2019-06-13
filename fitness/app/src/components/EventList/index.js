import React from "react";
import { translate } from "react-i18next";
import EventListItem from "../EventListItem";
import { getAll } from "../../services/EventService";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import withSizes from "react-sizes";
import EventItemLoader from "../EventItemLoader";

const parseNumericValue = (value, defaultValue) => {
  let parsed;
  if (value) {
    parsed = Number.parseInt(value);
  }

  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
};

const parseBooleanValue = value => {
  let parsed = false;
  if (value) {
    parsed = value === "1";
  }
  return parsed;
};

class EventList extends React.Component {
  state = {
    events: [],
    take: parseNumericValue(this.props.params.take, -1),
    personalize: parseBooleanValue(this.props.params.personalize),
    skip: 0,
    totalEvents: 0,
    loading: true,
    error: false
  };

  constructor(props) {
    super(props);
    this.onLoadMoreClick = this.onLoadMoreClick.bind(this);
  }

  scrollToBottom = () => {
    this.loadMore.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    const { take, skip, personalize } = this.state;
    getAll(take, skip, 0, 0, "", personalize)
      .then(response => this.processEventData(response))
      .catch(error => {
        this.setState({ error: true });
        console.error(error);
      });
  }

  processEventData(response, concat = false) {
    if (response && response.data && response.data.events) {
      let { total, events } = response.data;
      if (concat) {
        events = this.state.events.concat(events);
      }
      this.setState({ events });
      this.setState({ total });
    }
    this.setState({ loading: false });
  }

  onLoadMoreClick() {
    let { take, skip, personalize } = this.state;
    skip = skip + take;

    this.setState({
      loading: true,
      take,
      skip
    });

    getAll(take, skip, 0, 0, "", personalize)
      .then(response => this.processEventData(response, true))
      .then(() => this.scrollToBottom())
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { events, loading, total, skip, take } = this.state;
    const { fields, params, width, height, t } = this.props;

    const showLoadMore = parseBooleanValue(params.showLoadMore);

    const canLoadMore = total > take;

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
      <div>
        <div className="eventsContainer">
          <div
            className={`events ${
              params.showInGrid === "1" ? "eventsGrid" : ""
            }`}
          >
            {params.showTitle === "1" && fields && fields.title && (
              <div className="list-header">
                <Text tag="h4" field={fields.title} className="list-title" />
              </div>
            )}
            <div className="events-items">{eventItems}</div>
            <div
              ref={el => {
                this.loadMore = el;
              }}
            />
          </div>
        </div>
        {showLoadMore && canLoadMore && (
          <div className="loadsMore">
            <button
              className="btn btn-primary btn-action"
              onClick={this.onLoadMoreClick}
            >
              {t("load-more")}
            </button>
          </div>
        )}
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

export default withSizes(mapSizesToProps)(translate()(EventList));
