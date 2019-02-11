import React from "react";
import EventDetail from "../EventDetail";

// need the user state-specific component since the kiosk app is reusing the event pages from the mobile app
const EventDetailLoggedIn = props => <EventDetail {...props} />;

export default EventDetailLoggedIn;
