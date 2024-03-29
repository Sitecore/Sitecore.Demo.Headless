import React, { Component, Fragment } from "react";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { withRouter } from "react-router";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import SportOption from "../SportOption";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ContinueButton from "../ContinueButton";
import PersonalizationResultsButton from "../PersonalizationResultsButton";
import { translate } from "react-i18next";
import { setSportsFacets } from "../../services/SportsService";
import { isBoxeverConfigured } from "../../services/BoxeverService";

class SportsPickerStep extends Component {
  state = {
    selectedSports: {},
    selectedItemKey: null
  };

  constructor(props) {
    super(props);
    this.onCardClick = this.onCardClick.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.trackCompleteFavoriteSports = this.trackCompleteFavoriteSports.bind(this);
  }

  onCardClick(key, remove) {
    if (remove) {
      this.setState({ selectedItemKey: null });
      this.updateSelectedSports(key, null);
    } else {
      this.setState({ selectedItemKey: key });
      this.updateSelectedSports(key, undefined);
    }
  }

  trackCompleteFavoriteSports() {
    if (!isBoxeverConfigured()) {
      return new Promise(function (resolve) { resolve(); });
    }

    return setSportsFacets(this.state.selectedSports);
  }

  updateSelectedSports(key, value) {
    let selectedSports = this.state.selectedSports;
    if (value == null && Object.keys(selectedSports).includes(key)) {
      delete selectedSports[key];
    } else {
      selectedSports[key] = value !== undefined ? value : 5;
    }
    this.setState({ selectedSports });
  }

  onSliderChange(value) {
    this.updateSelectedSports(this.state.selectedItemKey, value);
  }

  render() {
    const { selectedSports, selectedItemKey } = this.state;
    const { stepCount, fields, t } = this.props;

    const anySportSelected = Object.keys(selectedSports).length > 0;
    const sliderValue = selectedItemKey ? selectedSports[selectedItemKey] : 5;

    const selectedSport = fields.sports.find(
      s => s.fields.Name.value === selectedItemKey
    );

    const canContinue = Object.keys(selectedSports).length > 0;

    return (
      <Fragment>
        <div className="sportPicker">
          <div className="sportPicker-header">
            <Text field={fields.title} tag="h4" className="sportPicker-title" />
          </div>

          <div className="sportPicker-options">
            {fields.sports.map((sport, index) => (
              <SportOption
                key={index}
                data={sport}
                selected={selectedSports[sport.fields.Name.value] !== undefined}
                onCardClick={this.onCardClick}
              />
            ))}
          </div>
        </div>

        {selectedSport && anySportSelected ? (
          <div className="sportSkill">
            <div className="sportSkill-header">
              <p className="sportSkill-title">
                {fields.selectSkillTitle.value.replace(
                  "$selected-sport",
                  selectedSport.fields.Name.value
                )}
              </p>
            </div>

            <div className="sportSkill-content">
              <div className="sportSkill-slider">
                <Slider
                  step={1}
                  min={1}
                  max={10}
                  value={sliderValue}
                  onChange={this.onSliderChange}
                />
              </div>
              <div className="sportSkill-legends">
                <div className="sportSkill-legend sportSkill-legend_left">
                  {t("beginner")}
                </div>
                <div className="sportSkill-legend sportSkill-legend_right">
                  {t("expert")}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="sportPicker-actions align-items-center">
          {stepCount > 1 ? (
            <ContinueButton
              currentContext={this.props.currentContext}
              disabled={!canContinue}
            />
          ) : (
            <PersonalizationResultsButton onClick={this.trackCompleteFavoriteSports}/>
          )}
        </div>
      </Fragment>
    );
  }
}

export default withRouter(translate()(SportsPickerStep));
