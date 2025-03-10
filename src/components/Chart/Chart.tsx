import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
  LineSeries,
  HistogramData,
  createTextWatermark,
  IChartApi,
  ChartOptions,
  CrosshairMode
} from 'lightweight-charts';
import { multipleBarData } from './sample-data';
import { StackedAreaSeries } from './stacked-area-series';
import { StackedAreaSeriesOptions } from './options';
import { TooltipPrimitive } from '../Tooltip/tooltip';
import { applyStyle } from '../Tooltip/tooltip-element';
import { CandlestickData, LineData, VolumeData } from '../../mock-data';
import { StackedAreaData } from './data';

type MultibarData = (StackedAreaData | WhitespaceData)[];

export enum SeriesType {
  Candlestick = 'Candlestick',
  Line = 'Line',
  Area = 'Area',
  Bar = 'Bar',
  Baseline = 'Baseline',
  Histogram = 'Histogram',
  StackedAreaSeries = 'StackedAreaSeries'
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
  priceData?: (WhitespaceData<Time> | HistogramData<Time>)[];
  series: ISeries[];
}

interface ChartProps {
  width?: number;
  height?: number;
  groups?: number;
  points?: number;
  shuffle?: number;
  panes: IPane[];
  // onChart: (chart: IChartApi) => void;
}

export interface ChartHandle {
  applyOptions: (options: DeepPartial<ChartOptions>) => void;
  chart: () => IChartApi | null;
}

/* eslint-disable max-classes-per-file */
// class AxisView implements ISeriesPrimitiveAxisView {
//   _color: any;
//   _text: string;
//   _position: number;
  
//   constructor(text: string, color: any, position: number) {
//     this._color = color;
//     this._text = text;
//     this._position = position;
//   }
  
//   coordinate() {
//     return this._position;
//   }
  
//   text() {
//     return this._text;
//   }
  
//   textColor() {
//     return '#FFFFFF';
//   }
  
//   backColor() {
//     return this._color;
//   }
// }

// class LegendPaneRenderer {
//   _sections: unknown[];
  
//   constructor(sections: { [s: string]: unknown; } | ArrayLike<unknown>) {
//     this._sections = Object.values(sections);
//   }
  
//   draw(target: { useMediaCoordinateSpace: (arg0: (scope: any) => void) => void; }) {
//     const count = this._sections.length;
//     const longestText = this._sections.reduce((longest: any, section: any) => {
//       if (section.name.length > longest.length) {
//         return section.name;
//       }
//       return longest;
//     }, '');
    
//     target.useMediaCoordinateSpace((scope: { context: any; }) => {
//       const ctx  = scope.context;
//       ctx.font = "bold 10pt Courier";
//       const longestTextMeasurements = ctx.measureText(longestText);
//       ctx.beginPath();
//       ctx.roundRect(
//         20,
//         20,
//         longestTextMeasurements.width + 30,
//         (count + 0) * 20 + 10,
//         8
//       );
//       ctx.globalAlpha = 0.95;
//       ctx.fillStyle = '#FFFFFF';
//       ctx.fill();
//       ctx.globalAlpha = 1;
//       let currentY = 30;
//       this._sections.forEach((section: any) => {
//         ctx.beginPath();
//         // ctx.roundRect(30, currentY, 10, 10, 3);
//         ctx.fillStyle = section.color;
//         ctx.fill();
//         ctx.fillStyle = '#000000';
//         ctx.textBaseline = 'bottom';

//         ctx.fillText(section.name, 36, currentY + 12);

        
//         currentY += 20;
//       });
//     });
//   }
// }

// class LegendView implements IPrimitivePaneView {
//   _renderer: LegendPaneRenderer;
  
//   constructor(sections: any) {
//     this._renderer = new LegendPaneRenderer(sections);
//   }
  
//   zOrder(): PrimitivePaneViewZOrder {
//     return 'top' as PrimitivePaneViewZOrder;
//   }
  
//   renderer() {
//     return this._renderer;
//   }
// }

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
      // new LegendView(this.sections),
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

