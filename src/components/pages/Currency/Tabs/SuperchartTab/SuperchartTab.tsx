import { useRef, useState } from "react";
import styles from './SuperchartTab.module.css';
import Sidebar from "../../../../Sidebar/Sidebar";
import { sidebarTokens } from "../../../../Sidebar/Sidebar";
import Chart, { ChartHandle, SeriesType } from "../../../../Chart/Chart";
import TimeframeSelector, { Timeframe } from "../../../../TimeframeSelector/TimeframeSelector";
import { DatasetSettings } from "./DatasetSettings";
import ChartTopSelector from "../../../../ChartTopSettings/ChartTopSelector";
import MagnetToggle from "../../../../MagnetToggle/MagnetToggle";
import { CrosshairMode, IChartApi } from "lightweight-charts";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Fullscreen } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { tokens } from "../../../../../data/data";

export type SidebarElement = FolderSidebarElement | DatasetSidebarElement;

export interface BaseSidebarElement {
    id: string;
    name: string;
}

export interface FolderSidebarElement extends BaseSidebarElement {
    type: "FolderSidebarElement";
    elements: DatasetSidebarElement[];
}

export enum SettingType {
    Integer,
    Decimal,
    Percentage,
    Boolean,
}

export interface ISettingValue {
    id: string;
    type: SettingType;
    value: string;
}

export interface ISetting {
    id: string;
    name: string;
    type: SettingType;
    defaultValue: string;
}

export interface DatasetSidebarElement extends BaseSidebarElement {
    type: "DatasetSidebarElement";
    series: {
        type: SeriesType;
    }[]; 
    defaultSelected: boolean;
    settings: ISetting[];
}

const elements: SidebarElement[] = [
    {
        type: "DatasetSidebarElement",
        name: "Price", 
        id: "price",
        series: [{type: SeriesType.Candlestick}],
        defaultSelected: true,
        settings: [],
    },
    {
        type: "FolderSidebarElement",
        id: "volume",
        name: "Volume",
        elements: [
            {
                type: "DatasetSidebarElement",
                name: "Retail Buying Volume", 
                id: "retail-buying-volume",
                series: [{type: SeriesType.Histogram}],
                defaultSelected: true,
                settings: [
                    {
                        id: "min-avg-trade-roi",
                        name: "Min. Avg. Trade ROI",
                        type: SettingType.Percentage,
                        defaultValue: "15"
                    },
                    {
                        id: "max-avg-trade-roi",
                        name: "Max. Avg. Trade ROI",
                        type: SettingType.Percentage,
                        defaultValue: ""
                    },
                    {
                        id: "min-avg-trade-roi",
                        name: "Min. Avg. Trade ROI",
                        type: SettingType.Percentage,
                        defaultValue: ""
                    },
                    {
                        id: "min-avg-trade-roi",
                        name: "Min. Avg. Trade ROI",
                        type: SettingType.Percentage,
                        defaultValue: ""
                    }
                ]
            },
            {
                type: "DatasetSidebarElement",
                name: "Whale Buying Volume", 
                id: "whale-buying-volume",
                series: [{type: SeriesType.Histogram}],
                defaultSelected: false,
                settings: [],
            },
            {
                type: "DatasetSidebarElement",
                name: "HVT Buying Volume", 
                id: "hvt-buying-volume",
                series: [{type: SeriesType.Histogram}],
                defaultSelected: false,
                settings: [],
            }
        ],
    },
    {
        type: "FolderSidebarElement",
        id: "holdings",
        name: "Holdings",
        elements: [
            {
                type: "DatasetSidebarElement",
                name: "Retail Holdings", 
                id: "retail-holdings",
                series: [{type: SeriesType.Line}],
                defaultSelected: true,
                settings: [],
            },
            {
                type: "DatasetSidebarElement",
                name: "Whale Holdings", 
                id: "whale-holdings",
                series: [{type: SeriesType.Line}],
                defaultSelected: true,
                settings: [],
            },
            {
                type: "DatasetSidebarElement",
                name: "HVT Holdings", 
                id: "hvt-holdings",
                series: [{type: SeriesType.Line}],
                defaultSelected: true,
                settings: [],
            }
        ],
    },
    {
        type: "FolderSidebarElement",
        id: "exchanges",
        name: "Exchanges",
        elements: [
            {
                type: "DatasetSidebarElement",
                name: "Exchange Listings", 
                id: "exchange-listings",
                series: [{type: SeriesType.StackedAreaSeries}],
                defaultSelected: true,
                settings: [],
            },
            // {
            //     type: "DatasetSidebarElement",
            //     name: "Whale Holdings", 
            //     id: "whale-holdings",
            //     series: [{type: SeriesType.StackedAreaSeries}],
            //     defaultSelected: true,
            // },
            // {
            //     type: "DatasetSidebarElement",
            //     name: "HVT Holdings", 
            //     id: "hvt-holdings",
            //     series: [{type: SeriesType.StackedAreaSeries}],
            //     defaultSelected: true,
            // }
        ],
    },
    {
        type: "FolderSidebarElement",
        id: "wallets",
        name: "Wallets",
        elements: [
            {
                type: "DatasetSidebarElement",
                name: "Wallets Listings", 
                id: "w-listings",
                series: [{type: SeriesType.StackedAreaSeries}],
                defaultSelected: true,
                settings: [],
            },
        ],
    },
];

