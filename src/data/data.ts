import { IRecord } from "../components/Table/DataTable";

// Token data
export const tokenRecords: IRecord[] = [
  {
    id: "1", 
    data: [
      { fieldName: "name", id: "1", value: "Bitcoin" },
      { fieldName: "symbol", id: "2", value: "BTC" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
      { fieldName: "contract-address", id: "4", value: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 21 },
      { fieldName: "winrate-total", id: "6", value: 59 },
      { fieldName: "drawdown", id: "7", value: 11 },
      { fieldName: "tags", id: "8", value: ["institution", "insider"] },
      { fieldName: "market-cap", id: "9", value: 1200000000 },
    ]
  },
  {
    id: "2", 
    data: [
      { fieldName: "name", id: "1", value: "Ethereum" },
      { fieldName: "symbol", id: "2", value: "ETH" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
      { fieldName: "contract-address", id: "4", value: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 18 },
      { fieldName: "winrate-total", id: "6", value: 60 },
      { fieldName: "drawdown", id: "7", value: 15 },
      { fieldName: "tags", id: "8", value: ["institution", "coin_creator"] },
      { fieldName: "market-cap", id: "9", value: 800000000 },
    ]
  },
  {
    id: "3", 
    data: [
      { fieldName: "name", id: "1", value: "Trump" },
      { fieldName: "symbol", id: "2", value: "TRUMP" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/53746/standard/trump.png?1737171561" },
      { fieldName: "contract-address", id: "4", value: "0x9b5deA0C5412AD6D2461A5F3F98BF9F1A1fA9577" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 25 },
      { fieldName: "winrate-total", id: "6", value: 62 },
      { fieldName: "drawdown", id: "7", value: 9 },
      { fieldName: "tags", id: "8", value: ["influencer"] },
      { fieldName: "market-cap", id: "9", value: 500000000 },
    ]
  },
  {
    id: "4", 
    data: [
      { fieldName: "name", id: "1", value: "Solana" },
      { fieldName: "symbol", id: "2", value: "SOL" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
      { fieldName: "contract-address", id: "4", value: "0x7dFF46370e9eA5f0Bad3C4E29711aD50062EA7A4" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 30 },
      { fieldName: "winrate-total", id: "6", value: 58 },
      { fieldName: "drawdown", id: "7", value: 14 },
      { fieldName: "tags", id: "8", value: ["exchange", "insider"] },
      { fieldName: "market-cap", id: "9", value: 350000000 },
    ]
  },
  {
    id: "5", 
    data: [
      { fieldName: "name", id: "1", value: "Cardano" },
      { fieldName: "symbol", id: "2", value: "ADA" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
      { fieldName: "contract-address", id: "4", value: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 16 },
      { fieldName: "winrate-total", id: "6", value: 55 },
      { fieldName: "drawdown", id: "7", value: 12 },
      { fieldName: "tags", id: "8", value: ["coin_creator", "whale"] },
      { fieldName: "market-cap", id: "9", value: 280000000 },
    ]
  },
  {
    id: "6", 
    data: [
      { fieldName: "name", id: "1", value: "Polkadot" },
      { fieldName: "symbol", id: "2", value: "DOT" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
      { fieldName: "contract-address", id: "4", value: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 19 },
      { fieldName: "winrate-total", id: "6", value: 57 },
      { fieldName: "drawdown", id: "7", value: 13 },
      { fieldName: "tags", id: "8", value: ["institution", "insider"] },
      { fieldName: "market-cap", id: "9", value: 220000000 },
    ]
  },
  {
    id: "7", 
    data: [
      { fieldName: "name", id: "1", value: "Chainlink" },
      { fieldName: "symbol", id: "2", value: "LINK" },
      { fieldName: "image", id: "3", value: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
      { fieldName: "contract-address", id: "4", value: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
      { fieldName: "average-trade-return-percentage", id: "5", value: 22 },
      { fieldName: "winrate-total", id: "6", value: 61 },
      { fieldName: "drawdown", id: "7", value: 10 },
      { fieldName: "tags", id: "8", value: ["exchange", "influencer"] },
      { fieldName: "market-cap", id: "9", value: 190000000 },
    ]
  },
];

// Trader data
export const traderRecords: IRecord[] = [
  {
    id: "1", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Alpha" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 59 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["institution", "insider"] },
    ]
  },
  {
    id: "2", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Beta" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 60 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["institution", "insider"] },
    ]
  },
  {
    id: "3", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Gamma" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 60 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["institution", "insider"] },
    ]
  },
  {
    id: "4", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Delta" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 60 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["influencer", "whale"] },
    ]
  },
  {
    id: "5", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Epsilon" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 60 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["influencer", "coin_creator"] },
    ]
  },
  {
    id: "6", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Zeta" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 60 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["exchange", "insider"] },
    ]
  },
  {
    id: "7", 
    data: [
      { fieldName: "name", id: "1", value: "Trader Eta" },
      { fieldName: "image", id: "2", value: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
      { fieldName: "average-trade-return-percentage", id: "3", value: 21 },
      { fieldName: "winrate-total", id: "4", value: 60 },
      { fieldName: "drawdown", id: "5", value: 11 },
      { fieldName: "tags", id: "6", value: ["institution", "coin_creator"] },
    ]
  },
];

// Helper function to get a field value from a record
export const getFieldValue = (record: IRecord, fieldName: string): any => {
  const field = record.data.find(d => d.fieldName === fieldName);
  return field ? field.value : undefined;
};

// Helper function to convert IRecord to Token interface for search
export interface Token {
  id: string;
  name: string;
  symbol: string;
  contractAddress?: string;
  image: string;
}

export const recordToToken = (record: IRecord): Token => {
  const symbol = getFieldValue(record, "symbol") as string;
  const contractAddress = getFieldValue(record, "contract-address") as string;
  
  // Use contract address as ID if available, otherwise use symbol
  const id = contractAddress || symbol.toLowerCase();
  
  return {
    id: id,
    name: getFieldValue(record, "name") as string,
    symbol: symbol,
    contractAddress: contractAddress,
    image: getFieldValue(record, "image") as string,
  };
};

// Convert all token records to Token interface for search
export const tokens: Token[] = tokenRecords.map(recordToToken);

// Helper function to convert IRecord to Trader interface for search
export interface Trader {
  id: string;
  name: string;
  image: string;
}

export const recordToTrader = (record: IRecord): Trader => {
  return {
    id: record.id,
    name: getFieldValue(record, "name") as string,
    image: getFieldValue(record, "image") as string,
  };
};

// Convert all trader records to Trader interface for search
export const traders: Trader[] = traderRecords.map(recordToTrader); 