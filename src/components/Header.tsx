import { useState } from "react";
import styles from "./Header.module.css";

export const Header = () => {
    const currentPage = useState()
    return <header className={styles.header}>
        <div className={styles.headerContent}>
          <nav className={styles.navSection}>
            <h1 className={styles.logo}>BlockSight</h1>
            <ul className={styles.navLinks}>
              <li>Feed</li>
              <li>Market Overview</li>
              <li>Top Traders</li>
              <li>Top Institutions</li>
              <li>Top Influencers</li>
            </ul>
          </nav>
          <input
            type="search"
            placeholder="Search for tokens, traders, influencers..."
            className={styles.searchBar}
          />
        </div>
      </header>
}