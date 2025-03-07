"use client";
import React from "react";
import styles from "./ChartCard.module.css";

interface ChartCardProps {
  title: string;
  dateRange: string;
  chartContent: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  dateRange,
  chartContent,
}) => {
  return (
    <article className={styles.chartCard}>
      <header className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <time className={styles.chartDate}>{dateRange}</time>
      </header>
      <div
        className={styles.chartContent}
        dangerouslySetInnerHTML={{ __html: chartContent }}
      />
      <footer className={styles.chartControls}>
        <p>SELECT DATA TYPE</p>
        <div className={styles.controlGroup}>
          <p>SELECT</p>
          <div className={styles.divider} />
          <p>DATE</p>
        </div>
      </footer>
    </article>
  );
};
