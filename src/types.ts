/**
 * Type definitions for GeckoTerminal API responses
 */

/**
 * Network information returned by the API
 */
export interface Network {
  id: string; // Network identifier
  type: string;
  attributes: {
    name: string; // Network name
    coingecko_asset_platform_id: string; // Platform ID used by CoinGecko
  };
}

/**
 * DEX information returned by the API
 */
export interface Dex {
  id: string; // DEX identifier
  type: string;
  attributes: {
    name: string; // DEX name
    url?: string; // DEX website URL
  };
}

/**
 * Token information returned by the API
 */
export interface Token {
  id: string; // Token identifier
  type: string;
  attributes: {
    address: string; // Token contract address
    name: string; // Token name
    symbol: string; // Token symbol
    image_url?: string; // Token image URL
    price_usd?: string; // Token price in USD
    price_24h_change_percentage?: string; // 24h price change percentage
    info?: Record<string, any>; // Additional token information
  };
}

/**
 * Pool information returned by the API
 */
export interface Pool {
  id: string; // Pool identifier
  type: string;
  attributes: {
    address: string; // Pool contract address
    name: string; // Pool name
    pool_type?: string; // Pool type
    dex_id?: string; // DEX identifier
    base_token?: Token; // Base token information
    quote_token?: Token; // Quote token information
    base_token_price_usd?: string; // Base token price in USD
    quote_token_price_usd?: string; // Quote token price in USD
    price?: Record<string, any>; // Price information
    volume?: Record<string, any>; // Volume information
    liquidity?: Record<string, any>; // Liquidity information
    fdv?: Record<string, any>; // Fully diluted valuation
    market_cap?: Record<string, any>; // Market capitalization
  };
  relationships?: Record<string, any>;
}

/**
 * OHLCV data returned by the API
 */
export interface OhlcvData {
  timestamp: number; // Timestamp in seconds
  open: string; // Opening price
  high: string; // Highest price
  low: string; // Lowest price
  close: string; // Closing price
  volume: string; // Trading volume
}

/**
 * Trade information returned by the API
 */
export interface Trade {
  id: string; // Trade identifier
  type: string;
  attributes: {
    tx_hash: string; // Transaction hash
    block_number: number; // Block number
    block_timestamp: string; // Timestamp
    from_token_amount: string; // Amount of from_token
    to_token_amount: string; // Amount of to_token
    kind: string; // Trade type (buy/sell)
    price_from_in_usd: string; // Price of from_token in USD
    price_to_in_usd: string; // Price of to_token in USD
    price_from_in_currency_token: string; // Price of from_token in the other token
    price_to_in_currency_token: string; // Price of to_token in the other token
    volume_in_usd: string; // Volume in USD
    from_token_address: string; // Address of from_token
    to_token_address: string; // Address of to_token
    tx_from_address: string; // Address that initiated the transaction
  };
}

/**
 * API Response format
 */
export interface ApiResponse<T> {
  data: T;
  included?: any[];
  meta?: Record<string, any>;
  links?: Record<string, any>;
}

/**
 * Constructor options for the GeckoTerminal class
 */
export interface GeckoTerminalOptions {
  baseUrl?: string;
  apiVersion?: string;
  headers?: Record<string, string>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * Include parameters
 */
export interface IncludeParams {
  include?: string[];
}

/**
 * Pool OHLCV parameters
 */
export interface OhlcvParams {
  timeframe?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  aggregate?: number;
  before_timestamp?: number;
  limit?: number;
  currency?: 'usd' | string;
  token?: 'base' | 'quote';
}

/**
 * Trades parameters
 */
export interface TradesParams {
  trade_volume_in_usd_greater_than?: number;
  cursor?: string;
} 