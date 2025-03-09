import React, { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';
import { DatasetSidebarElement, SidebarElement } from '../pages/Currency/Tabs/SuperchartTab/SuperchartTab';
import { Checkbox, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';

interface MenuItem {
  type: 'toggle' | 'dropdown';
  icon: React.ReactNode;
  text: string;
  href?: string;
  isActive?: boolean;
  items?: string[];
}

interface SidebarProps {
    sidebarElements: SidebarElement[];
    defaultSelected: DatasetSidebarElement[];
    fullscreen: boolean;
    setSelected: (selected: DatasetSidebarElement[]) => void;
    openSettings: (element: DatasetSidebarElement) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    
    const allDatasetElements = new Map<string, DatasetSidebarElement>();
    props.sidebarElements.forEach(element => {
        if (element.type === 'DatasetSidebarElement') {
            allDatasetElements.set(element.id, element);
        } else {
            element.elements.forEach(el => allDatasetElements.set(el.id, el));
        }
    });

    const [selected, setSelectedState] = useState<Map<string, boolean>>(() => {
        const initial = new Map<string, boolean>();
        allDatasetElements.forEach((element, id) => {
            initial.set(id, props.defaultSelected.some(s => s.id === id));
        });
        return initial;
    });

    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    const handleCheckboxChange = (elementId: string, checked: boolean) => {
        setSelectedState(prev => {
            const newState = new Map(prev);
            newState.set(elementId, checked);
            return newState;
        });
    };

    const toggleFolder = (folderId: string) => {
        setOpenFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    const renderElement = (element: DatasetSidebarElement) => {
        return (
            <div 
                key={element.id} 
                className={styles.element}
                onClick={() => handleCheckboxChange(element.id, !selected.get(element.id))}
            >
              <div className={styles.checkboxContainer}>
                <Checkbox
                    sx={{pr: 0, pl: 0}}
                    checked={selected.get(element.id) || false}
                    onChange={(e) => e.stopPropagation()} // Prevent checkbox from handling click
                    className={styles.checkbox}
                    {...label}
                />
                <div className={styles.elementName}>{element.name}</div>
              </div>
              {(element.settings.length > 0 &&
              <IconButton onClick={e => { e.stopPropagation(); props.openSettings(element);}} className={styles.settingsButton} aria-label="edit">
                <SettingsIcon sx={{fill: "#D3D3D3"}}/>
              </IconButton>)}
            </div>
        );
    };

    const renderFolder = (folder: SidebarElement) => {
        if (folder.type !== 'FolderSidebarElement') return null;

        const isOpen = openFolders.has(folder.id);
        const folderElements = folder.elements.map(element => renderElement(element));

        return (
            <div key={folder.id} className={styles.folder}>
                <div 
                    className={styles.folderHeader}
                    onClick={() => toggleFolder(folder.id)}
                >
                    <KeyboardArrowRightIcon 
                       sx={{fill: "white"}} className={`${styles.folderIcon} ${isOpen ? styles.open : ''}`}
                    />
                    <div className={styles.elementName}>{folder.name}</div>
                </div>
                <div className={`${styles.folderContent} ${isOpen ? styles.open : ''}`}>
                    {folderElements}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        return props.sidebarElements.map((element) => {
            if (element.type === 'FolderSidebarElement') {
                return renderFolder(element);
            } else {
                return renderElement(element);
            }
        });
    };

    useEffect(() => {
        // Convert selected state to array of selected elements
        const selectedElements = Array.from(selected.entries())
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => allDatasetElements.get(id)!);

        props.setSelected(selectedElements);
    }, [selected]);

    return (
        <div className={styles.sidebar}>
            {props.fullscreen && (
                <div className={styles.tokenHeader}>
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/80c395bd9a848e3be7b94f639b10e2a192a869b763d5a61942632d889ffe7c11?placeholderIfAbsent=true"
                        alt="Token icon"
                        className={styles.tokenIcon}
                    />
                    <div className={styles.tokenInfo}>
                        <h2 className={styles.tokenName}>$TRUMP</h2>
                        <p className={styles.tokenPrice}>$13.244</p>
                    </div>
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default Sidebar; 