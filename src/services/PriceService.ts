import { Token } from '../components/Sidebar/Sidebar';

// Mock initial prices
const mockPrices: { [key: string]: number } = {
    'TRUMP': 13.244,
    'BTC': 52384,
    'ETH': 2843,
};

// Mock price volatility settings
const volatility: { [key: string]: number } = {
    'TRUMP': 0.02, // 2% volatility
    'BTC': 0.01,   // 1% volatility
    'ETH': 0.015,  // 1.5% volatility
};

class PriceService {
    private prices: { [key: string]: number };
    private listeners: Map<string, Set<(price: number) => void>>;
    private intervals: { [key: string]: NodeJS.Timeout };

    constructor() {
        this.prices = { ...mockPrices };
        this.listeners = new Map();
        this.intervals = {};
    }

    // Get current price for a token
    getPrice(symbol: string): number {
        return this.prices[symbol.toUpperCase()] || 0;
    }

    // Format price with appropriate decimals and currency symbol
    formatPrice(price: number): string {
        return price >= 100 
            ? `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}` 
            : `$${price.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
    }

    // Subscribe to price updates
    subscribeToPriceUpdates(symbol: string, callback: (price: number) => void): () => void {
        const upperSymbol = symbol.toUpperCase();
        
        // Initialize listeners set for this symbol if it doesn't exist
        if (!this.listeners.has(upperSymbol)) {
            this.listeners.set(upperSymbol, new Set());
        }

        // Add the callback to listeners
        this.listeners.get(upperSymbol)!.add(callback);

        // Start price updates if not already started
        if (!this.intervals[upperSymbol]) {
            this.startPriceUpdates(upperSymbol);
        }

        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(upperSymbol);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    this.stopPriceUpdates(upperSymbol);
                }
            }
        };
    }

    private startPriceUpdates(symbol: string) {
        // Update every 2 seconds
        this.intervals[symbol] = setInterval(() => {
            const currentPrice = this.prices[symbol];
            const vol = volatility[symbol] || 0.01;
            
            // Generate random price movement
            const change = (Math.random() - 0.5) * 2 * vol;
            const newPrice = currentPrice * (1 + change);
            
            this.prices[symbol] = newPrice;
            
            // Notify all listeners
            this.listeners.get(symbol)?.forEach(callback => callback(newPrice));
        }, 2000);
    }

    private stopPriceUpdates(symbol: string) {
        if (this.intervals[symbol]) {
            clearInterval(this.intervals[symbol]);
            delete this.intervals[symbol];
        }
    }
}

// Export singleton instance
export const priceService = new PriceService(); 