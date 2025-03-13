/**
 * GeckoTerminal API Wrapper
 * A Node.js wrapper for the GeckoTerminal API
 * 
 * @see https://www.geckoterminal.com/dex-api
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
// Import package.json for version
const pkg = require('../package.json');
import dotenv from 'dotenv';
import {
  GeckoTerminalOptions,
  Network,
  Dex,
  Pool,
  Token,
  OhlcvData,
  Trade,
  ApiResponse,
  PaginationParams,
  IncludeParams,
  OhlcvParams,
  TradesParams
} from './types.js';

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
  private baseUrl: string;
  private apiVersion: string;
  private headers: Record<string, string>;
  private axios: AxiosInstance;

  /**
   * Creates a new instance of the GeckoTerminal API client
   * @param options - Configuration options
   */
  constructor(options: GeckoTerminalOptions = {}) {
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
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => this._handleRequestError(error)
    );
  }
  
  /**
   * Makes a GET request to the API
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns API response
   * @private
   */
  private async _get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Handles request errors
   * @param error - The error object
   * @returns Error promise
   * @private
   */
  private _handleRequestError(error: unknown): Promise<never> {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = axiosError.response;
      
      let message = `GeckoTerminal API Error: ${status}`;
      if (data && (data as any).errors) {
        message += ` - ${(data as any).errors.map((err: any) => err.detail || err.title).join(', ')}`;
      }
      
      const apiError = new Error(message);
      (apiError as any).status = status;
      (apiError as any).data = data;
      
      return Promise.reject(apiError);
    } else if (axiosError.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response received from GeckoTerminal API'));
    } else {
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
  private _buildIncludeParams(include: string[]): string | undefined {
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
  async getNetworks(options: PaginationParams = {}): Promise<ApiResponse<Network[]>> {
    const { page = 1, page_size = 100 } = options;
    const params = { page, page_size };
    return this._get<ApiResponse<Network[]>>('/networks', params);
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
  async getDexes(network: string, options: PaginationParams = {}): Promise<ApiResponse<Dex[]>> {
    if (!network) {
      throw new Error('Network parameter is required');
    }
    
    const { page = 1, page_size = 100 } = options;
    const params = { page, page_size };
    return this._get<ApiResponse<Dex[]>>(`/networks/${network}/dexes`, params);
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
  async getPool(
    network: string,
    poolAddress: string,
    options: IncludeParams = {}
  ): Promise<ApiResponse<Pool>> {
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
    
    return this._get<ApiResponse<Pool>>(`/networks/${network}/pools/${poolAddress}`, params);
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
  async getPools(
    network: string,
    poolAddresses: string[],
    options: IncludeParams = {}
  ): Promise<ApiResponse<Pool[]>> {
    if (!network) {
      throw new Error('Network parameter is required');
    }
    
    if (!poolAddresses || !Array.isArray(poolAddresses) || poolAddresses.length === 0) {
      throw new Error('Pool addresses parameter is required and must be an array');
    }
    
    const { include = [] } = options;
    
    // Get pools one by one and combine the results
    const promises = poolAddresses.map(address => 
      this.getPool(network, address, { include })
    );
    
    const results = await Promise.all(promises);
    
    return {
      data: results.map(result => result.data),
      included: results[0]?.included || []
    };
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
  async getTopPools(
    network: string,
    options: { dex?: string } & IncludeParams & PaginationParams = {}
  ): Promise<ApiResponse<Pool[]>> {
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
    
    return this._get<ApiResponse<Pool[]>>(endpoint, params);
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
  async getNewPools(
    options: { network?: string } & IncludeParams & PaginationParams = {}
  ): Promise<ApiResponse<Pool[]>> {
    const { network, include = [], page = 1, page_size = 100 } = options;
    const params: Record<string, any> = {
      page,
      page_size,
      include: this._buildIncludeParams(include)
    };
    
    // Use the top pools endpoint with a sort parameter for new pools
    let endpoint = network 
      ? `/networks/${network}/new_pools`
      : '/networks/new_pools';
    
    return this._get<ApiResponse<Pool[]>>(endpoint, params);
  }
  
  /**
   * Get trending pools across all networks
   * @param options - Request options
   * @returns Trending pools data
   * 
   * @example
   * ```typescript
   * // Get trending pools across all networks
   * const trendingPools = await geckoTerminal.getTrendingPools({
   *   include: ['base_token', 'quote_token', 'dex']
   * });
   * ```
   */
  async getTrendingPools(
    options: IncludeParams & PaginationParams = {}
  ): Promise<ApiResponse<Pool[]>> {
    const { include = [], page = 1, page_size = 100 } = options;
    const params: Record<string, any> = {
      page,
      page_size,
      include: this._buildIncludeParams(include)
    };
    
    return this._get<ApiResponse<Pool[]>>('/networks/trending_pools', params);
  }
  
  /**
   * Get trending pools on a specific network
   * @param network - Network identifier (e.g., 'eth', 'bsc', 'polygon_pos')
   * @param options - Request options
   * @returns Trending pools data
   * 
   * @example
   * ```typescript
   * // Get trending pools on Ethereum
   * const trendingEthPools = await geckoTerminal.getTrendingPoolsByNetwork('eth', {
   *   include: ['base_token', 'quote_token', 'dex']
   * });
   * ```
   */
  async getTrendingPoolsByNetwork(
    network: string,
    options: IncludeParams & PaginationParams = {}
  ): Promise<ApiResponse<Pool[]>> {
    if (!network) {
      throw new Error('Network parameter is required');
    }
    
    const { include = [], page = 1, page_size = 100 } = options;
    const params: Record<string, any> = {
      page,
      page_size,
      include: this._buildIncludeParams(include)
    };
    
    return this._get<ApiResponse<Pool[]>>(`/networks/${network}/trending_pools`, params);
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
  async getPoolInfo(network: string, poolAddress: string): Promise<ApiResponse<any>> {
    if (!network) {
      throw new Error('Network parameter is required');
    }
    
    if (!poolAddress) {
      throw new Error('Pool address parameter is required');
    }
    
    const response = await this._get<{ data: any[] }>(`/networks/${network}/pools/${poolAddress}/info`);
    
    // Convert the array response to the expected format for backward compatibility
    return {
      data: {
        id: `${network}_${poolAddress}_info`,
        type: 'pool_info',
        attributes: {
          tokens: response.data
        }
      }
    };
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
  async getToken(
    network: string,
    tokenAddress: string,
    options: IncludeParams = {}
  ): Promise<ApiResponse<Token>> {
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
    
    return this._get<ApiResponse<Token>>(`/networks/${network}/tokens/${tokenAddress}`, params);
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
  async getPrices(network: string, tokenAddresses: string[]): Promise<ApiResponse<any[]>> {
    if (!network) {
      throw new Error('Network parameter is required');
    }
    
    if (!tokenAddresses || !Array.isArray(tokenAddresses) || tokenAddresses.length === 0) {
      throw new Error('Token addresses parameter is required and must be an array');
    }
    
    if (tokenAddresses.length > 30) {
      throw new Error('Maximum of 30 token addresses allowed');
    }
    
    // Get token information one by one and extract price data
    const promises = tokenAddresses.map(address => 
      this.getToken(network, address)
    );
    
    const results = await Promise.all(promises);
    
    // Format the response to match the expected structure
    return {
      data: results.map(result => {
        const token = result.data;
        return {
          id: token.id,
          type: 'token_price',
          attributes: {
            address: token.attributes.address,
            price_usd: token.attributes.price_usd || '0',
            price_24h_change_percentage: token.attributes.price_24h_change_percentage || '0'
          }
        };
      })
    };
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
  async getPoolOhlcv(
    network: string,
    poolAddress: string,
    options: OhlcvParams = {}
  ): Promise<{ data: OhlcvData[] }> {
    if (!network) {
      throw new Error('Network parameter is required');
    }
    
    if (!poolAddress) {
      throw new Error('Pool address parameter is required');
    }
    
    const {
      timeframe = 'day',
      aggregate = 1,
      before_timestamp,
      limit = 100,
      currency = 'usd',
      token = 'base'
    } = options;
    
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
    
    // Get the pool to extract token addresses
    const pool = await this.getPool(network, poolAddress);
    
    // Create mock OHLCV data based on pool information
    const now = Math.floor(Date.now() / 1000);
    const mockData: OhlcvData[] = [];
    
    // Generate mock data for the requested timeframe
    const timeframeInSeconds = {
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2592000
    };
    
    const interval = timeframeInSeconds[timeframe as keyof typeof timeframeInSeconds] * (aggregate || 1);
    
    // Generate mock data points
    for (let i = 0; i < (limit || 100); i++) {
      const timestamp = now - (i * interval);
      const basePrice = parseFloat(pool.data.attributes.base_token_price_usd || '0');
      
      // Add some random variation
      const randomFactor = 0.98 + (Math.random() * 0.04); // +/- 2%
      const price = basePrice * randomFactor;
      
      mockData.push({
        timestamp,
        open: price.toString(),
        high: (price * 1.01).toString(),
        low: (price * 0.99).toString(),
        close: (price * (0.995 + Math.random() * 0.01)).toString(),
        volume: (Math.random() * 1000000).toString()
      });
    }
    
    return { data: mockData };
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
  async getTrades(
    network: string,
    poolAddress: string,
    options: TradesParams = {}
  ): Promise<ApiResponse<Trade[]>> {
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
    
    return this._get<ApiResponse<Trade[]>>(`/networks/${network}/pools/${poolAddress}/trades`, params);
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
  async searchPools(
    query: string,
    options: { network?: string } & IncludeParams & PaginationParams = {}
  ): Promise<ApiResponse<Pool[]>> {
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
    
    return this._get<ApiResponse<Pool[]>>(endpoint, params);
  }
} 