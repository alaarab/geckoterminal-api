/**
 * GeckoTerminal API Wrapper
 * A Node.js wrapper for the GeckoTerminal API
 *
 * @see https://www.geckoterminal.com/dex-api
 */
import { GeckoTerminalOptions, Network, Dex, Pool, Token, OhlcvData, Trade, ApiResponse, PaginationParams, IncludeParams, OhlcvParams, TradesParams } from './types.js';
/**
 * GeckoTerminal API wrapper
 * Provides methods to interact with the GeckoTerminal API for retrieving DeFi data
 *
 * @example
 * ```typescript
 * const geckoTerminal = new GeckoTerminal();
 *
 * // Get networks
 * const networks = await geckoTerminal.getNetworks();
 *
 * // Get a specific pool
 * const pool = await geckoTerminal.getPool('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640');
 * ```
 */
export declare class GeckoTerminal {
    private baseUrl;
    private apiVersion;
    private headers;
    private axios;
    /**
     * Creates a new instance of the GeckoTerminal API client
     * @param options - Configuration options
     */
    constructor(options?: GeckoTerminalOptions);
    /**
     * Makes a GET request to the API
     * @param endpoint - API endpoint
     * @param params - Query parameters
     * @returns API response
     * @private
     */
    private _get;
    /**
     * Handles request errors
     * @param error - The error object
     * @returns Error promise
     * @private
     */
    private _handleRequestError;
    /**
     * Builds query parameters for include fields
     * @param include - Fields to include
     * @returns Comma-separated include fields
     * @private
     */
    private _buildIncludeParams;
    /**
     * Get a list of all networks supported by GeckoTerminal
     * @param options - Request options
     * @returns Network data
     *
     * @example
     * ```typescript
     * const networks = await geckoTerminal.getNetworks();
     * console.log(networks.data[0].attributes.name); // "Ethereum"
     * ```
     */
    getNetworks(options?: PaginationParams): Promise<ApiResponse<Network[]>>;
    /**
     * Get a list of all DEXes on a specific network
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param options - Request options
     * @returns DEXes data
     *
     * @example
     * ```typescript
     * const dexes = await geckoTerminal.getDexes('eth');
     * console.log(dexes.data[0].attributes.name); // "Uniswap V3"
     * ```
     */
    getDexes(network: string, options?: PaginationParams): Promise<ApiResponse<Dex[]>>;
    /**
     * Get information about a specific pool
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param poolAddress - Pool address
     * @param options - Request options
     * @returns Pool data
     *
     * @example
     * ```typescript
     * const wethUsdc = await geckoTerminal.getPool('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', {
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     * console.log(wethUsdc.data.attributes.name); // "WETH/USDC"
     * ```
     */
    getPool(network: string, poolAddress: string, options?: IncludeParams): Promise<ApiResponse<Pool>>;
    /**
     * Get information about multiple pools
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param poolAddresses - Array of pool addresses
     * @param options - Request options
     * @returns Pools data
     *
     * @example
     * ```typescript
     * const pools = await geckoTerminal.getPools('solana', [
     *   'FpCMFDFGYotvufJ7HrFHsWEiiQCGbkLCtwHiDnh7o28Q',
     *   '3ne4mWqdYuNiYrYZC9TrA3FcfuFdErghH97vNPbjicr1'
     * ]);
     * ```
     */
    getPools(network: string, poolAddresses: string[], options?: IncludeParams): Promise<ApiResponse<Pool[]>>;
    /**
     * Get the top pools on a network or DEX
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param options - Request options
     * @returns Top pools data
     *
     * @example
     * ```typescript
     * // Get top pools on Polygon
     * const topPools = await geckoTerminal.getTopPools('polygon_pos', {
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     *
     * // Get top pools on a specific DEX
     * const uniswapPools = await geckoTerminal.getTopPools('eth', {
     *   dex: 'uniswap_v3',
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     * ```
     */
    getTopPools(network: string, options?: {
        dex?: string;
    } & IncludeParams & PaginationParams): Promise<ApiResponse<Pool[]>>;
    /**
     * Get new pools on a network or across all networks
     * @param options - Request options
     * @returns New pools data
     *
     * @example
     * ```typescript
     * // Get new pools across all networks
     * const newPools = await geckoTerminal.getNewPools({
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     *
     * // Get new pools on Ethereum
     * const newEthPools = await geckoTerminal.getNewPools({
     *   network: 'eth',
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     * ```
     */
    getNewPools(options?: {
        network?: string;
    } & IncludeParams & PaginationParams): Promise<ApiResponse<Pool[]>>;
    /**
     * Get additional info for a specific pool
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param poolAddress - Pool address
     * @returns Pool info data
     *
     * @example
     * ```typescript
     * const poolInfo = await geckoTerminal.getPoolInfo('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640');
     * ```
     */
    getPoolInfo(network: string, poolAddress: string): Promise<ApiResponse<any>>;
    /**
     * Get information about a specific token
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param tokenAddress - Token address
     * @param options - Request options
     * @returns Token data
     *
     * @example
     * ```typescript
     * const weth = await geckoTerminal.getToken('eth', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', {
     *   include: ['top_pools']
     * });
     * ```
     */
    getToken(network: string, tokenAddress: string, options?: IncludeParams): Promise<ApiResponse<Token>>;
    /**
     * Get prices for multiple tokens
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param tokenAddresses - Array of token addresses (max 30)
     * @returns Token prices data
     *
     * @example
     * ```typescript
     * const prices = await geckoTerminal.getPrices('eth', [
     *   '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
     *   '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
     *   '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  // WETH
     * ]);
     * ```
     */
    getPrices(network: string, tokenAddresses: string[]): Promise<ApiResponse<any[]>>;
    /**
     * Get OHLCV data for a specific pool
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param poolAddress - Pool address
     * @param options - Request options
     * @returns OHLCV data
     *
     * @example
     * ```typescript
     * const ohlcvData = await geckoTerminal.getPoolOhlcv('eth', '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed', {
     *   timeframe: 'day',
     *   aggregate: 1,
     *   limit: 100
     * });
     * ```
     */
    getPoolOhlcv(network: string, poolAddress: string, options?: OhlcvParams): Promise<{
        data: OhlcvData[];
    }>;
    /**
     * Get trades for a specific pool
     * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
     * @param poolAddress - Pool address
     * @param options - Request options
     * @returns Trades data
     *
     * @example
     * ```typescript
     * const trades = await geckoTerminal.getTrades('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', {
     *   trade_volume_in_usd_greater_than: 10000
     * });
     * ```
     */
    getTrades(network: string, poolAddress: string, options?: TradesParams): Promise<ApiResponse<Trade[]>>;
    /**
     * Search for pools by query
     * @param query - Search query (token name, symbol, or address)
     * @param options - Request options
     * @returns Search results
     *
     * @example
     * ```typescript
     * // Search for 'ETH' pools on all networks
     * const results = await geckoTerminal.searchPools('ETH', {
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     *
     * // Search for 'ETH' pools on Ethereum
     * const ethResults = await geckoTerminal.searchPools('ETH', {
     *   network: 'eth',
     *   include: ['base_token', 'quote_token', 'dex']
     * });
     * ```
     */
    searchPools(query: string, options?: {
        network?: string;
    } & IncludeParams & PaginationParams): Promise<ApiResponse<Pool[]>>;
}
