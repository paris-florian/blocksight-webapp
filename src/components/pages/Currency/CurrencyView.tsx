import React, { useState, useEffect } from "react";
import { StatCard } from "../../StatCard";
import { ChartCard } from "../../ChartCard";
import styles from "./CurrencyView.module.css";
import { useParams, useNavigate } from "react-router";
import { DashboardTab } from "./Tabs/DashboardTab";
import { MarketParticipantsTab } from "./Tabs/MarketParticipantsTab";
import { SuperchartTab } from "./Tabs/SuperchartTab/SuperchartTab";
import { EntryAnalysisTab } from "./Tabs/EntryAnalysisTab";
import { InfluencersTab } from "./Tabs/InfluencersTab/InfluencersTab";
import FeedTab from "./Tabs/FeedTab";
import { sidebarTokens } from "../../Sidebar/Sidebar";
import { priceService } from "../../../services/PriceService";
import TokenSearchPopup from "../../../components/TokenSearchPopup/TokenSearchPopup";
import CustomTabNavigation from "../../shared/CustomTabNavigation";
import { ViewHeader } from "../../shared/ViewHeader";
import { tokens } from "../../../data/data";
import { FollowButton } from "../../shared/FollowButton";
import { Box } from "@mui/material";
import { TopTradersTab } from "./Tabs/TopTradersTab/TopTradersTab";
import { InstitutionsTab } from "./Tabs/InstitutionsTab/InstitutionsTab";

const CurrencyView: React.FC = () => {  
  let { currencyId } = useParams();
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Find the current token by ID, symbol, or contract address
  const currentToken = sidebarTokens.find(token => {
    if (!currencyId) return false;
    
    const lowerCurrencyId = currencyId.toLowerCase();
    
    // Check if currencyId matches symbol
    if (token.symbol.toLowerCase() === lowerCurrencyId) {
      return true;
    }
    
    // Find the original token to check contract address
    const originalToken = tokens.find(t => t.symbol === token.symbol);
    if (originalToken && originalToken.contractAddress && 
        originalToken.contractAddress.toLowerCase() === lowerCurrencyId) {
      return true;
    }
    
    return false;
  }) || sidebarTokens[0];

  // Subscribe to price updates
  useEffect(() => {
    const unsubscribe = priceService.subscribeToPriceUpdates(
      currentToken.symbol,
      (price: number) => setCurrentPrice(priceService.formatPrice(price))
    );
    return () => unsubscribe();
  }, [currentToken.symbol]);

  const handleTokenSelect = (token: typeof sidebarTokens[0]) => {
    // Find the original token to get the ID
    const originalToken = tokens.find(t => t.symbol === token.symbol);
    const identifier = originalToken?.id || token.symbol.toLowerCase();
    
    // Update URL preserving the current hash
    const hash = window.location.hash;
    navigate(`/currencies/${identifier}${hash}`);
    setSearchOpen(false);
  };

  // Define tab IDs for reference
  const tabIds = {
    dashboard: "dashboard",
    feed: "feed",
    superchart: "superchart",
    topTraders: "top-traders",
    institutions: "institutions",
    influencers: "influencers"
  };

  // Initialize current tab based on URL hash or default to first tab
  const [currentTabId, setCurrentTabId] = useState(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    return Object.values(tabIds).includes(hash) ? hash : tabIds.dashboard;
  });

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = currentTabId;
  }, [currentTabId]);

  // Listen for hash changes and update the current tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (Object.values(tabIds).includes(hash)) {
        setCurrentTabId(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Define tabs with the current currency symbol
  const getTabs = () => [
    { name: "Dashboard", id: tabIds.dashboard, element: <DashboardTab /> }, 
    { name: "Feed", id: tabIds.feed, element: <FeedTab currencySymbol={currentToken.symbol} /> }, 
    { name: "Superchart", id: tabIds.superchart, element: <div style={{ height: "28rem"}}><SuperchartTab fullscreen={false}/></div> }, 
    { name: "Top Traders", id: tabIds.topTraders, element: <TopTradersTab /> }, 
    { name: "Institutions", id: tabIds.institutions, element: <InstitutionsTab/> }, 
    { name: "Influencers", id: tabIds.influencers, element: <InfluencersTab/> }, 
  ];

  // Get the current tabs array with up-to-date components
  const tabs = getTabs();
  
  // Get the current tab based on the ID
  const currentTab = tabs.find(tab => tab.id === currentTabId) || tabs[0];

  return (
    <div className={styles.currencyView}>
      <div className={styles.viewHeader}>
        <ViewHeader
          title={`${currentToken.name} ($${currentToken.symbol})`}
          subtitle={currentPrice}
          iconUrl={currentToken.iconUrl}
          onSwap={() => setSearchOpen(true)}
          showSwapButton={true}
          rightContent={
            <FollowButton 
              id={currentToken.symbol.toLowerCase()}
              name={currentToken.name}
              symbol={currentToken.symbol}
              image={currentToken.iconUrl}
              type="currency"
              size="medium"
            />
          }
        />
      </div>

      <CustomTabNavigation
        tabs={tabs}
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTabId(tab.id)}
      />

      <div style={{marginTop: "1.2rem"}}>
        {currentTab.element}
      </div>

      <TokenSearchPopup
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onTokenSelect={handleTokenSelect}
        tokens={sidebarTokens.map(token => ({
          ...token,
          price: priceService.formatPrice(priceService.getPrice(token.symbol))
        }))}
      />
    </div>
  );
};

export default CurrencyView;
