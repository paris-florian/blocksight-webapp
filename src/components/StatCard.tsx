"use client";
import React from "react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  header: string;
  value: string | string[];
  label?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ header, value, label }) => {
  return (
    <article className={styles.statCard}>
      <h3 className={styles.statHeader}>{header}</h3>
      {Array.isArray(value) ? (
        value.map((val, index) => (
          <p key={index} className={styles.statValue}>
            {val}
          </p>
        ))
      ) : (
        <p className={styles.statValue}>{value}</p>
      )}
      {label && <p className={styles.statLabel}>{label}</p>}
    </article>
  );
};
