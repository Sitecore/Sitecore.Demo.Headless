import React from "react";
import Tab from "../Tab";

const Tabs = ({ tabs, activeTabIndex, onTabChange }) => {
  return (
    <div className="tabsNav">
      <ul className="tabsNav-items">
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              index={index}
              {...tab}
              active={index == activeTabIndex}
              onTabChange={onTabChange}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Tabs;
