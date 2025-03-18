import React, { useState, useEffect, ReactElement } from "react";
import styles from "./EntityView.module.css";
import { useParams, useNavigate } from "react-router";
import CustomTabNavigation from "../../shared/CustomTabNavigation";
import { ViewHeader } from "../../shared/ViewHeader";
import { traders } from "../../../data/data";
import { FollowButton } from "../../shared/FollowButton";

interface Tab {
  name: string;
  id: string;
  element: ReactElement;
}

interface EntityViewProps {
  // Add any props if needed
}

const EntityView: React.FC<EntityViewProps> = () => {  
  let { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();

  // Find the trader by ID
  const trader = entityId ? traders.find(t => t.id === entityId) : undefined;

  // Initialize current tab based on URL hash or default to first tab
  const tabs: Tab[] = [
    { name: "Overview", id: "overview", element: <div>Overview Content</div> },
    { name: "Details", id: "details", element: <div>Details Content</div> },
    { name: "Activity", id: "activity", element: <div>Activity Content</div> },
  ];

  const [currentTab, setTab] = useState<Tab>(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    return tabs.find(t => t.id === hash) || tabs[0];
  });

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = currentTab.id;
  }, [currentTab]);

  // Listen for hash changes and update the current tab
  useEffect(() => {
    const handleHashChange = (): void => {
      const hash = window.location.hash.slice(1);
      const tab = tabs.find(t => t.id === hash);
      if (tab) {
        setTab(tab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [tabs]);

  if (!trader) {
    return <div className={styles.entityView}>Entity not found</div>;
  }

  return (
    <div className={styles.entityView}>
      <div className={styles.entityHeader}>
        <ViewHeader
          title={trader.name}
          subtitle="Trader Profile"
          iconUrl={trader.image}
          rightContent={
            <FollowButton 
              id={trader.id}
              name={trader.name}
              image={trader.image}
              type="trader"
              size="medium"
            />
          }
        />
      </div>

      <CustomTabNavigation
        tabs={tabs}
        currentTab={currentTab}
        onTabChange={setTab}
      />

      <div style={{marginTop: "1.2rem"}}>
        {currentTab.element}
      </div>
    </div>
  );
};

export default EntityView; 