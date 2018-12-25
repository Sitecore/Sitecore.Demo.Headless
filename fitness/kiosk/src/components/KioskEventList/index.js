import React from "react";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";
import EventListItem from "../EventListItem";
import { getAll, EventDisplayCount } from "../../services/EventService";
import { getCurrentLocation, getCurrentCoordinates } from "../../services/GeolocationService";
import withSizes from "react-sizes";
import EventItemLoader from "../EventItemLoader";
import SportsFilter from "../SportsFilter";

class KioskEventList extends React.Component {
  state = {
    events: [],
    loading: true,
    sportsFilterOpen: false,
    location: getCurrentLocation(),
    take: 12,
    skip: 0
  };

  constructor(props) {
    super(props);
    this.toggleSportsFilter = this.toggleSportsFilter.bind(this);
    this.onApplyFilter = this.onApplyFilter.bind(this);
  }

  componentDidMount() {
    const { take, skip } = this.state;
    const { lat, lng } = getCurrentCoordinates();

    getAll(take, skip, lat, lng)
      .then(response => {
        this.setState({ events: response.data });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  }

  toggleSportsFilter() {
    this.setState({
      sportsFilterOpen: !this.state.sportsFilterOpen
    });
  }

  onApplyFilter(filter) {
    this.toggleSportsFilter();
    this.setState({ loading: true });
    const { take, skip } = this.state;
    const { lat, lng } = getCurrentCoordinates();

    getAll(take, skip, lat, lng, filter)
      .then(response => {
        this.setState({ events: response.data });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { events, loading, location } = this.state;
    const { fields, width, height, t } = this.props;

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
            {events.length > 6 && (
              <div className="loadsMore">
                <a href="#" className="btn btn-primary btn-action">
                  {t("load-more")}
                </a>
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
