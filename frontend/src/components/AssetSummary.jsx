import React from 'react';
import AssetLineChart from './AssetLineChart';

const AssetSummary = ({ range, setRange, data, isLoading, isError }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <section className="section section--primary">
      <div className="asset-summary">
        <div className="asset-summary-header">
          <div className="asset-summary-metric">
            <h2 className="section-title">Asset Summary</h2>
            <h1>
              <span>{data?.totalValue}</span>
              <span className={`badge ${data?.percent >= 0 ? 'positive' : 'negative'}`}>
                {data?.percent.toFixed(2)}%
              </span>
            </h1>
          </div>

          <div className="asset-summary-pills">
            <button className={range === '7D' ? 'active' : ''} onClick={() => setRange('7D')}>7D</button>
            <button className={range === '30D' ? 'active' : ''} onClick={() => setRange('30D')}>30D</button>
            <button className={range === '90D' ? 'active' : ''} onClick={() => setRange('90D')}>90D</button>
            <button className={range === 'ALL' ? 'active' : ''} onClick={() => setRange('ALL')}>ALL</button>
          </div>
        </div>

        <div className="asset-summary-chart total-performance-chart">
          <AssetLineChart series={data?.chart?.series} labels={data?.chart?.labels} />
        </div>
      </div>
    </section>
  );
};

export default AssetSummary;
