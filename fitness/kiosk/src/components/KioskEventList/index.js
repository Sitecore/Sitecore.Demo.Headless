import React from "react";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";
import EventListItem from "../EventListItem";
import { getAll, EventDisplayCount } from "../../services/EventService";
import {
  getCurrentLocation,
  getCurrentCoordinates
} from "../../services/GeolocationService";
import withSizes from "react-sizes";
import EventItemLoader from "../EventItemLoader";
import SportsFilter from "../SportsFilter";

const eventBatchSize = 6;

class KioskEventList extends React.Component {
  state = {
    events: [],
    loading: true,
    sportsFilterOpen: false,
    location: getCurrentLocation(),
    take: eventBatchSize,
    skip: 0,
    totalEvents: 0,
    filter: []
  };

  constructor(props) {
    super(props);
    this.toggleSportsFilter = this.toggleSportsFilter.bind(this);
    this.onApplyFilter = this.onApplyFilter.bind(this);
    this.onLoadMoreClick = this.onLoadMoreClick.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom = () => {
    this.loadMore.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    const { take, skip } = this.state;
    const { lat, lng } = getCurrentCoordinates();

    getAll(take, skip, lat, lng)
      .then(response => this.processEventData(response))
      .catch(error => {
        console.error(error);
      });
  }

  toggleSportsFilter() {
    this.setState({
      sportsFilterOpen: !this.state.sportsFilterOpen
    });
  }

  onLoadMoreClick() {
    let { take, skip, filter } = this.state;
    const { lat, lng } = getCurrentCoordinates();

    take = take + eventBatchSize;
    skip = skip + eventBatchSize;

    this.setState({
      loading: true,
      take,
      skip
    });

    getAll(take, skip, lat, lng, filter)
      .then(response => this.processEventData(response, true))
      .then(() => this.scrollToBottom())
      .catch(error => {
        console.error(error);
      });
  }

  onApplyFilter(filter) {
    this.toggleSportsFilter();
    this.setState({ filter });

    // resetting take and skip after a filter is applied
    const take = eventBatchSize;
    const skip = 0;

    const { lat, lng } = getCurrentCoordinates();
    this.setState({ loading: true, take, skip });

    getAll(take, skip, lat, lng, filter)
      .then(response => this.processEventData(response))
      .catch(error => {
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

  render() {
    const { events, loading, location, total, skip, take } = this.state;
    const { fields, width, height, t } = this.props;

    const canLoadMore = total > take;

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
      <div className="eventsSearchResults">
        <div className="eventsSearchResults-header">
          <div className="eventsFilter">
            <div className="eventsFilter-status">
              <p>
                {t("showing-results")}&nbsp;
                <span className="term">{location}</span>
              </p>
              <NavLink
                to={"/change-location"}
                className="eventsFilter-changeLocation"
              >
                {t("change-location")}
              </NavLink>
            </div>
            <div className="eventsFilter-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.toggleSportsFilter}
              >
                <span className="ico ico-left-text ico-filter" />
                <span className="txt">{t("filter-sport")}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="eventsSearchResults-content">
          <div className="eventsContainer">
            <div className="events eventsGrid">
              <div className="events-items">{eventItems}</div>
            </div>
            <div
              ref={el => {
                this.loadMore = el;
              }}
            />
            {canLoadMore && (
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
        </div>
        <SportsFilter
          sports={fields.sports}
          open={this.state.sportsFilterOpen}
          onToggle={this.toggleSportsFilter}
          onApply={this.onApplyFilter}
          onCancel={this.toggleSportsFilter}
        />
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

export default withSizes(mapSizesToProps)(translate()(KioskEventList));
