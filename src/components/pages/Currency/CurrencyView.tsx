import React, { useState, useEffect } from "react";
import { StatCard } from "../../StatCard";
import { ChartCard } from "../../ChartCard";
import styles from "./CurrencyView.module.css";
import { useParams, useNavigate } from "react-router";
import { DashboardTab } from "./Tabs/DashboardTab";
import { MarketParticipantsTab } from "./Tabs/MarketParticipantsTab";
import { SuperchartTab } from "./Tabs/SuperchartTab/SuperchartTab";
import { EntryAnalysisTab } from "./Tabs/EntryAnalysisTab";
import { InfluencersTab } from "./Tabs/InfluencersTab";
import { HighValueTradersTab } from "./Tabs/HighValueTradersTab";
import { InstitutionsTab } from "./Tabs/InstitutionsTab";
import { mockTokens } from "../../Sidebar/Sidebar";
import { priceService } from "../../../services/PriceService";
import TokenSearchPopup from "../../../components/TokenSearchPopup/TokenSearchPopup";
import { IconButton } from "@mui/material";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const CurrencyView: React.FC = () => {  
  let { currencyId } = useParams();
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Find the current token
  const currentToken = mockTokens.find(
    token => token.symbol.toLowerCase() === currencyId?.toLowerCase()
  ) || mockTokens[0];

  // Subscribe to price updates
  useEffect(() => {
    const unsubscribe = priceService.subscribeToPriceUpdates(
      currentToken.symbol,
      (price: number) => setCurrentPrice(priceService.formatPrice(price))
    );
    return () => unsubscribe();
  }, [currentToken.symbol]);

  const handleTokenSelect = (token: typeof mockTokens[0]) => {
    // Update URL preserving the current hash
    const hash = window.location.hash;
    navigate(`/currencies/${token.symbol.toLowerCase()}${hash}`);
    setSearchOpen(false);
  };

  const tabs = [
    { name: "Dashboard", id: "dashboard", element: <DashboardTab />, }, 
    { name: "Market Participants", id: "market-participants", element: <MarketParticipantsTab/>, }, 
    { name: "Superchart", id: "superchart", element: <div style={{ height: "28rem"}}><SuperchartTab fullscreen={false}/></div>, }, 
    // { name: "Entry Analysis", id: "entry-analysis", element: <EntryAnalysisTab/>, }, 
    { name: "Influencers", id: "influencers", element: <InfluencersTab/>, }, 
    { name: "High-Value Traders", id: "high-value-traders", element: <HighValueTradersTab/>, }, 
    { name: "Institutions", id: "institutions", element: <InstitutionsTab/>, }, 
  ];

  // Initialize current tab based on URL hash or default to first tab
  const [currentTab, setTab] = useState(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    return tabs.find(t => t.id === hash) || tabs[0];
  });

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = currentTab.id;
  }, [currentTab]);

  // Listen for hash changes and update the current tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const tab = tabs.find(t => t.id === hash);
      if (tab) {
        setTab(tab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [tabs]);

  return (
      <div className={styles.mainContent}>
        <header className={styles.tokenHeader}>
          <div className={styles.tokenIconContainer}>
            <img
              src={currentToken.iconUrl}
              alt={`${currentToken.name} icon`}
              className={styles.tokenIcon}
            />
            <IconButton 
              className={styles.swapButton}
              size="small"
              aria-label="swap token"
              onClick={() => setSearchOpen(true)}
            >
              <SwapHorizIcon fontSize="small" sx={{fill: "white"}} />
            </IconButton>
          </div>
          <div className={styles.tokenInfo}>
            <h2 className={styles.tokenName}>${currentToken.symbol}</h2>
            <p className={styles.tokenPrice}>{currentPrice}</p>
          </div>
        </header>

        <nav className={styles.navTabs}>
          {tabs.map(t => (
            <button 
              key={t.id}
              onClick={() => setTab(t)} 
              className={`${styles.tab} ${currentTab.id === t.id ? styles.tabactive : ""}`}
            >
              {t.name}
            </button>
          ))}
        </nav>

        <div style={{marginTop: "1.2rem"}}>
          {currentTab.element}
        </div>

        <TokenSearchPopup
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onTokenSelect={handleTokenSelect}
          tokens={mockTokens.map(token => ({
            ...token,
            price: priceService.formatPrice(priceService.getPrice(token.symbol))
          }))}
        />
      </div>
  );
};

export default CurrencyView;
