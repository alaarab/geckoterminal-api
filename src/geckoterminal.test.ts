import { GeckoTerminal } from './index.js';

describe('GeckoTerminal', () => {
  const geckoTerminal = new GeckoTerminal();

  // Example values for testing
  const testNetwork = 'eth';
  const testPoolAddress = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'; // WETH/USDC Uniswap v3 0.05%
  const testTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH

  describe('getNetworks', () => {
    it('should get a list of networks', async () => {
      const networks = await geckoTerminal.getNetworks();
      expect(Array.isArray(networks.data)).toBe(true);
      if (networks.data.length > 0) {
        const network = networks.data[0];
        expect(network).toHaveProperty('id');
        expect(network).toHaveProperty('type');
        expect(network).toHaveProperty('attributes');
        expect(network.attributes).toHaveProperty('name');
        expect(network.attributes).toHaveProperty('coingecko_asset_platform_id');
      }
    });
  });

  describe('getDexes', () => {
    it('should get a list of DEXes on a network', async () => {
      const dexes = await geckoTerminal.getDexes(testNetwork);
      expect(Array.isArray(dexes.data)).toBe(true);
      if (dexes.data.length > 0) {
        const dex = dexes.data[0];
        expect(dex).toHaveProperty('id');
        expect(dex).toHaveProperty('type');
        expect(dex).toHaveProperty('attributes');
        expect(dex.attributes).toHaveProperty('name');
      }
    });
  });

  describe('getPool', () => {
    it('should get information about a specific pool', async () => {
      const pool = await geckoTerminal.getPool(testNetwork, testPoolAddress, {
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(pool).toHaveProperty('data');
      expect(pool.data).toHaveProperty('id');
      expect(pool.data).toHaveProperty('type');
      expect(pool.data).toHaveProperty('attributes');
      expect(pool.data.attributes).toHaveProperty('address');
      expect(pool.data.attributes).toHaveProperty('name');
      expect(pool).toHaveProperty('included');
    });
  });

  describe('getPools', () => {
    it('should get information about multiple pools', async () => {
      const pools = await geckoTerminal.getPools(testNetwork, [testPoolAddress], {
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(pools).toHaveProperty('data');
      expect(Array.isArray(pools.data)).toBe(true);
      if (pools.data.length > 0) {
        const pool = pools.data[0];
        expect(pool).toHaveProperty('id');
        expect(pool).toHaveProperty('type');
        expect(pool).toHaveProperty('attributes');
        expect(pool.attributes).toHaveProperty('address');
        expect(pool.attributes).toHaveProperty('name');
      }
    });
  });

  describe('getTopPools', () => {
    it('should get top pools on a network', async () => {
      const pools = await geckoTerminal.getTopPools(testNetwork, {
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(pools).toHaveProperty('data');
      expect(Array.isArray(pools.data)).toBe(true);
      if (pools.data.length > 0) {
        const pool = pools.data[0];
        expect(pool).toHaveProperty('id');
        expect(pool).toHaveProperty('type');
        expect(pool).toHaveProperty('attributes');
        expect(pool.attributes).toHaveProperty('address');
        expect(pool.attributes).toHaveProperty('name');
      }
    });
  });

  describe('getNewPools', () => {
    it('should get new pools', async () => {
      const pools = await geckoTerminal.getNewPools({
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(pools).toHaveProperty('data');
      expect(Array.isArray(pools.data)).toBe(true);
      if (pools.data.length > 0) {
        const pool = pools.data[0];
        expect(pool).toHaveProperty('id');
        expect(pool).toHaveProperty('type');
        expect(pool).toHaveProperty('attributes');
        expect(pool.attributes).toHaveProperty('address');
        expect(pool.attributes).toHaveProperty('name');
      }
    });
  });

  describe('getTrendingPools', () => {
    it('should get trending pools across all networks', async () => {
      const pools = await geckoTerminal.getTrendingPools({
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(pools).toHaveProperty('data');
      expect(Array.isArray(pools.data)).toBe(true);
      if (pools.data.length > 0) {
        const pool = pools.data[0];
        expect(pool).toHaveProperty('id');
        expect(pool).toHaveProperty('type');
        expect(pool).toHaveProperty('attributes');
        expect(pool.attributes).toHaveProperty('address');
        expect(pool.attributes).toHaveProperty('name');
      }
    });
  });

  describe('getTrendingPoolsByNetwork', () => {
    it('should get trending pools on a specific network', async () => {
      const pools = await geckoTerminal.getTrendingPoolsByNetwork(testNetwork, {
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(pools).toHaveProperty('data');
      expect(Array.isArray(pools.data)).toBe(true);
      if (pools.data.length > 0) {
        const pool = pools.data[0];
        expect(pool).toHaveProperty('id');
        expect(pool).toHaveProperty('type');
        expect(pool).toHaveProperty('attributes');
        expect(pool.attributes).toHaveProperty('address');
        expect(pool.attributes).toHaveProperty('name');
      }
    });
  });

  describe('getPoolInfo', () => {
    it('should get additional info for a pool', async () => {
      const poolInfo = await geckoTerminal.getPoolInfo(testNetwork, testPoolAddress);
      expect(poolInfo).toHaveProperty('data');
      expect(poolInfo.data).toHaveProperty('id');
      expect(poolInfo.data).toHaveProperty('type');
      expect(poolInfo.data).toHaveProperty('attributes');
    });
  });

  describe('getToken', () => {
    it('should get information about a token', async () => {
      const token = await geckoTerminal.getToken(testNetwork, testTokenAddress, {
        include: ['top_pools']
      });
      expect(token).toHaveProperty('data');
      expect(token.data).toHaveProperty('id');
      expect(token.data).toHaveProperty('type');
      expect(token.data).toHaveProperty('attributes');
      expect(token.data.attributes).toHaveProperty('address');
      expect(token.data.attributes).toHaveProperty('name');
      expect(token.data.attributes).toHaveProperty('symbol');
    });
  });

  describe('getPrices', () => {
    it('should get prices for multiple tokens', async () => {
      const prices = await geckoTerminal.getPrices(testNetwork, [testTokenAddress]);
      expect(prices).toHaveProperty('data');
      expect(Array.isArray(prices.data)).toBe(true);
      if (prices.data.length > 0) {
        const price = prices.data[0];
        expect(price).toHaveProperty('id');
        expect(price).toHaveProperty('type');
        expect(price).toHaveProperty('attributes');
        expect(price.attributes).toHaveProperty('address');
        expect(price.attributes).toHaveProperty('price_usd');
      }
    });
  });

  describe('getPoolOhlcv', () => {
    it('should get OHLCV data for a pool', async () => {
      const ohlcv = await geckoTerminal.getPoolOhlcv(testNetwork, testPoolAddress, {
        timeframe: 'day',
        aggregate: 1,
        limit: 10
      });
      expect(ohlcv).toHaveProperty('data');
      expect(Array.isArray(ohlcv.data)).toBe(true);
      if (ohlcv.data.length > 0) {
        const candle = ohlcv.data[0];
        expect(candle).toHaveProperty('timestamp');
        expect(candle).toHaveProperty('open');
        expect(candle).toHaveProperty('high');
        expect(candle).toHaveProperty('low');
        expect(candle).toHaveProperty('close');
        expect(candle).toHaveProperty('volume');
      }
    });
  });

  describe('getTrades', () => {
    it('should get trades for a pool', async () => {
      const trades = await geckoTerminal.getTrades(testNetwork, testPoolAddress);
      expect(trades).toHaveProperty('data');
      expect(Array.isArray(trades.data)).toBe(true);
      if (trades.data.length > 0) {
        const trade = trades.data[0];
        expect(trade).toHaveProperty('id');
        expect(trade).toHaveProperty('type');
        expect(trade).toHaveProperty('attributes');
        expect(trade.attributes).toHaveProperty('tx_hash');
        expect(trade.attributes).toHaveProperty('block_number');
        expect(trade.attributes).toHaveProperty('block_timestamp');
      }
    });
  });

  describe('searchPools', () => {
    it('should search for pools by query', async () => {
      const results = await geckoTerminal.searchPools('ETH', {
        include: ['base_token', 'quote_token', 'dex']
      });
      expect(results).toHaveProperty('data');
      expect(Array.isArray(results.data)).toBe(true);
      if (results.data.length > 0) {
        const pool = results.data[0];
        expect(pool).toHaveProperty('id');
        expect(pool).toHaveProperty('type');
        expect(pool).toHaveProperty('attributes');
        expect(pool.attributes).toHaveProperty('address');
        expect(pool.attributes).toHaveProperty('name');
      }
    });
  });
}); 