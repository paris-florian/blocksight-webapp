import React, { useEffect, useRef } from 'react';
import { 
  DeepPartial, 
  HistogramSeries, 
  IChartApiBase, 
  IHorzScaleBehavior, 
  ISeriesApi, 
  ISeriesPrimitive,
  ISeriesPrimitiveAxisView, 
  SeriesAttachedParameter, 
  SeriesOptionsCommon, 
  Time, 
  WhitespaceData, 
  createChart,
  IPrimitivePaneView,
  PrimitivePaneViewZOrder,
  CandlestickSeries,
  CandlestickData
} from 'lightweight-charts';
import { StackedAreaData } from './data';
import { multipleBarData } from './sample-data';
import { StackedAreaSeries } from './stacked-area-series';
import { StackedAreaSeriesOptions } from './options';
import { TooltipPrimitive } from '../Tooltip/tooltip';
import { applyStyle } from '../Tooltip/tooltip-element';

type MultibarData = (StackedAreaData | WhitespaceData)[];

export enum SeriesType {
  Candlestick,
  StackedAreaSeries,
  Histogram
}

export interface ISeries {
  type: SeriesType;
}

export interface IPane {
  name: string;
  priceData?: MultibarData;
  series: ISeries[];
}

interface IMultichart {
  name: string;
  priceData?: MultibarData;
  series: ISeries[];
}

interface ChartProps {
  width?: number;
  height?: number;
  groups?: number;
  points?: number;
  shuffle?: number;
  panes: IPane[];
}

/* eslint-disable max-classes-per-file */
class AxisView implements ISeriesPrimitiveAxisView {
  _color: any;
  _text: string;
  _position: number;
  
  constructor(text: string, color: any, position: number) {
    this._color = color;
    this._text = text;
    this._position = position;
  }
  
  coordinate() {
    return this._position;
  }
  
  text() {
    return this._text;
  }
  
  textColor() {
    return '#FFFFFF';
  }
  
  backColor() {
    return this._color;
  }
}

class LegendPaneRenderer {
  _sections: unknown[];
  
  constructor(sections: { [s: string]: unknown; } | ArrayLike<unknown>) {
    this._sections = Object.values(sections);
  }
  
  draw(target: { useMediaCoordinateSpace: (arg0: (scope: any) => void) => void; }) {
    const count = this._sections.length;
    const longestText = this._sections.reduce((longest: any, section: any) => {
      if (section.name.length > longest.length) {
        return section.name;
      }
      return longest;
    }, '');
    
    target.useMediaCoordinateSpace((scope: { context: any; }) => {
      const ctx  = scope.context;
      ctx.font = "bold 10pt Courier";
      const longestTextMeasurements = ctx.measureText(longestText);
      ctx.beginPath();
      ctx.roundRect(
        20,
        20,
        longestTextMeasurements.width + 30,
        (count + 0) * 20 + 10,
        8
      );
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.globalAlpha = 1;
      let currentY = 30;
      this._sections.forEach((section: any) => {
        ctx.beginPath();
        // ctx.roundRect(30, currentY, 10, 10, 3);
        ctx.fillStyle = section.color;
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'bottom';

        ctx.fillText(section.name, 36, currentY + 12);

        
        currentY += 20;
      });
    });
  }
}

class LegendView implements IPrimitivePaneView {
  _renderer: LegendPaneRenderer;
  
  constructor(sections: any) {
    this._renderer = new LegendPaneRenderer(sections);
  }
  
  zOrder(): PrimitivePaneViewZOrder {
    return 'top' as PrimitivePaneViewZOrder;
  }
  
  renderer() {
    return this._renderer;
  }
}

class PaneRenderer {
  _color: any;
  
  constructor(color: any) {
    this._color = color;
  }
  
