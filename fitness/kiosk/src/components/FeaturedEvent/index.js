import React from "react";
import EventListItem from "../EventListItem";

const FeaturedEvent = props => {
  return (
    <div className="events">
      <div className="events-items">
        <EventListItem featured {...props.fields.event} {...props.fields} />
        <div className="events-items-sep">
          <span />
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
