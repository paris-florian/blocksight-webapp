import { useState } from "react";
import { ChartSelector, IChart } from "./ChartSelector"
import styles from './SuperchartTab.module.css';
import Chart, { IPane, ISeries, SeriesType } from "../../../../Chart/Chart";
import Sidebar from "../../../../Sidebar/Sidebar";
export interface SuperchartPane extends IPane {
    defaultSelected: boolean;
    id: string;
}

export type SidebarElement = DatasetSidebarElement | FolderSidebarElement;

export interface BaseSidebarElement {
    name: string;
    id: string;
    isActive?: boolean;
}

export interface DatasetSidebarElement extends BaseSidebarElement {
    type: "DatasetSidebarElement";
    series: ISeries[]; 
    defaultSelected: boolean;
} 

export interface FolderSidebarElement extends BaseSidebarElement {
    type: "FolderSidebarElement";
    elements: DatasetSidebarElement[];
}


export const SuperchartTab = () => {
    const [selectedCharts, setSelectedCharts] = useState<DatasetSidebarElement[]>([])
    const elements: SidebarElement[] = [
        {
            type: "DatasetSidebarElement",
            name: "Price", 
            id: "price",
            series: [{type: SeriesType.Candlestick}],
            defaultSelected: true,
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
                },
            ],
        },
    ];
    // const charts: SuperchartPane[] = [
    //     {id: "price", name: "Price", defaultSelected: true, series: [{type: SeriesType.Candlestick}]},
    //     {id: "2", name: "Retail Buying Volume", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    //     {id: "3", name: "Whale Buying Volume", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    //     {id: "4", name: "HVT Buying Volume", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    //     {id: "5", name: "Retail Selling Volume", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    //     {id: "6", name: "Whale Selling Volume", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    //     {id: "7", name: "HVT Selling Volume", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    //     {id: "8", name: "Retail Total Volume", defaultSelected: true, series: [{type: SeriesType.Histogram}]},
    //     {id: "9", name: "Whale Total Volume", defaultSelected: true, series: [{type: SeriesType.Histogram}]},
    //     {id: "10", name: "HVT Total Volume", defaultSelected: true, series: [{type: SeriesType.Histogram}]},
    //     {id: "10", name: "Holdings", defaultSelected: true, series: [{type: SeriesType.StackedAreaSeries}]},
    //     {id: "11", name: "Whale Clusters", defaultSelected: false, series: [{type: SeriesType.Histogram}]},
    // ];
    return <div className={styles.container}>
        <Sidebar setSelected={s => setSelectedCharts(elements.flatMap(e => e.type === 'DatasetSidebarElement' ? e : e.elements))} charts={charts} defaultSelected={elements.filter(c => c.type === '' c.defaultSelected === true)} />
        {/* <ChartSelector setSelected={s => setSelectedCharts(s)} charts={charts} defaultSelected={charts.filter(c => c.defaultSelected === true)} /> */}
        <Chart panes={selectedCharts} />
    </div>
}