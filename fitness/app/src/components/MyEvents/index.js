import React, { Fragment } from "react";
import { translate } from "react-i18next";
import EventListItem from "../EventListItem";
import {
  getRegisteredEvents,
  getFavoritedEvents,
  removeFromFavorites
} from "../../services/EventService";
import { unsubscribe, subscribe } from "../../services/SubscriptionService";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import withSizes from "react-sizes";
import EventItemLoader from "../EventItemLoader";
import Tabs from "./Tabs";
import EventBadge from "./EventBadge";

const tabs = [
  {
    name: "registered-events",
    actionClassName: "event-action-subscribe",
    fetch: getRegisteredEvents,
    action: (eventId, subscribed) => {
      return subscribed ? subscribe(eventId) : unsubscribe(eventId);
    }
  },
  {
    name: "favorited-events",
    actionClassName: "event-action-favorite",
    fetch: getFavoritedEvents,
    action: removeFromFavorites
  }
];

class MyEvents extends React.Component {
  state = {
    activeTabIndex: 0,
    events: [],
    loading: true,
    error: false
  };

  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.unfavorite = this.unfavorite.bind(this);
  }

  onTabChange(e) {
    const tabIndex = Number.parseInt(e.target.name);
    this.setState({ activeTabIndex: tabIndex });
    this.fetchData(tabs[tabIndex].fetch);
  }

  unfavorite(eventId) {}

  componentDidMount() {
    this.fetchData(tabs[this.state.activeTabIndex].fetch);
  }

  fetchData(fetchingFunc) {
    this.setState({ loading: true });
    fetchingFunc()
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
    const { events, loading, activeTabIndex } = this.state;
    const { fields, width, height, t } = this.props;

    let eventItems = [];
    if (loading) {
      for (let i = 0; i < 9; i++) {
        eventItems.push(
          <EventItemLoader key={i} width={width} height={height} />
        );
      }
    } else {
      const activeTab = tabs[activeTabIndex];
      eventItems = events.map((e, i) => {
        return (
          <EventListItem
            key={i}
            {...e}
            showDescription={false}
            showMetatags={false}
            badge={
              <EventBadge
                eventId={e.id}
                active={e.active}
                className={activeTab.actionClassName}
                action={activeTab.action}
              />
            }
          />
        );
      });
    }

    return (
      <Fragment>
        <Tabs
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          onTabChange={this.onTabChange}
        />
        <div className="events eventsGrid">
          {eventItems.length <= 0 && (
            <h4 className="list-title">{t("no-events")}</h4>
          )}
          <div className="events-items">{eventItems}</div>
        </div>
      </Fragment>
    );
  }
}

const mapSizesToProps = function(sizes) {
  return {
    width: sizes.width,
    height: sizes.height
  };
};

export default withSizes(mapSizesToProps)(translate()(MyEvents));
