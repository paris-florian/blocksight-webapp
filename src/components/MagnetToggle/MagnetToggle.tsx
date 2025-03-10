import React, { useEffect, useState } from 'react';
import styles from './MagnetToggle.module.css';
import { ReactComponent as MagnetIcon } from '../../assets/magnet.svg'

const MagnetToggle = (props: { default: boolean, setMagnetState: (toggledOn: boolean) => void }) => {
  const [magnetOn, setMagnetOn] = useState(props.default);

  const handleTimeframeSelect = () => {
    props.setMagnetState(magnetOn ? false : true);  
    setMagnetOn(magnetOn ? false : true);
  };

  return (
    // <div className={styles.container}>
        <React.Fragment key={"magnet"}>
        <div className={styles.divider}></div>
          <button
            className={`${styles.timeframeButton} ${magnetOn ? styles.selected : ''}`}
            onClick={() => handleTimeframeSelect()}
          >
            <MagnetIcon className={styles.icon} />
            {/* <img className={styles.icon} src={MagnetIcon} /> */}
          </button>
          {/* {index < props.availableTimeframes.length - 1 && ( */}
          <div className={styles.divider}></div>
          {/* )} */}
        </React.Fragment>
    // </div>
  );
};

export default MagnetToggle;