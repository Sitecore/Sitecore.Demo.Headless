import React from "react";
import { NavLink } from 'react-router-dom';
import { translate } from "react-i18next";
import EventListItem from "../EventListItem";
import { getAll, EventDisplayCount } from "../../services/EventService";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import withSizes from "react-sizes";
import EventItemLoader from "../EventItemLoader";

class KioskEventList extends React.Component {
  state = {
    events: [],
    loading: true
  };

  componentDidMount() {
    getAll()
      .then(response => {
        this.setState({ events: response.data });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { events, loading } = this.state;
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
                <strong className="term">San Franciso, CA</strong>.
              </p>
              <NavLink to={"/change-location"} className="eventsFilter-changeLocation">
                {t("change-location")}
              </NavLink>
            </div>
            <div className="eventsFilter-actions">
              <button type="button" className="btn btn-primary">
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
            <div className="loadsMore">
              <a href="#" className="btn btn-primary btn-action">
                {t("load-more")}
              </a>
            </div>
          </div>
        </div>
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
