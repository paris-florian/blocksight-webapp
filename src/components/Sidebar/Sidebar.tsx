import React, { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';
import { DatasetSidebarElement, SidebarElement } from '../pages/Currency/Tabs/SuperchartTab/SuperchartTab';
import { Checkbox, IconButton, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TokenSearchPopup from '../TokenSearchPopup/TokenSearchPopup';
import { priceService } from '../../services/PriceService';
import { tokens } from '../../data/data';

export interface Token {
    symbol: string;
    name: string;
    iconUrl: string;
    price?: string;
}

// Convert the tokens from data.ts to the format expected by this component
export const sidebarTokens: Token[] = tokens.map(token => ({
    symbol: token.symbol,
    name: token.name,
    iconUrl: token.image
}));

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
    initialToken?: Token;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [searchQuery, setSearchQuery] = useState('');
    
    let navigate = useNavigate();
    
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
    const [searchOpen, setSearchOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token>(props.initialToken || sidebarTokens[0]);
    const [currentPrice, setCurrentPrice] = useState<string>(
        priceService.formatPrice(priceService.getPrice(selectedToken.symbol))
    );

    // Subscribe to price updates for the selected token
    useEffect(() => {
        const unsubscribe = priceService.subscribeToPriceUpdates(
            selectedToken.symbol,
            (price) => setCurrentPrice(priceService.formatPrice(price))
        );
        return () => unsubscribe();
    }, [selectedToken.symbol]);

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

    const filterElements = (elements: SidebarElement[]) => {
        return elements.map(element => {
            if (element.type === 'FolderSidebarElement') {
                const filteredElements = element.elements.filter(el =>
                    el.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                // Only return folder if it has matching elements
                return filteredElements.length > 0 ? {
                    ...element,
                    elements: filteredElements
                } : null;
            } else if (element.type === 'DatasetSidebarElement') {
                return element.name.toLowerCase().includes(searchQuery.toLowerCase()) ? element : null;
            }
            return null;
        }).filter(Boolean) as SidebarElement[];
    };

    const renderContent = (elements: SidebarElement[]) => {
        return elements.map((element) => {
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

    const { currencyId } = useParams()
    
    const handleTokenSelect = (token: Token) => {
        setSelectedToken(token);
        setCurrentPrice(priceService.formatPrice(priceService.getPrice(token.symbol)));
        
        // Find the original token to get the ID
        const originalToken = tokens.find(t => t.symbol === token.symbol);
        const identifier = originalToken?.id || token.symbol.toLowerCase();
        
        // Update URL based on current view
        if (props.fullscreen) {
            navigate(`/superchart/${identifier}`);
        } else {
            navigate(`/currencies/${identifier}#superchart`);
        }
    };

    return (
        <div className={styles.sidebar}>
            {props.fullscreen && (
                <>
                    <IconButton 
                        onClick={e => { 
                            e.stopPropagation(); 
                            navigate(`/currencies/${currencyId}#superchart`);
                        }} 
                        className={styles.backButton} 
                        aria-label="back to dashboard"
                    >
                        <ArrowBackIcon sx={{fill: "#D3D3D3"}} />
                    </IconButton>
                    <div className={styles.tokenHeader}>
                        <div>
                            <div className={styles.tokenIconContainer}>
                                <img
                                    src={selectedToken.iconUrl}
                                    alt={`${selectedToken.symbol} icon`}
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
                        </div>
                        <div className={styles.tokenInfo}>
                            <h2 className={styles.tokenName}>${selectedToken.symbol}</h2>
                            <p className={styles.tokenPrice}>{currentPrice}</p>
                        </div>
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
                </>
            )}
            {renderContent(filterElements(props.sidebarElements))}
        </div>
    );
};

export default Sidebar; 