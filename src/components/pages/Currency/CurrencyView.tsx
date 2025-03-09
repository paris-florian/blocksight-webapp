import React, { useState } from "react";
import { StatCard } from "../../StatCard";
import { ChartCard } from "../../ChartCard";
import styles from "./CurrencyView.module.css";
import { useParams } from "react-router";
import { DashboardTab } from "./Tabs/DashboardTab";
import { MarketParticipantsTab } from "./Tabs/MarketParticipantsTab";
import { SuperchartTab } from "./Tabs/SuperchartTab/SuperchartTab";
import { EntryAnalysisTab } from "./Tabs/EntryAnalysisTab";
import { InfluencersTab } from "./Tabs/InfluencersTab";
import { HighValueTradersTab } from "./Tabs/HighValueTradersTab";
import { InstitutionsTab } from "./Tabs/InstitutionsTab";

const CurrencyView: React.FC = () => {
  let { currencyId } = useParams();

  const tabs = [
    { name: "Dashboard", id: "dashboard", element: <DashboardTab />, }, 
    { name: "Market Participants", id: "market-participants", element: <MarketParticipantsTab/>, }, 
    { name: "Superchart", id: "superchart", element: <SuperchartTab fullscreen={false}/>, }, 
    // { name: "Entry Analysis", id: "entry-analysis", element: <EntryAnalysisTab/>, }, 
    { name: "Influencers", id: "influencers", element: <InfluencersTab/>, }, 
    { name: "High-Value Traders", id: "high-value-traders", element: <HighValueTradersTab/>, }, 
    { name: "Institutions", id: "institutions", element: <InstitutionsTab/>, }, 
  ];

  const [currentTab, setTab] = useState(tabs[0])

  return (
      <div className={styles.mainContent}>
        <header className={styles.tokenHeader}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/80c395bd9a848e3be7b94f639b10e2a192a869b763d5a61942632d889ffe7c11?placeholderIfAbsent=true"
            alt="Token icon"
            className={styles.tokenIcon}
          />
          <div className={styles.tokenInfo}>
            <h2 className={styles.tokenName}>$TRUMP</h2>
            <p className={styles.tokenPrice}>$13.244</p>
          </div>
        </header>

        <nav className={styles.navTabs}>
          { tabs.map(t => <button onClick={() => setTab(t)} className={styles.tab+" " + (currentTab.id === t.id ? styles.tabactive : "")}>{t.name}</button>) }
          {/* <button className={styles.tabactive}>Dashboard</button>
          <button className={styles.tab}>Market Participants</button>
          <button className={styles.tab}>Superchart</button>
          <button className={styles.tab}>Entry Analysis</button>
          <button className={styles.tab}>High-Value Traders</button>
          <button className={styles.tab}>Institutions</button>
          <button className={styles.tab}>Influencers</button> */}
        </nav>

        <div>
          {currentTab.element}
        </div>
      </div>
  );
};

export default CurrencyView;