const Chart = forwardRef<ChartHandle, ChartProps>(({
  groups = 5,
  points = 200,
  shuffle = 2,
  panes,
  // onChart
}: ChartProps, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  
  useImperativeHandle(ref, () => ({
    applyOptions: (options: DeepPartial<ChartOptions>) => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions(options);
      }
    },
    chart: () => chartInstanceRef.current
  }), []);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clear any existing chart
    chartContainerRef.current.innerHTML = '';
    
    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#181818' },
        textColor: '#DDD',
        attributionLogo: false
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      autoSize: true,
      rightPriceScale: {
        scaleMargins: {
          top: 0,
          bottom: 0,  
        }
      }
    });
    
    for (var index = 0; index < panes.length; index++) {
      const pane = panes[index];

      for (var i = 0; i < pane.series.length; i++) {
        var series = pane.series[i];
        switch (series.type) {
          case SeriesType.Histogram:
            const volumeSeries = chart.addSeries(HistogramSeries, {
              color: '#26a69a',
              priceFormat: {
                  type: 'volume',
              },
            }, index);

            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.15, 
                    bottom: 0,
                },
            });
            
            volumeSeries.setData(VolumeData);
            volumeSeries.attachPrimitive(new SectionsPrimitive(pane.name));
            break;
            
          case SeriesType.Candlestick:
          {
            const candlestickSeries = chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' }, index);
            candlestickSeries.setData(CandlestickData);
            candlestickSeries.attachPrimitive(new SectionsPrimitive(pane.name));
            candlestickSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.05, 
                    bottom: 0.05,
                },
            });
            break;
          }
          case SeriesType.Line:
            const lineSeries = chart.addSeries(LineSeries, { 
              color: "#26a69a", 
              lineWidth: 1,
              lastPriceAnimation: 0,
              pointMarkersVisible: false
            }, index);
            lineSeries.setData(LineData);
            lineSeries.attachPrimitive(new SectionsPrimitive(pane.name));
            lineSeries.priceScale().applyOptions({
              scaleMargins: {
                  top: 0.15, 
                  bottom: 0.15,
              },
            });
            lineSeries.applyOptions({pointMarkersVisible: false, crosshairMarkerVisible: false,})
            break;
            
          case SeriesType.StackedAreaSeries:
            const customSeriesView = new StackedAreaSeries();
            const myCustomSeries = chart.addCustomSeries(customSeriesView, {
              color: 'black',
            }, index);
            
            // Set data
            const data = multipleBarData(groups, points, shuffle);
            myCustomSeries.setData(data);
            myCustomSeries.attachPrimitive(new SectionsPrimitive(pane.name));
            myCustomSeries.priceScale().applyOptions({
              scaleMargins: {
                  top: 0.15, 
                  bottom: 0,
              },
            });
            break;
        }
      }
    }

    // Fit content to view
    chart.timeScale().fitContent();
  
    // Setting the border color for the horizontal axis
    chart.timeScale().applyOptions({
      borderColor: '#71649C',
    });

    // Use MutationObserver to detect when chart elements are added
    const observer = new MutationObserver((mutations) => {
      const rows = document.querySelectorAll(".tv-lightweight-charts tr");
      if (rows.length > 0) {
        // Disconnect the observer since we found our elements
        observer.disconnect();
        
        console.log("Found rows:", rows.length); // Debug log

        chart.panes().forEach((e, index) => {
          const legend = document.createElement('div');
          legend.style.cssText = `position: absolute; left: 12px; margin-top: 12px; z-index: 100; color: white; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
          e.getHTMLElement().appendChild(legend);
          
          const firstRow = document.createElement('div');
          firstRow.innerHTML = panes[index]?.name || 'Unknown';
          firstRow.style.color = 'white';
          legend.appendChild(firstRow);
        });
      }
    });
		chart.applyOptions({
			crosshair: {
				mode: CrosshairMode.Normal,
      }
    });

    // Start observing the chart container for changes
    if (chartContainerRef.current) {
      observer.observe(chartContainerRef.current, {
        childList: true,
        subtree: true
      });
    }

    // Cleanup
    return () => {
      chart.remove();
      observer.disconnect();
    };
  }, [groups, points, shuffle, panes]);
  
  return (
    <div style={{height: "100%", width: "100%", position: "relative", }} ref={chartContainerRef}>
      <div style={{position: "absolute", left: "12px", top: "12px", zIndex: 1, fontSize: "14px", lineHeight: "18px", fontWeight: 300}}>
        TRUMP/USDT
      </div>
    </div>
  );
});

export default Chart;