  draw(target: { useMediaCoordinateSpace: (arg0: (scope: any) => void) => void; }) {
    target.useMediaCoordinateSpace((scope: { context: any; mediaSize: { width: any; height: any; }; }) => {
      const ctx = scope.context;
      ctx.beginPath();
      ctx.rect(0, 0, scope.mediaSize.width, scope.mediaSize.height);
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = this._color;
      ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 8;
      ctx.strokeStyle = this._color;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }
}

class PaneView implements IPrimitivePaneView {
  private _renderer: PaneRenderer;
  
  constructor(color: any) {
    this._renderer = new PaneRenderer(color);
  }
  
  zOrder(): PrimitivePaneViewZOrder {
    return 'bottom' as PrimitivePaneViewZOrder;
  }
  
  renderer() {
    return this._renderer;
  }
}

class SectionsPrimitive implements ISeriesPrimitive<Time> {
  sections: { 
    pane: { color: string; name: string; }; 
    // price: { color: string; name: string; }; 
    // time: { as Time color: string; name: string; }; 
    // priceLabel: { color: string; name: string; }; 
    // timeLabel: { color: string; name: string; }; 
  };
  
  _paneViews: IPrimitivePaneView[];
  // _pricePaneViews: IPrimitivePaneView[];
  // _timePaneViews: IPrimitivePaneView[];
  // _priceAxisViews: ISeriesPrimitiveAxisView[];
  // _timeAxisViews: ISeriesPrimitiveAxisView[];
  
  constructor(name: string) {
    this.sections = {
      pane: { color: 'black', name: name },
      // price: { color: '#f72585', name: 'Price Pane (priceAxisPaneViews)' },
      // time: { as Time color: '#4361ee', name: 'Time Pane (timeAxisPaneViews)' },
      // priceLabel: { color: '#f77f00', name: 'Price Label (priceAxisViews)' },
      // timeLabel: { color: '#40916c', name: 'Time Label (timeAxisViews)' },
    };
    
    this._paneViews = [
      new PaneView(this.sections.pane.color),
      new LegendView(this.sections),
    ];
    
    // this._pricePaneViews = [new PaneView(this.sections.price.color)];
    // this._timePaneViews = [new PaneView(this.sections.time.color)];
    
    // this._priceAxisViews = [
    //   new AxisView('price label', this.sections.priceLabel.color, 80),
    // ];
    
    // this._timeAxisViews = [
    //   new AxisView('time label', this.sections.timeLabel.color, 200),
    // ];
  }

  updateAllViews() {}

  paneViews(): readonly IPrimitivePaneView[] {
    return this._paneViews;
  }

  // timeAxisPaneViews(): readonly IPrimitivePaneView[] {
  //   return this._timePaneViews;
  // }

  // priceAxisPaneViews(): readonly IPrimitivePaneView[] {
  //   return this._pricePaneViews;
  // }

  // timeAxisViews(): readonly ISeriesPrimitiveAxisView[] {
  //   return this._timeAxisViews;
  // }

  // priceAxisViews(): readonly ISeriesPrimitiveAxisView[] {
  //   return this._priceAxisViews;
  // }
}

const Chart = ({
  groups = 5,
  points = 200,
  shuffle = 2,
  panes
}: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clear any existing chart
    chartContainerRef.current.innerHTML = '';
    
    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#222' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      autoSize: true,
      rightPriceScale: {
        scaleMargins: {
          top: 0.05,
          bottom: 0.05,
        }
      }
    });
    