export const SuperchartTab = (props: {fullscreen: boolean}) => {
    const [selected, setSelected] = useState<DatasetSidebarElement[]>(() => {
        const selected: DatasetSidebarElement[] = [];
        const bf = localStorage.getItem("selected-datasets");
        const bd: string[] = bf ? JSON.parse(bf) : null;
        elements.forEach(element => {
            const push = (element: DatasetSidebarElement) => {
                console.error(bd)
                return bd ? (bd.findIndex(b => b === element.id) > -1 ? true : false) : element.defaultSelected;
            }
            if (element.type === "DatasetSidebarElement") {
                if (push(element)) {
                    selected.push(element);
                }
            } else {
                element.elements.forEach(el => {
                    if (push(el)) {
                        selected.push(el);
                    }
                });
            }
        });
        return selected;
    });

    const defaultTimeframe = Timeframe["15m"];
    const [selectedTimeframe, setSelectedTimeframe] = useState(defaultTimeframe);
    const [settings, setSettings] = useState<DatasetSidebarElement | undefined>(undefined);
    const [magnetOn, setMagnetOn] = useState<boolean>(true);

    const handleSelectedChange = (newSelected: DatasetSidebarElement[]) => {
        localStorage.setItem("selected-datasets", JSON.stringify(newSelected.map(s => s.id)));
        setSelected(newSelected);
    };

    const close = (id: string, settings: ISettingValue[]) => {
        setSettings(undefined);
    };

    const { currencyId } = useParams();
    const chartRef = useRef<ChartHandle>(null);
    let navigate = useNavigate();

    // Find the current token from the URL parameter by ID, symbol, or contract address
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

    return (
        <div className={styles.container} style={props.fullscreen ? {} : {borderRadius: "12px", overflow: "hidden"}}>
            <Sidebar
                sidebarElements={elements}
                defaultSelected={selected}
                setSelected={handleSelectedChange}
                openSettings={element => setSettings(element)}
                fullscreen={props.fullscreen}
                initialToken={currentToken}
            />
            <div className={styles.chartContainer}>
                <div>
                    <ChartTopSelector>
                        <TimeframeSelector 
                            setSelectedTimeframe={s => setSelectedTimeframe(s)} 
                            defaultTimeframe={selectedTimeframe} 
                            availableTimeframes={[
                                Timeframe["15m"], 
                                Timeframe["1h"], 
                                Timeframe["4h"], 
                                Timeframe["1d"], 
                                Timeframe["1w"], 
                                Timeframe["1M"]
                            ]} 
                        />
                        {!props.fullscreen && (
                            <IconButton 
                                sx={{padding: 0, marginLeft: "0.35rem"}} 
                                onClick={e => { 
                                    e.stopPropagation(); 
                                    // Find the original token to get the ID
                                    const originalToken = tokens.find(t => t.symbol === currentToken.symbol);
                                    const identifier = originalToken?.id || currentToken.symbol.toLowerCase();
                                    navigate("/superchart/" + identifier);
                                }} 
                                className={styles.settingsButton} 
                                aria-label="edit"
                            >
                                <FullscreenIcon sx={{fill: "#D3D3D3"}} />
                            </IconButton>
                        )}
                    </ChartTopSelector>
                </div>
                <div className={styles.chartContent}>
                    <Chart
                        ref={chartRef}
                        panes={selected.map(element => ({
                            name: element.name,
                            series: element.series
                        }))}
                    />
                </div>
            </div>
            {settings && (
                <DatasetSettings 
                    dataset={settings}
                    onClose={() => setSettings(undefined)}
                />
            )}
        </div>
    );
};