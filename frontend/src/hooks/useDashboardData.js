import { useQuery } from '@tanstack/react-query';

const DATA_URLS = {
  accounts: '/data/accounts.json',
  assets: '/data/assets.json',
  autotraders: '/data/autotraders.json',
  tradingPlans: '/data/trading_plans.json',
  equityDaily: '/data/derive/asset_equity_daily.json',
  accountAssetsBase: '/data/account_assets_daily/',
  assetPriceBase: '/data/asset_price_daily/',
  trades: '/data/trades.json',
  providerRules: '/data/provider_market_rules.json',
};

const fetchJson = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}`);
  return r.json();
};

export const getAccounts = async () => fetchJson(DATA_URLS.accounts);
export const getAssets = async () => fetchJson(DATA_URLS.assets);
export const getAutotraders = async () => fetchJson(DATA_URLS.autotraders);
export const getTradingPlans = async () => fetchJson(DATA_URLS.tradingPlans);

export const getEquityDaily = async () => {
  const data = await fetchJson(DATA_URLS.equityDaily);
  if (!Array.isArray(data)) return [];
  return data
    .filter((d) => d && d.date && typeof d.equity_usd === 'number')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const formatCurrency = (value, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const computeSummary = (series) => {
  if (!series || series.length < 2) {
    return {
      totalValue: 0,
      percent: 0,
    };
  }
  const first = Number(series[0]?.equity_usd || 0);
  const last = Number(series[series.length - 1]?.equity_usd || 0);
  const percent = first > 0 ? ((last - first) / first) * 100 : 0;
  return {
    totalValue: last,
    percent,
  };
};

const buildAssetSummary = async (range) => {
  const rawSeries = await getEquityDaily();
  const sliceSeriesByRange = (series = [], range) => {
    if (!series.length) return [];
    if (range === 'ALL') return series;
    const days = { '7D': 7, '30D': 30, '90D': 90 }[range];
    if (!days) return series;
    return series.slice(-days);
  };
  const slicedSeries = sliceSeriesByRange(rawSeries, range);
  const { totalValue, percent } = computeSummary(slicedSeries);
  return {
    totalValue: formatCurrency(totalValue),
    percent,
    chart: {
      series: slicedSeries.map((d) => Number(d.equity_usd || 0)),
      labels: slicedSeries.map((d) => d.date),
    },
  };
};

const getAccountsSummaryByDate = async (date) => {
    const accounts = await getAccounts();
    const accountMap = new Map(accounts.map((a) => [a.account_id, a]));
    const dailyAssets = await fetchJson(`${DATA_URLS.accountAssetsBase}${date}.json`);
    const dailyPrices = await fetchJson(`${DATA_URLS.assetPriceBase}${date}.json`);
    const priceMap = new Map();
    if(dailyPrices && dailyPrices.prices) {
        for (const p of dailyPrices.prices) {
            priceMap.set(p.asset_id, Number(p.price_usd || 0));
        }
    }
    const accountValues = [];
    if(dailyAssets && dailyAssets.accounts) {
        for (const acc of dailyAssets.accounts) {
            let totalUsd = 0;
            for (const asset of acc.assets || []) {
                const price = priceMap.get(asset.asset_id) || 0;
                totalUsd += Number(asset.value || 0);
            }
            const meta = accountMap.get(acc.account_id);
            accountValues.push({
                account_id: acc.account_id,
                account_name: meta?.account_name || acc.account_id,
                totalValueUsd: totalUsd,
            });
        }
    }
    accountValues.sort((a, b) => b.totalValueUsd - a.totalValueUsd);
    return accountValues;
};

const getAccountsWithSummary = async () => {
    const equity = await getEquityDaily();
    if (!Array.isArray(equity) || equity.length === 0) {
        return getAccountsSummaryByDate('2025-01-03');
    }
    const latestDate = equity[equity.length - 1].date;
    return getAccountsSummaryByDate(latestDate);
};

const buildAccountsSummary = async () => {
  const accounts = await getAccountsWithSummary();
  const list = accounts.map((a) => ({
    name: a.account_name || a.account_id,
    amount: Number(a.totalValueUsd || 0),
    value: formatCurrency(a.totalValueUsd || 0),
  }));
  const total = list.reduce((sum, x) => sum + x.amount, 0);
  return {
    total: formatCurrency(total),
    accounts: list,
  };
};

const getAutotradersByAccount = async (accountId) => {
    const [autotraders, plans] = await Promise.all([
        getAutotraders(),
        getTradingPlans(),
    ]);
    const planMap = new Map(plans.map((p) => [p.plan_id, p]));
    return autotraders
        .filter((a) => a.account_id === accountId)
        .map((a) => ({
        ...a,
        tradingPlanName: planMap.get(a.plan_id)?.plan_name || '',
        }));
};

const buildTopAutotraders = async () => {
  const accounts = await getAccounts();
  const traders = (
    await Promise.all(
      accounts.map((a) => getAutotradersByAccount(a.account_id))
    )
  ).flat();
  return traders.slice(0, 3).map((t) => ({
    name: t.tradingPlanName || 'Autotrader',
    runtime: t.status === 'active' ? 'Running' : 'Stopped',
    pnl: '—',
  }));
};

export function useDashboardData(range) {
  return useQuery({
    queryKey: ['dashboardData', range],
    queryFn: async () => {
      const [assetSummary, accountsSummary, topAutotraders] = await Promise.all([
        buildAssetSummary(range),
        buildAccountsSummary(),
        buildTopAutotraders(),
      ]);
      return {
        assetSummary,
        accountsSummary,
        topAutotraders,
        alerts: [],
        tradeHistory: [],
      };
    },
  });
}
