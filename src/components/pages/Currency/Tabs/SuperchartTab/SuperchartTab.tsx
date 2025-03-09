import { useState } from "react";
import styles from './SuperchartTab.module.css';
import Sidebar from "../../../../Sidebar/Sidebar";
import Chart, { SeriesType } from "../../../../Chart/Chart";
import TimeframeSelector, { Timeframe } from "../../../../TimeframeSelector/TimeframeSelector";
import { DatasetSettings } from "./DatasetSettings";
import ChartTopSelector from "../../../../ChartTopSettings/ChartTopSelector";
import MagnetToggle from "../../../../MagnetToggle/MagnetToggle";
import { CrosshairMode, IChartApi } from "lightweight-charts";

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
        elements.forEach(element => {
            if (element.type === "DatasetSidebarElement") {
                if (element.defaultSelected) {
                    selected.push(element);
                }
            } else {
                element.elements.forEach(el => {
                    if (el.defaultSelected) {
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
    // const [magnetOn, setMagnetOn] = useState<boolean>(true);

    const handleSelectedChange = (newSelected: DatasetSidebarElement[]) => {
        setSelected(newSelected);
    };

    const close = (id: string, settings: ISettingValue[]) => {
        setSettings(undefined);
    };

    const [chart, setChart] = useState<IChartApi | undefined>(undefined);

    return (
        <div className={styles.container}>
            <Sidebar
                sidebarElements={elements}
                defaultSelected={selected}
                setSelected={handleSelectedChange}
                openSettings={element => setSettings(element)}
                fullscreen={props.fullscreen}
            />
            <div className={styles.chartContainer}>
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
                    <MagnetToggle setMagnetState={t => { console.error(t); console.error(chart); chart?.applyOptions({crosshair: { mode: t ? CrosshairMode.Magnet : CrosshairMode.Normal}}) }} default={true} />
                </ChartTopSelector>
                <Chart
                    onChart={c => setChart(c)}
                    panes={selected.map(element => ({
                        name: element.name,
                        series: element.series
                    }))}
                />
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