import React from "react";
import { translate } from "react-i18next";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import GoogleMapReact from "google-map-react";
import {
  getLatitude,
  getLongitude,
  findLocationByAddress,
  getCurrentLocation,
  updateGeoLocation
} from "../../services/GeolocationService";
import Icon from '../Icon';

class ChangeLocation extends React.Component {
  state = {
    address: "",
    location: getCurrentLocation(),
    lat: getLatitude(),
    lng: getLongitude(),
    locationSet: true,
    error: false
  };

  constructor(props) {
    super(props);
    this.updateAddress = this.updateAddress.bind(this);
    this.onGoClick = this.onGoClick.bind(this);
    this.onChooseLocationClick = this.onChooseLocationClick.bind(this);
  }

  onChooseLocationClick() {
    updateGeoLocation(this.state);
    this.setState({ locationSet: true });
  }

  updateAddress(event) {
    this.setState({ address: event.target.value });
  }

  onGoClick() {
    this.getLocationByAddress();
  }

  getLocationByAddress() {
    const { address } = this.state;
    if (address) {
      findLocationByAddress(address)
        .then(response => {
          if (
            response.data &&
            response.data.results &&
            response.data.results.length > 0
          ) {
            const firstMatch = response.data.results[0];
            console.log({ location: firstMatch });

            const location = firstMatch.formatted_address;
            const { lat, lng } = firstMatch.geometry.location;
            this.setState({ location });
            this.setState({ lat });
            this.setState({ lng });
            this.setState({ locationSet: false });
            this.setState({ error: false });
          } else {
            console.warn("No results returned from Google Maps API");
            this.setState({ error: true });
          }
        })
        .catch(error => {
          this.setState({ error: true });
          console.error(error);
        });
    }
  }

  render() {
    const { zoom, t } = this.props;
    const { address, location, lat, lng, locationSet, error } = this.state;

    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    if (!apiKey) {
      console.error(
        "GOOGLE_API_KEY is missing. Please add it to environment variables. More in readme: https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md"
      );
    }

    const center = {
      lat: lat,
      lng: lng
    };

    return (
      <div className="changeLocation">
        <div className="changeLocation-search">
          <input
            type="text"
            placeholder={location ? location : t("enter-location")}
            value={address}
            onChange={this.updateAddress}
          />
          <button
            className="btn btn-primary"
            onClick={this.onGoClick}
            disabled={address == ""}
          >
            {t("go")}
          </button>
        </div>

        <div className="changeLocation-map">
          <div className="map">
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              defaultZoom={zoom}
              center={center}
            />
          </div>
          {locationSet ? (
            <button
              className="btn btn-primary btn-action"
              disabled={true}
              onClick={this.onChooseLocationClick}
            >
              {t("location-set")}&nbsp;
              <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDk3LjYxOSA5Ny42MTgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk3LjYxOSA5Ny42MTg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNOTYuOTM5LDE3LjM1OEw4My45NjgsNS45NTljLTAuMzk4LTAuMzUyLTAuOTI3LTAuNTMxLTEuNDQ5LTAuNDk0QzgxLjk5LDUuNSw4MS40OTYsNS43NDMsODEuMTQ2LDYuMTQyTDM0LjEsNTkuNjg4ICAgTDE3LjM3MiwzNy41NDdjLTAuMzE5LTAuNDIyLTAuNzk0LTAuNzAxLTEuMzE5LTAuNzczYy0wLjUyNC0wLjA3OC0xLjA1OSwwLjA2NC0xLjQ4MSwwLjM4NUwwLjc5NCw0Ny41NjcgICBjLTAuODgxLDAuNjY2LTEuMDU2LDEuOTItMC4zOSwyLjgwMWwzMC45NzQsNDAuOTk2YzAuMzYyLDAuNDc5LDAuOTIyLDAuNzcxLDEuNTIyLDAuNzkzYzAuMDI0LDAsMC4wNDksMCwwLjA3MywwICAgYzAuNTc0LDAsMS4xMjItMC4yNDYsMS41MDMtMC42OGw2Mi42NDQtNzEuMjk3Qzk3Ljg1LDE5LjM1MSw5Ny43NjksMTguMDg2LDk2LjkzOSwxNy4zNTh6IiBmaWxsPSIjRkZGRkZGIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
            </button>
          ) : (
            <button
              className="btn btn-primary btn-action"
              disabled={error}
              onClick={this.onChooseLocationClick}
            >
              {t("choose-location")}
            </button>
          )}
        </div>
      </div>
    );
  }
}

ChangeLocation.defaultProps = {
  zoom: 11
};

export default translate()(ChangeLocation);