    for (var index = 0; index < panes.length; index++) {
      const pane = panes[index];

      console.error(pane.series)
      for (var i = 0; i < pane.series.length; i++) {
        var series = pane.series[i];
        console.error(series)
        switch (series.type) {
          case SeriesType.Histogram:
 

          const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            // priceScaleId: '', // set as an overlay by setting a blank priceScaleId
            // set the positioning of the volume series
            // scaleMargins: {
            //     top: 0.7, // highest point of the series will be 70% away from the top
            //     bottom: 0,
            // },
        }, index);
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.2, // highest point of the series will be 70% away from the top
                bottom: 0,
            },
        });
        
        // setting the data for the volume series.
        // note: we are defining each bars color as part of the data
        volumeSeries.setData([
            { time: '2018-10-19', value: 19103293.00, color: '#26a69a' },
            { time: '2018-10-22', value: 21737523.00, color: '#26a69a' },
            { time: '2018-10-23', value: 29328713.00, color: '#26a69a' },
            { time: '2018-10-24', value: 37435638.00, color: '#26a69a' },
            { time: '2018-10-25', value: 25269995.00, color: '#ef5350' },
            { time: '2018-10-26', value: 24973311.00, color: '#ef5350' },
            { time: '2018-10-29', value: 22103692.00, color: '#26a69a' },
            { time: '2018-10-30', value: 25231199.00, color: '#26a69a' },
            { time: '2018-10-31', value: 24214427.00, color: '#ef5350' },
            { time: '2018-11-01', value: 22533201.00, color: '#ef5350' },
            { time: '2018-11-02', value: 14734412.00, color: '#26a69a' },
            { time: '2018-11-05', value: 12733842.00, color: '#26a69a' },
            { time: '2018-11-06', value: 12371207.00, color: '#26a69a' },
            { time: '2018-11-07', value: 14891287.00, color: '#26a69a' },
            { time: '2018-11-08', value: 12482392.00, color: '#26a69a' },
            { time: '2018-11-09', value: 17365762.00, color: '#26a69a' },
            { time: '2018-11-12', value: 13236769.00, color: '#26a69a' },
            { time: '2018-11-13', value: 13047907.00, color: '#ef5350' },
            { time: '2018-11-14', value: 18288710.00, color: '#26a69a' },
            { time: '2018-11-15', value: 17147123.00, color: '#26a69a' },
            { time: '2018-11-16', value: 19470986.00, color: '#26a69a' },
            { time: '2018-11-19', value: 18405731.00, color: '#26a69a' },
            { time: '2018-11-20', value: 22028957.00, color: '#ef5350' },
            { time: '2018-11-21', value: 18482233.00, color: '#ef5350' },
            { time: '2018-11-23', value: 7009050.00, color: '#ef5350' },
            { time: '2018-11-26', value: 12308876.00, color: '#26a69a' },
            { time: '2018-11-27', value: 14118867.00, color: '#26a69a' },
            { time: '2018-11-28', value: 18662989.00, color: '#ef5350' },
            { time: '2018-11-29', value: 14763658.00, color: '#ef5350' },
            { time: '2018-11-30', value: 31142818.00, color: '#26a69a' },
            { time: '2018-12-03', value: 27795428.00, color: '#ef5350' },
            { time: '2018-12-04', value: 21727411.00, color: '#ef5350' },
            { time: '2018-12-06', value: 26880429.00, color: '#ef5350' },
            { time: '2018-12-07', value: 16948126.00, color: '#ef5350' },
            { time: '2018-12-10', value: 16603356.00, color: '#26a69a' },
            { time: '2018-12-11', value: 14991438.00, color: '#26a69a' },
            { time: '2018-12-12', value: 18892182.00, color: '#ef5350' },
            { time: '2018-12-13', value: 15454706.00, color: '#ef5350' },
            { time: '2018-12-14', value: 13960870.00, color: '#ef5350' },
            { time: '2018-12-17', value: 18902523.00, color: '#ef5350' },
            { time: '2018-12-18', value: 18895777.00, color: '#ef5350' },
            { time: '2018-12-19', value: 20968473.00, color: '#26a69a' },
            { time: '2018-12-20', value: 26897008.00, color: '#ef5350' },
            { time: '2018-12-21', value: 55413082.00, color: '#ef5350' },
            { time: '2018-12-24', value: 15077207.00, color: '#ef5350' },
            { time: '2018-12-26', value: 17970539.00, color: '#26a69a' },
            { time: '2018-12-27', value: 17530977.00, color: '#26a69a' },
            { time: '2018-12-28', value: 14771641.00, color: '#26a69a' },
            { time: '2018-12-31', value: 15331758.00, color: '#26a69a' },
            { time: '2019-01-02', value: 13969691.00, color: '#ef5350' },
            { time: '2019-01-03', value: 19245411.00, color: '#26a69a' },
            { time: '2019-01-04', value: 17035848.00, color: '#26a69a' },
            { time: '2019-01-07', value: 16348982.00, color: '#26a69a' },
            { time: '2019-01-08', value: 21425008.00, color: '#26a69a' },
            { time: '2019-01-09', value: 18136000.00, color: '#ef5350' },
            { time: '2019-01-10', value: 14259910.00, color: '#26a69a' },
            { time: '2019-01-11', value: 15801548.00, color: '#26a69a' },
            { time: '2019-01-14', value: 11342293.00, color: '#26a69a' },
            { time: '2019-01-15', value: 10074386.00, color: '#26a69a' },
            { time: '2019-01-16', value: 13411691.00, color: '#ef5350' },
            { time: '2019-01-17', value: 15223854.00, color: '#ef5350' },
            { time: '2019-01-18', value: 16802516.00, color: '#26a69a' },
            { time: '2019-01-22', value: 18284771.00, color: '#ef5350' },
            { time: '2019-01-23', value: 15109007.00, color: '#26a69a' },
            { time: '2019-01-24', value: 12494109.00, color: '#ef5350' },
            { time: '2019-01-25', value: 17806822.00, color: '#ef5350' },
            { time: '2019-01-28', value: 25955718.00, color: '#ef5350' },
            { time: '2019-01-29', value: 33789235.00, color: '#ef5350' },
            { time: '2019-01-30', value: 27260036.00, color: '#26a69a' },
            { time: '2019-01-31', value: 28585447.00, color: '#26a69a' },
            { time: '2019-02-01', value: 13778392.00, color: '#ef5350' },
            { time: '2019-02-04', value: 15818901.00, color: '#ef5350' },
            { time: '2019-02-05', value: 14124794.00, color: '#26a69a' },
            { time: '2019-02-06', value: 11391442.00, color: '#ef5350' },
            { time: '2019-02-07', value: 12436168.00, color: '#ef5350' },
            { time: '2019-02-08', value: 12011657.00, color: '#26a69a' },
            { time: '2019-02-11', value: 9802798.00, color: '#26a69a' },
            { time: '2019-02-12', value: 11227550.00, color: '#26a69a' },
            { time: '2019-02-13', value: 11884803.00, color: '#26a69a' },
            { time: '2019-02-14', value: 11190094.00, color: '#ef5350' },
            { time: '2019-02-15', value: 15719416.00, color: '#26a69a' },
            { time: '2019-02-19', value: 12272877.00, color: '#26a69a' },
            { time: '2019-02-20', value: 11379006.00, color: '#26a69a' },
            { time: '2019-02-21', value: 14680547.00, color: '#26a69a' },
            { time: '2019-02-22', value: 12534431.00, color: '#26a69a' },
            { time: '2019-02-25', value: 15051182.00, color: '#ef5350' },
            { time: '2019-02-26', value: 12005571.00, color: '#ef5350' },
            { time: '2019-02-27', value: 8962776.00, color: '#26a69a' },
            { time: '2019-02-28', value: 15742971.00, color: '#26a69a' },
            { time: '2019-03-01', value: 10942737.00, color: '#26a69a' },
            { time: '2019-03-04', value: 13674737.00, color: '#ef5350' },
            { time: '2019-03-05', value: 15749545.00, color: '#ef5350' },
            { time: '2019-03-06', value: 13935530.00, color: '#ef5350' },
            { time: '2019-03-07', value: 12644171.00, color: '#26a69a' },
            { time: '2019-03-08', value: 10646710.00, color: '#26a69a' },
            { time: '2019-03-11', value: 13627431.00, color: '#26a69a' },
            { time: '2019-03-12', value: 12812980.00, color: '#ef5350' },
            { time: '2019-03-13', value: 14168350.00, color: '#26a69a' },
            { time: '2019-03-14', value: 12148349.00, color: '#26a69a' },
            { time: '2019-03-15', value: 23715337.00, color: '#26a69a' },
            { time: '2019-03-18', value: 12168133.00, color: '#ef5350' },
            { time: '2019-03-19', value: 13462686.00, color: '#ef5350' },
            { time: '2019-03-20', value: 11903104.00, color: '#26a69a' },
            { time: '2019-03-21', value: 10920129.00, color: '#26a69a' },
            { time: '2019-03-22', value: 25125385.00, color: '#26a69a' },
            { time: '2019-03-25', value: 15463411.00, color: '#26a69a' },
            { time: '2019-03-26', value: 12316901.00, color: '#26a69a' },
            { time: '2019-03-27', value: 13290298.00, color: '#26a69a' },
            { time: '2019-03-28', value: 20547060.00, color: '#ef5350' },
            { time: '2019-03-29', value: 17283871.00, color: '#26a69a' },
            { time: '2019-04-01', value: 16331140.00, color: '#ef5350' },
            { time: '2019-04-02', value: 11408146.00, color: '#ef5350' },
            { time: '2019-04-03', value: 15491724.00, color: '#26a69a' },
            { time: '2019-04-04', value: 8776028.00, color: '#26a69a' },
            { time: '2019-04-05', value: 11497780.00, color: '#26a69a' },
            { time: '2019-04-08', value: 11680538.00, color: '#26a69a' },
            { time: '2019-04-09', value: 10414416.00, color: '#ef5350' },
            { time: '2019-04-10', value: 8782061.00, color: '#26a69a' },
            { time: '2019-04-11', value: 9219930.00, color: '#ef5350' },
            { time: '2019-04-12', value: 10847504.00, color: '#26a69a' },
            { time: '2019-04-15', value: 7741472.00, color: '#ef5350' },
            { time: '2019-04-16', value: 10239261.00, color: '#26a69a' },
            { time: '2019-04-17', value: 15498037.00, color: '#ef5350' },
            { time: '2019-04-18', value: 13189013.00, color: '#26a69a' },
            { time: '2019-04-22', value: 11950365.00, color: '#26a69a' },
            { time: '2019-04-23', value: 23488682.00, color: '#ef5350' },
            { time: '2019-04-24', value: 13227084.00, color: '#ef5350' },
            { time: '2019-04-25', value: 17425466.00, color: '#ef5350' },
            { time: '2019-04-26', value: 16329727.00, color: '#26a69a' },
            { time: '2019-04-29', value: 13984965.00, color: '#26a69a' },
            { time: '2019-04-30', value: 15469002.00, color: '#26a69a' },
            { time: '2019-05-01', value: 11627436.00, color: '#ef5350' },
            { time: '2019-05-02', value: 14435436.00, color: '#26a69a' },
            { time: '2019-05-03', value: 9388228.00, color: '#26a69a' },
            { time: '2019-05-06', value: 10066145.00, color: '#ef5350' },
            { time: '2019-05-07', value: 12963827.00, color: '#ef5350' },
            { time: '2019-05-08', value: 12086743.00, color: '#ef5350' },
            { time: '2019-05-09', value: 14835326.00, color: '#26a69a' },
            { time: '2019-05-10', value: 10707335.00, color: '#26a69a' },
            { time: '2019-05-13', value: 13759350.00, color: '#ef5350' },
            { time: '2019-05-14', value: 12776175.00, color: '#ef5350' },
            { time: '2019-05-15', value: 10806379.00, color: '#26a69a' },
            { time: '2019-05-16', value: 11695064.00, color: '#26a69a' },
            { time: '2019-05-17', value: 14436662.00, color: '#26a69a' },
            { time: '2019-05-20', value: 20910590.00, color: '#26a69a' },
            { time: '2019-05-21', value: 14016315.00, color: '#26a69a' },
            { time: '2019-05-22', value: 11487448.00, color: '#ef5350' },
            { time: '2019-05-23', value: 11707083.00, color: '#ef5350' },
            { time: '2019-05-24', value: 8755506.00, color: '#26a69a' },
            { time: '2019-05-28', value: 3097125.00, color: '#26a69a' },
        ]);
        volumeSeries.attachPrimitive(new SectionsPrimitive(pane.name));
        

          // .attachPrimitive(new SectionsPrimitive(pane.name));
          break;
          case SeriesType.Candlestick:
          {
            const candlestickSeries = chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });

            // const data: CandlestickData<Time>[] = [{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 as Time }, { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 as Time }, { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 as Time }, { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 as Time }, { open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: 1642773476 as Time }, { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 as Time }, { open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: 1642946276 as Time }, { open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: 1643032676 as Time }, { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 as Time }, { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 as Time }];
            
            candlestickSeries.setData([
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2018-10-19" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2018-10-22" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2018-10-23" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2018-10-24" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2018-10-25" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2018-10-26" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2018-10-29" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2018-10-30" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2018-10-31" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2018-11-01" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2018-11-02" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2018-11-05" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2018-11-06" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2018-11-07" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2018-11-08" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2018-11-09" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2018-11-12" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2018-11-13" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2018-11-14" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2018-11-15" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2018-11-16" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2018-11-19" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2018-11-20" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2018-11-21" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2018-11-23" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2018-11-26" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2018-11-27" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2018-11-28" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2018-11-29" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2018-11-30" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2018-12-03" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2018-12-04" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2018-12-06" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2018-12-07" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2018-12-10" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2018-12-11" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2018-12-12" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2018-12-13" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2018-12-14" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2018-12-17" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2018-12-18" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2018-12-19" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2018-12-20" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2018-12-21" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2018-12-24" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2018-12-26" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2018-12-27" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2018-12-28" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2018-12-31" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-01-02" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-01-03" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-01-04" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-01-07" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-01-08" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-01-09" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-01-10" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-01-11" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-01-14" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-01-15" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-01-16" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-01-17" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-01-18" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-01-22" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-01-23" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-01-24" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-01-25" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-01-28" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-01-29" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-01-30" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-01-31" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-02-01" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-02-04" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-02-05" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-02-06" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-02-07" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-02-08" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-02-11" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-02-12" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-02-13" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-02-14" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-02-15" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-02-19" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-02-20" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-02-21" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-02-22" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-02-25" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-02-26" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-02-27" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-02-28" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-03-01" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-03-04" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-03-05" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-03-06" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-03-07" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-03-08" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-03-11" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-03-12" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-03-13" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-03-14" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-03-15" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-03-18" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-03-19" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-03-20" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-03-21" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-03-22" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-03-25" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-03-26" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-03-27" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-03-28" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-03-29" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-04-01" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-04-02" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-04-03" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-04-04" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-04-05" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-04-08" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-04-09" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-04-10" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-04-11" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-04-12" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-04-15" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-04-16" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-04-17" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-04-18" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-04-22" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-04-23" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-04-24" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-04-25" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-04-26" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-04-29" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-04-30" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-05-01" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-05-02" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-05-03" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-05-06" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-05-07" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-05-08" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-05-09" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-05-10" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-05-13" },
              { "open": 10, "high": 10.63, "low": 9.49, "close": 9.55, "time": "2019-05-14" },
              { "open": 9.55, "high": 10.30, "low": 9.42, "close": 9.94, "time": "2019-05-15" },
              { "open": 9.94, "high": 10.17, "low": 9.92, "close": 9.78, "time": "2019-05-16" },
              { "open": 9.78, "high": 10.59, "low": 9.18, "close": 9.51, "time": "2019-05-17" },
              { "open": 9.51, "high": 10.46, "low": 9.10, "close": 10.17, "time": "2019-05-20" },
              { "open": 10.17, "high": 10.96, "low": 10.16, "close": 10.47, "time": "2019-05-21" },
              { "open": 10.47, "high": 11.39, "low": 10.40, "close": 10.81, "time": "2019-05-22" },
              { "open": 10.81, "high": 11.60, "low": 10.30, "close": 10.75, "time": "2019-05-23" },
              { "open": 10.75, "high": 11.60, "low": 10.49, "close": 10.93, "time": "2019-05-24" },
              { "open": 10.93, "high": 11.53, "low": 10.76, "close": 10.96, "time": "2019-05-28" }
            ]);
            candlestickSeries.attachPrimitive(new SectionsPrimitive(pane.name));
            break;
          }
          case SeriesType.StackedAreaSeries:
            const customSeriesView = new StackedAreaSeries();
      
            const myCustomSeries = chart.addCustomSeries(customSeriesView, {
              color: 'black',
            }, index);
            
            // Set data
            const data: MultibarData = multipleBarData(groups, points, shuffle);
            myCustomSeries.setData(data);
            myCustomSeries.attachPrimitive(new SectionsPrimitive(pane.name));
          }
        }
      }
