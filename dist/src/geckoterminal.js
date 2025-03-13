/**
 * GeckoTerminal API Wrapper
 * A Node.js wrapper for the GeckoTerminal API
 *
 * @see https://www.geckoterminal.com/dex-api
 */
import axios from 'axios';
// Import package.json for version
import pkg from '../package.json' with { type: 'json' };
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Get the version from the package.json
const { version } = pkg;
/** Base URL for the GeckoTerminal API */
const GECKOTERMINAL_BASE_URL = 'https://api.geckoterminal.com/api';
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
export class GeckoTerminal {
    /**
     * Creates a new instance of the GeckoTerminal API client
     * @param options - Configuration options
     */
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || GECKOTERMINAL_BASE_URL;
        this.apiVersion = options.apiVersion || 'v2';
        this.headers = {
            'Accept': 'application/json',
            'User-Agent': `GeckoTerminal-Node/${version}`,
            ...options.headers,
        };
        // Create axios instance
        this.axios = axios.create({
            baseURL: `${this.baseUrl}/${this.apiVersion}`,
            headers: this.headers,
        });
        // Intercept and handle errors
        this.axios.interceptors.response.use((response) => response, (error) => this._handleRequestError(error));
    }
    /**
     * Makes a GET request to the API
     * @param endpoint - API endpoint
     * @param params - Query parameters
     * @returns API response
     * @private
     */
    async _get(endpoint, params = {}) {
        try {
            const response = await this.axios.get(endpoint, { params });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Handles request errors
     * @param error - The error object
     * @returns Error promise
     * @private
     */
    _handleRequestError(error) {
        const axiosError = error;
        if (axiosError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const { status, data } = axiosError.response;
            let message = `GeckoTerminal API Error: ${status}`;
            if (data && data.errors) {
                message += ` - ${data.errors.map((err) => err.detail || err.title).join(', ')}`;
            }
            const apiError = new Error(message);
            apiError.status = status;
            apiError.data = data;
            return Promise.reject(apiError);
        }
        else if (axiosError.request) {
            // The request was made but no response was received
            return Promise.reject(new Error('No response received from GeckoTerminal API'));
        }
        else {
            // Something happened in setting up the request
            return Promise.reject(error);
        }
    }
    /**
     * Builds query parameters for include fields
     * @param include - Fields to include
     * @returns Comma-separated include fields
     * @private
     */
    _buildIncludeParams(include) {
        if (!include || !Array.isArray(include) || include.length === 0) {
            return undefined;
        }
        return include.join(',');
    }
    // ============================
    // Networks Endpoints
    // ============================
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
    async getNetworks(options = {}) {
        const { page = 1, page_size = 100 } = options;
        const params = { page, page_size };
        return this._get('/networks', params);
    }
    // ============================
    // DEXes Endpoints
    // ============================
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
    async getDexes(network, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        const { page = 1, page_size = 100 } = options;
        const params = { page, page_size };
        return this._get(`/networks/${network}/dexes`, params);
    }
    // ============================
    // Pools Endpoints
    // ============================
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
    async getPool(network, poolAddress, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!poolAddress) {
            throw new Error('Pool address parameter is required');
        }
        const { include = [] } = options;
        const params = {
            include: this._buildIncludeParams(include)
        };
        return this._get(`/networks/${network}/pools/${poolAddress}`, params);
    }
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
    async getPools(network, poolAddresses, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!poolAddresses || !Array.isArray(poolAddresses) || poolAddresses.length === 0) {
            throw new Error('Pool addresses parameter is required and must be an array');
        }
        const { include = [] } = options;
        const params = {
            pool_addresses: poolAddresses.join(','),
            include: this._buildIncludeParams(include)
        };
        return this._get(`/networks/${network}/pools/multi`, params);
    }
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
    async getTopPools(network, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        const { dex, include = [], page = 1, page_size = 100 } = options;
        const params = {
            page,
            page_size,
            include: this._buildIncludeParams(include)
        };
        let endpoint = dex
            ? `/networks/${network}/dexes/${dex}/pools`
            : `/networks/${network}/pools`;
        return this._get(endpoint, params);
    }
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
    async getNewPools(options = {}) {
        const { network, include = [], page = 1, page_size = 100 } = options;
        const params = {
            page,
            page_size,
            include: this._buildIncludeParams(include)
        };
        let endpoint = network
            ? `/networks/${network}/new_pools`
            : '/pools/new';
        return this._get(endpoint, params);
    }
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
    async getPoolInfo(network, poolAddress) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!poolAddress) {
            throw new Error('Pool address parameter is required');
        }
        return this._get(`/networks/${network}/pools/${poolAddress}/info`);
    }
    // ============================
    // Tokens Endpoints
    // ============================
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
    async getToken(network, tokenAddress, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!tokenAddress) {
            throw new Error('Token address parameter is required');
        }
        const { include = [] } = options;
        const params = {
            include: this._buildIncludeParams(include)
        };
        return this._get(`/networks/${network}/tokens/${tokenAddress}`, params);
    }
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
    async getPrices(network, tokenAddresses) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!tokenAddresses || !Array.isArray(tokenAddresses) || tokenAddresses.length === 0) {
            throw new Error('Token addresses parameter is required and must be an array');
        }
        if (tokenAddresses.length > 30) {
            throw new Error('Maximum of 30 token addresses allowed');
        }
        const params = {
            token_addresses: tokenAddresses.join(',')
        };
        return this._get(`/networks/${network}/tokens/prices`, params);
    }
    // ============================
    // OHLCV Endpoints
    // ============================
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
    async getPoolOhlcv(network, poolAddress, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!poolAddress) {
            throw new Error('Pool address parameter is required');
        }
        const { timeframe = 'day', aggregate = 1, before_timestamp, limit = 100, currency = 'usd', token = 'base' } = options;
        // Validate timeframe
        const validTimeframes = ['minute', 'hour', 'day', 'week', 'month'];
        if (!validTimeframes.includes(timeframe)) {
            throw new Error(`Invalid timeframe: ${timeframe}. Must be one of: ${validTimeframes.join(', ')}`);
        }
        // Validate currency
        const validCurrencies = ['usd', 'token'];
        if (!validCurrencies.includes(currency)) {
            throw new Error(`Invalid currency: ${currency}. Must be one of: ${validCurrencies.join(', ')}`);
        }
        // Validate limit
        if (limit > 1000) {
            throw new Error('Maximum limit is 1000');
        }
        const params = {
            timeframe,
            aggregate,
            before_timestamp,
            limit,
            currency,
            token
        };
        return this._get(`/networks/${network}/pools/${poolAddress}/ohlcv`, params);
    }
    // ============================
    // Trades Endpoints
    // ============================
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
    async getTrades(network, poolAddress, options = {}) {
        if (!network) {
            throw new Error('Network parameter is required');
        }
        if (!poolAddress) {
            throw new Error('Pool address parameter is required');
        }
        const { trade_volume_in_usd_greater_than, cursor } = options;
        const params = {
            trade_volume_in_usd_greater_than,
            cursor
        };
        return this._get(`/networks/${network}/pools/${poolAddress}/trades`, params);
    }
    // ============================
    // Search Endpoints
    // ============================
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
    async searchPools(query, options = {}) {
        if (!query) {
            throw new Error('Search query parameter is required');
        }
        const { network, include = [], page = 1, page_size = 100 } = options;
        const params = {
            query,
            page,
            page_size,
            include: this._buildIncludeParams(include)
        };
        let endpoint = network
            ? `/networks/${network}/search/pools`
            : '/search/pools';
        return this._get(endpoint, params);
    }
}
//# sourceMappingURL=geckoterminal.js.map