import React, { useRef, useEffect } from 'react';

const AssetLineChart = ({ series, labels }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !series || !labels || series.length === 0) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous chart

    const createSvgElement = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

    const width = 1000;
    const height = 320;
    const paddingX = 40;
    const paddingTop = 24;
    const paddingBottom = 50;
    const plotHeight = height - paddingTop - paddingBottom;
    const baselineY = paddingTop + plotHeight;

    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const stepX = (width - paddingX * 2) / (series.length - 1 || 1);
    const points = series.map((v, i) => ({
      x: paddingX + i * stepX,
      y: baselineY - ((v - min) / range) * plotHeight,
    }));

    const svg = createSvgElement('svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    svg.style.overflow = 'hidden';

    const path = createSvgElement('path');
    path.setAttribute('d', points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'hsl(var(--primary))');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    const labelGroup = createSvgElement('g');
    const getLabelIndices = (length) => {
      if (length < 2) return [];
      return [0, Math.floor((length - 1) / 2), length - 1];
    };
    const labelIndices = getLabelIndices(series.length);
    labelIndices.forEach((i) => {
      const label = createSvgElement('text');
      label.setAttribute('x', points[i].x);
      label.setAttribute('y', baselineY + 28);
      label.setAttribute('fill', 'hsl(var(--muted-foreground))');
      label.setAttribute('font-size', '11');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = new Date(labels[i]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      labelGroup.appendChild(label);
    });

    const hoverLine = createSvgElement('line');
    hoverLine.setAttribute('stroke', 'hsl(var(--border))');
    hoverLine.setAttribute('stroke-width', '1');
    hoverLine.setAttribute('stroke-dasharray', '4 6');
    hoverLine.style.opacity = '0';

    const hoverDot = createSvgElement('circle');
    hoverDot.setAttribute('r', '5');
    hoverDot.setAttribute('fill', 'hsl(var(--primary))');
    hoverDot.setAttribute('stroke', 'hsl(var(--background))');
    hoverDot.setAttribute('stroke-width', '2');
    hoverDot.style.opacity = '0';

    const hoverValueText = createSvgElement('text');
    hoverValueText.setAttribute('fill', '#ffffff');
    hoverValueText.setAttribute('font-size', '13');
    hoverValueText.setAttribute('font-weight', '600');
    hoverValueText.setAttribute('text-anchor', 'middle');
    hoverValueText.style.opacity = '0';
    hoverValueText.setAttribute('stroke', 'rgba(0,0,0,0.75)');
    hoverValueText.setAttribute('stroke-width', '4');
    hoverValueText.setAttribute('paint-order', 'stroke');

    const hoverDateText = createSvgElement('text');
    hoverDateText.setAttribute('fill', 'hsl(var(--muted-foreground))');
    hoverDateText.setAttribute('font-size', '11');
    hoverDateText.setAttribute('text-anchor', 'middle');
    hoverDateText.style.opacity = '0';
    hoverDateText.setAttribute('stroke', 'rgba(0,0,0,0.75)');
    hoverDateText.setAttribute('stroke-width', '4');
    hoverDateText.setAttribute('paint-order', 'stroke');

    const overlay = createSvgElement('rect');
    overlay.setAttribute('x', paddingX);
    overlay.setAttribute('y', paddingTop);
    overlay.setAttribute('width', width - paddingX * 2);
    overlay.setAttribute('height', plotHeight);
    overlay.setAttribute('fill', 'transparent');

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const estimateTextWidth = (text) => text.length * 7.5;

    overlay.addEventListener('mousemove', (e) => {
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * width;
      const index = Math.min(
        series.length - 1,
        Math.max(0, Math.round((mouseX - paddingX) / stepX))
      );
      const point = points[index];

      hoverLine.setAttribute('x1', point.x);
      hoverLine.setAttribute('x2', point.x);
      hoverLine.setAttribute('y1', point.y);
      hoverLine.setAttribute('y2', baselineY);
      hoverLine.style.opacity = '1';

      hoverDot.setAttribute('cx', point.x);
      hoverDot.setAttribute('cy', point.y);
      hoverDot.style.opacity = '1';

      const valueText = series[index].toLocaleString();
      hoverValueText.textContent = valueText;
      const textHalfWidth = estimateTextWidth(valueText) / 2;
      const safeX = clamp(point.x, paddingX + textHalfWidth, width - paddingX - textHalfWidth);
      hoverValueText.setAttribute('x', safeX);
      let valueY = point.y - 16;
      const minY = paddingTop + 14;
      if (valueY < minY) valueY = minY;
      hoverValueText.setAttribute('y', valueY);
      hoverValueText.style.opacity = '1';

      hoverDateText.textContent = new Date(labels[index]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      hoverDateText.setAttribute('x', point.x);
      hoverDateText.setAttribute('y', baselineY + 28);
      hoverDateText.style.opacity = '1';
    });

    overlay.addEventListener('mouseleave', () => {
      hoverLine.style.opacity = '0';
      hoverDot.style.opacity = '0';
      hoverValueText.style.opacity = '0';
      hoverDateText.style.opacity = '0';
    });

    svg.appendChild(path);
    svg.appendChild(labelGroup);
    svg.appendChild(hoverLine);
    svg.appendChild(hoverDot);
    svg.appendChild(hoverValueText);
    svg.appendChild(hoverDateText);
    svg.appendChild(overlay);
    container.appendChild(svg);

  }, [series, labels]);

  return <div ref={containerRef} style={{ width: '100%', height: '200px' }} />;
};

export default AssetLineChart;