//             const toolTipWidth = 80;
// const toolTipHeight = 80;
// const toolTipMargin = 15;

// // Create and style the tooltip html element
// const toolTip = document.createElement('div');

// applyStyle(toolTip, { width: '96px', height: '80px', position: 'absolute', display: 'none', padding: '8px', 'box-sizing': 'border-box', 'font-size': '12px', 'text-align': 'left', 'z-index': '1000', top: '12px', left: '12px', 'pointer-events': 'none', border: '1px solid', 'border-radius': '2px'})
// // toolTip.style = `width: 96px, he// toolTip.style = `width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
// toolTip.style.background = 'white';
// toolTip.style.color = 'black';
// toolTip.style.borderColor = 'rgba( 38, 166, 154, 1)';
// chartContainerRef.current.appendChild(toolTip);

// update tooltip
// chart.subscribeCrosshairMove(param => {
//     if (
//         param.point === undefined ||
//         !param.time ||
//         param.point.x < 0 ||
//         param.point.x > chartContainerRef.current!.clientWidth ||
//         param.point.y < 0 ||
//         param.point.y > chartContainerRef.current!.clientHeight
//     ) {
//         toolTip.style.display = 'none';
//     } else {
//         // time will be in the same format that we supplied to setData.
//         // thus it will be YYYY-MM-DD
//         const dateStr = param.time;
//         toolTip.style.display = 'block';
//         const data = param.seriesData.get(myCustomSeries);
//         const values: number[] = (data as any)["values"];
//         // const price = data.value !== undefined ? data.value : data.close;
//         console.error(values)
//         toolTip.innerHTML = `<div style="color: ${'rgba( 38, 166, 154, 1)'}">ABC Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
//             ${values.reverse().map((v: any) => v.toString()).join(" ")}
//             </div><div style="color: ${'black'}">
//             ${dateStr}
//             </div>`;

