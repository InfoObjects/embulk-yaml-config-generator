import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

type TabProps = {
  name: string;
  key: string;
};

type TabLayoutProps = {
  tabs: TabProps[];
  type: string;
  selectedTab: string;
  onTabSelect: (eventName: any, type: string) => void;
  children?: any;
  eventKey?: number | string;
};

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  type,
  selectedTab,
  onTabSelect,
  children,
}) => {
  const [activeKey, setActiveKey] = useState<any>(null);

  useEffect(() => {
    if (selectedTab && selectedTab !== activeKey) {
      setActiveKey(selectedTab);
    }
  }, [selectedTab]);

  const handleSelect = (key: string) => {
    setActiveKey(key);
    onTabSelect(key, type);
  };
  return (
    <>
      <Tab.Container activeKey={activeKey}>
        <div className="btn-toolbar mb-2 mb-md-0">
          {tabs.map((tab, index) => {
            return (
              <button
                key={"tab-btn-" + type + "-" + index}
                onClick={() => handleSelect(tab.key)}
                className={
                  "btn btn-sm me-2 " +
                  (activeKey === tab.key
                    ? "btn-secondary"
                    : "btn-outline-secondary")
                }
              >
                {tab.name}
              </button>
            );
          })}
        </div>
        <Tab.Content>
          {activeKey && <Tab.Pane eventKey={activeKey}>{children}</Tab.Pane>}
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default TabLayout;
