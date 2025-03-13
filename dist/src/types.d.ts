/**
 * Type definitions for GeckoTerminal API responses
 */
/**
 * Network information returned by the API
 */
export interface Network {
    id: string;
    type: string;
    attributes: {
        name: string;
        chain_id: string;
    };
}
/**
 * DEX information returned by the API
 */
export interface Dex {
    id: string;
    type: string;
    attributes: {
        name: string;
        url?: string;
    };
}
/**
 * Token information returned by the API
 */
export interface Token {
    id: string;
    type: string;
    attributes: {
        address: string;
        name: string;
        symbol: string;
        image_url?: string;
        info?: Record<string, any>;
    };
}
/**
 * Pool information returned by the API
 */
export interface Pool {
    id: string;
    type: string;
    attributes: {
        address: string;
        name: string;
        pool_type?: string;
        dex_id?: string;
        base_token?: Token;
        quote_token?: Token;
        price?: Record<string, any>;
        volume?: Record<string, any>;
        liquidity?: Record<string, any>;
        fdv?: Record<string, any>;
        market_cap?: Record<string, any>;
    };
    relationships?: Record<string, any>;
}
/**
 * OHLCV data returned by the API
 */
export interface OhlcvData {
    timestamp: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}
/**
 * Trade information returned by the API
 */
export interface Trade {
    id: string;
    type: string;
    attributes: {
        transaction_hash: string;
        block_number: string;
        timestamp: string;
        amount0: string;
        amount1: string;
        trade_type: string;
        price_usd: string;
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