//         const y = param.point.y;
//         let left = param.point.x + toolTipMargin;
//         if (left > chartContainerRef.current!.clientWidth - toolTipWidth) {
//             left = param.point.x - toolTipMargin - toolTipWidth;
//         }

//         let top = y + toolTipMargin;
//         if (top > chartContainerRef.current!.clientHeight - toolTipHeight) {
//             top = y - toolTipHeight - toolTipMargin;
//         }
//         toolTip.style.left = left + 'px';
//         toolTip.style.top = top + 'px';
//     }
// });
//             break;
//         }
      // }

      


      // if (index === 0) {
      //   const tooltipPrimitive = new TooltipPrimitive({
      //     lineColor: 'rgba(0, 0, 0, 0.2)',
      //     tooltip: {
      //       followMode: 'tracking',
      //       values: [{color: "black"}]
      //     },
      //   });
        
      //   myCustomSeries.attachPrimitive(tooltipPrimitive);
      // }
    // }

    
    
    // Fit content to view
    chart.timeScale().fitContent();
  
    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
      borderColor: '#71649C',
    });

    // Cleanup
    return () => {
      chart.remove();
    };
  }, [groups, points, shuffle, panes]);
  
  return (
    <div style={{height: 600, width: "100%", position: "relative"}} ref={chartContainerRef}>
      <div style={{position: "absolute", left: "12px", top: "12px", zIndex: 1, fontSize: "14px", lineHeight: "18px", fontWeight: 300}}>
        TRUMP/USDT
      </div>
    </div>
  );
};

export default Chart;