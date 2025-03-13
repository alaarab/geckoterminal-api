# GeckoTerminal API Wrapper

A complete Node.js wrapper for the [GeckoTerminal API](https://www.geckoterminal.com/dex-api), providing easy access to DeFi data across 190+ blockchain networks and 1,300+ DEXes.

## Installation

```bash
npm install geckoterminal-api
```

## Usage

```javascript
import { GeckoTerminal } from 'geckoterminal-api';

// Create a new instance of the GeckoTerminal client
const geckoTerminal = new GeckoTerminal();

// Get all supported networks
const networks = await geckoTerminal.getNetworks();
console.log(networks.data[0].attributes.name); // "Ethereum"

// Get a specific pool with related resources
const wethUsdc = await geckoTerminal.getPool('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', {
  include: ['base_token', 'quote_token', 'dex']
});
console.log(wethUsdc.data.attributes.name); // "WETH/USDC"

// Get token prices
const prices = await geckoTerminal.getPrices('eth', [
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  // WETH
]);
console.log(prices.data[0].attributes.price_usd);
```

## API Reference

This wrapper implements all official endpoints from the GeckoTerminal API v2, with comprehensive test coverage for each method.

### Networks

#### `getNetworks(options)`

Get a list of all networks supported by GeckoTerminal.

```javascript
const networks = await geckoTerminal.getNetworks({ page: 1, page_size: 100 });
```

### DEXes

#### `getDexes(network, options)`

Get a list of all DEXes on a specific network.

```javascript
const dexes = await geckoTerminal.getDexes('eth', { page: 1, page_size: 100 });
```

### Pools

#### `getPool(network, poolAddress, options)`

Get information about a specific pool.

```javascript
const pool = await geckoTerminal.getPool('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', {
  include: ['base_token', 'quote_token', 'dex']
});
```

#### `getPools(network, poolAddresses, options)`

Get information about multiple pools.

```javascript
const pools = await geckoTerminal.getPools('solana', [
  'FpCMFDFGYotvufJ7HrFHsWEiiQCGbkLCtwHiDnh7o28Q',
  '3ne4mWqdYuNiYrYZC9TrA3FcfuFdErghH97vNPbjicr1'
], {
  include: ['base_token', 'quote_token', 'dex']
});
```

#### `getTopPools(network, options)`

Get the top pools on a network or DEX.

```javascript
// Get top pools on Polygon
const topPools = await geckoTerminal.getTopPools('polygon_pos', {
  include: ['base_token', 'quote_token', 'dex'],
  page: 1,
  page_size: 100
});

// Get top pools on a specific DEX
const uniswapPools = await geckoTerminal.getTopPools('eth', {
  dex: 'uniswap_v3',
  include: ['base_token', 'quote_token', 'dex']
});
```

#### `getNewPools(options)`

Get new pools on a network or across all networks.

```javascript
// Get new pools across all networks
const newPools = await geckoTerminal.getNewPools({
  include: ['base_token', 'quote_token', 'dex']
});

// Get new pools on Ethereum
const newEthPools = await geckoTerminal.getNewPools({
  network: 'eth',
  include: ['base_token', 'quote_token', 'dex']
});
```

#### `getTrendingPools(options)`

Get trending pools across all networks.

```javascript
// Get trending pools across all networks
const trendingPools = await geckoTerminal.getTrendingPools({
  include: ['base_token', 'quote_token', 'dex'],
  page: 1,
  page_size: 100
});
```

#### `getTrendingPoolsByNetwork(network, options)`

Get trending pools on a specific network.

```javascript
// Get trending pools on Ethereum
const trendingEthPools = await geckoTerminal.getTrendingPoolsByNetwork('eth', {
  include: ['base_token', 'quote_token', 'dex'],
  page: 1,
  page_size: 100
});
```

#### `getPoolInfo(network, poolAddress)`

Get additional info for a specific pool.

```javascript
const poolInfo = await geckoTerminal.getPoolInfo('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640');
```

### Tokens

#### `getToken(network, tokenAddress, options)`

Get information about a specific token.

```javascript
const weth = await geckoTerminal.getToken('eth', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', {
  include: ['top_pools']
});
```

#### `getPrices(network, tokenAddresses)`

Get prices for multiple tokens (max 30).

```javascript
const prices = await geckoTerminal.getPrices('eth', [
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'  // WETH
]);
```

### OHLCV Data

#### `getPoolOhlcv(network, poolAddress, options)`

Get OHLCV data for a specific pool.

```javascript
const ohlcvData = await geckoTerminal.getPoolOhlcv('eth', '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed', {
  timeframe: 'day',  // 'day', 'hour', or 'minute'
  aggregate: 1,
  limit: 100,
  currency: 'usd',   // 'usd' or 'token'
  token: 'base'      // 'base', 'quote', or specific token address
});
```

### Trades

#### `getTrades(network, poolAddress, options)`

Get trades for a specific pool.

```javascript
const trades = await geckoTerminal.getTrades('eth', '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', {
  trade_volume_in_usd_greater_than: 10000
});
```

### Search

#### `searchPools(query, options)`

Search for pools by query.

```javascript
// Search for 'ETH' pools on all networks
const results = await geckoTerminal.searchPools('ETH', {
  include: ['base_token', 'quote_token', 'dex']
});

// Search for 'ETH' pools on Ethereum
const ethResults = await geckoTerminal.searchPools('ETH', {
  network: 'eth',
  include: ['base_token', 'quote_token', 'dex']
});
```

## Configuration

You can configure the GeckoTerminal client with custom options:

```javascript
const geckoTerminal = new GeckoTerminal({
  baseUrl: 'https://api.geckoterminal.com/api',  // Custom base URL
  apiVersion: 'v2',                             // API version
  headers: {                                    // Custom headers
    'Accept-Language': 'en-US'
  }
});
```

## Completeness

This wrapper implements all endpoints of the GeckoTerminal API v2. Each endpoint has complete test coverage to ensure functionality and reliability.

The following official endpoints are implemented and tested:
- Networks listing
- DEXes listing 
- Pools (single, multiple, top, new, trending)
- Token information and prices
- OHLCV data
- Trade data
- Pool search

## Rate Limits

The GeckoTerminal API has a rate limit of 30 requests per minute for free usage. For higher rate limits, you can subscribe to a CoinGecko API paid plan.

## License

MIT 