"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type InputMode = "grouped" | "xy";
type GroupChartType = "bar" | "box" | "strip" | "mean-line";
type XYChartType = "scatter" | "line";

type ParsedTable = {
  headers: string[];
  rows: string[][];
  delimiter: string;
  warning?: string;
};

type GroupData = {
  name: string;
  values: number[];
};

type GroupSummary = {
  name: string;
  n: number;
  mean: number;
  median: number;
  sd: number;
  sem: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  ci95Low: number;
  ci95High: number;
};

type WelchResult = {
  t: number;
  df: number;
  p: number;
};

type AnovaResult = {
  f: number;
  dfBetween: number;
  dfWithin: number;
  p: number;
};

type XYPoint = {
  x: number;
  y: number;
};

type XYSummary = {
  n: number;
  xMean: number;
  yMean: number;
  xSd: number;
  ySd: number;
  r: number;
  slope: number;
  intercept: number;
  rSquared: number;
  pValue: number | null;
};

const sampleGrouped = `Control,Treatment A,Treatment B
9.8,11.2,13.6
10.5,10.9,14.2
9.9,11.7,13.1
10.1,12.0,13.7
10.7,11.5,14.5
9.6,11.9,13.9`;

const sampleXY = `Dose,Response
0,3.1
1,4.0
2,5.1
3,6.4
4,7.5
5,8.4
6,9.1`;

const groupedChartOptions: { value: GroupChartType; label: string }[] = [
  { value: "bar", label: "Bar + SEM" },
  { value: "box", label: "Box Plot" },
  { value: "strip", label: "Strip Plot" },
  { value: "mean-line", label: "Mean Line" },
];

const xyChartOptions: { value: XYChartType; label: string }[] = [
  { value: "scatter", label: "Scatter + Fit" },
  { value: "line", label: "Line" },
];

export default function StatsLabPage({
  backHref = "/",
  backLabel = "Back Home",
}: {
  backHref?: string;
  backLabel?: string;
} = {}) {
  const [mode, setMode] = useState<InputMode>("grouped");
  const [hasHeader, setHasHeader] = useState(true);
  const [input, setInput] = useState(sampleGrouped);
  const [groupChart, setGroupChart] = useState<GroupChartType>("bar");
  const [xyChart, setXYChart] = useState<XYChartType>("scatter");
  const [xColumn, setXColumn] = useState(0);
  const [yColumn, setYColumn] = useState(1);

  const parsed = useMemo(() => {
    try {
      return parseDelimitedTable(input, hasHeader);
    } catch {
      return null;
    }
  }, [input, hasHeader]);

  useEffect(() => {
    if (!parsed) {
      setXColumn(0);
      setYColumn(1);
      return;
    }

    const max = Math.max(0, parsed.headers.length - 1);
    if (xColumn > max) {
      setXColumn(0);
    }

    const nextY = parsed.headers.length > 1 ? 1 : 0;
    if (yColumn > max || yColumn === xColumn) {
      setYColumn(nextY === xColumn && parsed.headers.length > 2 ? 2 : nextY);
    }
  }, [parsed, xColumn, yColumn]);

  const groupedData = useMemo(() => {
    if (!parsed || mode !== "grouped") {
      return [] as GroupData[];
    }
    return extractGroups(parsed);
  }, [mode, parsed]);

  const groupSummaries = useMemo(() => groupedData.map(summarizeGroup), [groupedData]);

  const welch = useMemo(() => {
    if (groupedData.length !== 2) {
      return null;
    }
    return welchTTest(groupedData[0].values, groupedData[1].values);
  }, [groupedData]);

  const anova = useMemo(() => {
    if (groupedData.length < 3) {
      return null;
    }
    return oneWayAnova(groupedData.map((group) => group.values));
  }, [groupedData]);

  const xyPoints = useMemo(() => {
    if (!parsed || mode !== "xy") {
      return [] as XYPoint[];
    }
    return extractXYPoints(parsed, xColumn, yColumn);
  }, [mode, parsed, xColumn, yColumn]);

  const xySummary = useMemo(() => summarizeXY(xyPoints), [xyPoints]);

  const modeValid = mode === "grouped" ? groupedData.length > 0 : xyPoints.length > 0;

  const modeError = useMemo(() => {
    if (!parsed) {
      return "Could not parse your input. Use comma, tab, or semicolon delimiters.";
    }

    if (mode === "grouped" && groupedData.length === 0) {
      return "No numeric data found. In grouped mode, each column is interpreted as one group.";
    }

    if (mode === "xy" && xyPoints.length < 2) {
      return "Need at least two valid (x, y) rows for XY analysis.";
    }

    return null;
  }, [groupedData.length, mode, parsed, xyPoints.length]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1400px_900px_at_10%_-10%,#f9f0d4_0%,#f8efe2_38%,#efe6da_100%)] text-[#1b2428]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#1b2428]/15 bg-[#fffdfa]/85 p-5 shadow-[0_12px_30px_-18px_rgba(10,20,30,0.35)] backdrop-blur"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#51616a]">Data + Stats</p>
              <h1 className="font-[Iowan_Old_Style,Palatino,serif] text-3xl sm:text-4xl leading-tight text-[#102129]">
                Prism-like Analysis Studio
              </h1>
            </div>
            <Link
              href={backHref}
              className="rounded-full border border-[#1b2428]/30 bg-white/70 px-4 py-2 text-sm transition hover:bg-white"
            >
              {backLabel}
            </Link>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[#34444d]">
            Paste CSV/TSV data, compute statistical tests, and visualize results with multiple chart styles.
            Grouped mode uses column-wise groups (like Prism column tables). XY mode supports correlation,
            linear regression, and fitted scatter plots.
          </p>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="rounded-3xl border border-[#1b2428]/15 bg-[#fffdfa]/85 p-5 shadow-[0_10px_24px_-18px_rgba(10,20,30,0.35)]"
          >
            <h2 className="font-[Iowan_Old_Style,Palatino,serif] text-2xl">Data Input</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <ModeButton active={mode === "grouped"} onClick={() => setMode("grouped")}>Grouped</ModeButton>
              <ModeButton active={mode === "xy"} onClick={() => setMode("xy")}>XY</ModeButton>
              <button
                type="button"
                onClick={() => setInput(mode === "grouped" ? sampleGrouped : sampleXY)}
                className="rounded-full border border-[#1b2428]/20 px-3 py-1.5 text-sm hover:bg-[#f2ebe1]"
              >
                Load Sample
              </button>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-[#3f5159]">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(event) => setHasHeader(event.target.checked)}
                className="size-4 accent-[#244a57]"
              />
              First row is header
            </label>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-4 h-[300px] w-full resize-y rounded-2xl border border-[#1b2428]/20 bg-[#fffefb] p-3 font-mono text-sm outline-none transition focus:border-[#224956] focus:ring-2 focus:ring-[#224956]/25"
              placeholder={mode === "grouped" ? sampleGrouped : sampleXY}
            />

            {parsed ? (
              <div className="mt-3 rounded-xl bg-[#f6efe6] px-3 py-2 text-xs text-[#4a5a63]">
                Parsed {parsed.rows.length} rows, {parsed.headers.length} columns ({delimiterName(parsed.delimiter)}).
                {parsed.warning ? ` ${parsed.warning}` : ""}
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-[#fef2f2] px-3 py-2 text-xs text-[#a13232]">
                Could not parse this table.
              </div>
            )}

            {mode === "xy" && parsed && parsed.headers.length >= 2 ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-[#5b6c74]">X Column</label>
                  <select
                    value={xColumn}
                    onChange={(event) => setXColumn(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#1b2428]/20 bg-white px-3 py-2 text-sm"
                  >
                    {parsed.headers.map((name, idx) => (
                      <option key={`x-${name}-${idx}`} value={idx}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-[#5b6c74]">Y Column</label>
                  <select
                    value={yColumn}
                    onChange={(event) => setYColumn(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#1b2428]/20 bg-white px-3 py-2 text-sm"
                  >
                    {parsed.headers.map((name, idx) => (
                      <option key={`y-${name}-${idx}`} value={idx}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-3xl border border-[#1b2428]/15 bg-[#fffdfa]/85 p-5 shadow-[0_10px_24px_-18px_rgba(10,20,30,0.35)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-[Iowan_Old_Style,Palatino,serif] text-2xl">Statistics + Charts</h2>
              {mode === "grouped" ? (
                <select
                  value={groupChart}
                  onChange={(event) => setGroupChart(event.target.value as GroupChartType)}
                  className="rounded-xl border border-[#1b2428]/20 bg-white px-3 py-2 text-sm"
                >
                  {groupedChartOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={xyChart}
                  onChange={(event) => setXYChart(event.target.value as XYChartType)}
                  className="rounded-xl border border-[#1b2428]/20 bg-white px-3 py-2 text-sm"
                >
                  {xyChartOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {!modeValid || modeError ? (
              <div className="mt-4 rounded-2xl border border-[#e6cccd] bg-[#fff3f3] px-4 py-3 text-sm text-[#8d3737]">
                {modeError}
              </div>
            ) : (
              <>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#1b2428]/15 bg-white">
                  {mode === "grouped" ? (
                    <GroupedChart groups={groupedData} summaries={groupSummaries} type={groupChart} />
                  ) : (
                    <XYChart points={xyPoints} summary={xySummary} type={xyChart} />
                  )}
                </div>

                {mode === "grouped" ? (
                  <>
                    <div className="mt-5">
                      <h3 className="font-semibold text-[#21343c]">Descriptive Statistics</h3>
                      <StatsTable summaries={groupSummaries} />
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#1b2428]/10 bg-[#f6efe5] p-4 text-sm text-[#2e4048]">
                      {welch ? (
                        <p>
                          Welch t-test (two-tailed): t = <Stat>{formatNumber(welch.t)}</Stat>, df ={" "}
                          <Stat>{formatNumber(welch.df)}</Stat>, p = <Stat>{formatPValue(welch.p)}</Stat>
                        </p>
                      ) : null}
                      {anova ? (
                        <p>
                          One-way ANOVA: F({anova.dfBetween}, {anova.dfWithin}) = <Stat>{formatNumber(anova.f)}</Stat>,
                          p = <Stat>{formatPValue(anova.p)}</Stat>
                        </p>
                      ) : null}
                      {!welch && !anova ? (
                        <p>Need at least 2 groups for inferential statistics.</p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-5 overflow-x-auto rounded-2xl border border-[#1b2428]/10">
                      <table className="min-w-full divide-y divide-[#1b2428]/10 text-sm">
                        <tbody className="divide-y divide-[#1b2428]/10 bg-white">
                          <KeyValueRow label="N pairs" value={String(xySummary.n)} />
                          <KeyValueRow label="Mean X" value={formatNumber(xySummary.xMean)} />
                          <KeyValueRow label="Mean Y" value={formatNumber(xySummary.yMean)} />
                          <KeyValueRow label="SD X" value={formatNumber(xySummary.xSd)} />
                          <KeyValueRow label="SD Y" value={formatNumber(xySummary.ySd)} />
                          <KeyValueRow label="Pearson r" value={formatNumber(xySummary.r)} />
                          <KeyValueRow label="R²" value={formatNumber(xySummary.rSquared)} />
                          <KeyValueRow
                            label="Linear fit"
                            value={`y = ${formatNumber(xySummary.slope)}x + ${formatNumber(xySummary.intercept)}`}
                          />
                          <KeyValueRow
                            label="Correlation p"
                            value={xySummary.pValue === null ? "Not enough points" : formatPValue(xySummary.pValue)}
                          />
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-4 rounded-2xl border border-[#1b2428]/10 bg-[#f6efe5] px-4 py-3 text-sm text-[#2e4048]">
                      Pearson correlation p-value is computed from the t statistic with df = n - 2.
                    </p>
                  </>
                )}
              </>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-[#224956] text-white shadow-[0_8px_18px_-10px_rgba(15,55,66,0.7)]"
          : "border border-[#1b2428]/20 hover:bg-[#f2ebe1]"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#102d35]">{children}</span>;
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="w-48 bg-[#f8f4ed] px-4 py-2.5 font-medium text-[#243942]">{label}</td>
      <td className="px-4 py-2.5 text-[#1f3138]">{value}</td>
    </tr>
  );
}

function StatsTable({ summaries }: { summaries: GroupSummary[] }) {
  return (
    <div className="mt-2 overflow-x-auto rounded-2xl border border-[#1b2428]/10">
      <table className="min-w-full text-sm">
        <thead className="bg-[#f8f4ed] text-[#2b3f47]">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Group</th>
            <th className="px-3 py-2 text-right font-semibold">n</th>
            <th className="px-3 py-2 text-right font-semibold">Mean</th>
            <th className="px-3 py-2 text-right font-semibold">Median</th>
            <th className="px-3 py-2 text-right font-semibold">SD</th>
            <th className="px-3 py-2 text-right font-semibold">SEM</th>
            <th className="px-3 py-2 text-right font-semibold">95% CI</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => (
            <tr key={summary.name} className="border-t border-[#1b2428]/10 bg-white text-[#1f3138]">
              <td className="px-3 py-2">{summary.name}</td>
              <td className="px-3 py-2 text-right">{summary.n}</td>
              <td className="px-3 py-2 text-right">{formatNumber(summary.mean)}</td>
              <td className="px-3 py-2 text-right">{formatNumber(summary.median)}</td>
              <td className="px-3 py-2 text-right">{formatNumber(summary.sd)}</td>
              <td className="px-3 py-2 text-right">{formatNumber(summary.sem)}</td>
              <td className="px-3 py-2 text-right">
                [{formatNumber(summary.ci95Low)}, {formatNumber(summary.ci95High)}]
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupedChart({
  groups,
  summaries,
  type,
}: {
  groups: GroupData[];
  summaries: GroupSummary[];
  type: GroupChartType;
}) {
  const width = 920;
  const height = 380;
  const margin = { top: 18, right: 22, bottom: 70, left: 64 };

  const allValues = groups.flatMap((group) => group.values);
  const yMinData = Math.min(...allValues);
  const yMaxData = Math.max(...allValues);

  const yMin = type === "bar" ? Math.min(0, yMinData) : yMinData;
  let yMax = yMaxData;

  if (type === "bar") {
    const maxWithSem = Math.max(...summaries.map((summary) => summary.mean + summary.sem));
    yMax = Math.max(yMax, maxWithSem);
  } else if (type === "mean-line") {
    yMax = Math.max(...summaries.map((summary) => summary.mean));
  }

  const yDomain = expandDomain(yMin, yMax, 0.15);
  const yScale = makeScale(yDomain[0], yDomain[1], height - margin.bottom, margin.top);
  const baselineY = yScale(0);
  const innerWidth = width - margin.left - margin.right;
  const slot = innerWidth / Math.max(groups.length, 1);

  const points = summaries.map((summary, idx) => {
    const x = margin.left + slot * idx + slot / 2;
    return { x, y: yScale(summary.mean), summary };
  });

  const yTicks = ticks(yDomain[0], yDomain[1], 5);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      <rect x={0} y={0} width={width} height={height} fill="#fff" />

      {yTicks.map((tick) => (
        <g key={`grid-${tick}`}>
          <line x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} stroke="#dde3e6" />
          <text x={margin.left - 10} y={yScale(tick) + 4} textAnchor="end" fontSize="11" fill="#51616a">
            {formatNumber(tick)}
          </text>
        </g>
      ))}

      <line x1={margin.left} x2={width - margin.right} y1={baselineY} y2={baselineY} stroke="#7f8c92" strokeWidth={1.2} />

      {type === "bar"
        ? summaries.map((summary, idx) => {
            const xCenter = margin.left + slot * idx + slot / 2;
            const barWidth = Math.min(slot * 0.58, 70);
            const y = yScale(summary.mean);
            const h = Math.abs(baselineY - y);
            const yTop = Math.min(y, baselineY);
            const errTop = yScale(summary.mean + summary.sem);
            const errBottom = yScale(summary.mean - summary.sem);
            return (
              <g key={`bar-${summary.name}`}>
                <rect
                  x={xCenter - barWidth / 2}
                  y={yTop}
                  width={barWidth}
                  height={Math.max(1, h)}
                  fill="#5ca08f"
                  opacity={0.82}
                  rx={6}
                />
                <line x1={xCenter} x2={xCenter} y1={errTop} y2={errBottom} stroke="#25434d" strokeWidth={2} />
                <line x1={xCenter - 8} x2={xCenter + 8} y1={errTop} y2={errTop} stroke="#25434d" strokeWidth={2} />
                <line x1={xCenter - 8} x2={xCenter + 8} y1={errBottom} y2={errBottom} stroke="#25434d" strokeWidth={2} />

                {groups[idx].values.map((value, pointIndex) => {
                  const jitter = pseudoJitter(idx, pointIndex, Math.min(24, barWidth * 0.45));
                  return (
                    <circle
                      key={`point-${idx}-${pointIndex}`}
                      cx={xCenter + jitter}
                      cy={yScale(value)}
                      r={3.6}
                      fill="#17303a"
                      opacity={0.72}
                    />
                  );
                })}
              </g>
            );
          })
        : null}

      {type === "strip"
        ? groups.map((group, idx) => {
            const xCenter = margin.left + slot * idx + slot / 2;
            const band = Math.min(slot * 0.68, 68);
            return (
              <g key={`strip-${group.name}`}>
                {group.values.map((value, pointIndex) => {
                  const jitter = pseudoJitter(idx, pointIndex, band / 2);
                  return (
                    <circle
                      key={`strip-dot-${idx}-${pointIndex}`}
                      cx={xCenter + jitter}
                      cy={yScale(value)}
                      r={4.2}
                      fill="#2d6878"
                      opacity={0.83}
                    />
                  );
                })}
                <line
                  x1={xCenter - band / 2}
                  x2={xCenter + band / 2}
                  y1={yScale(summaries[idx].mean)}
                  y2={yScale(summaries[idx].mean)}
                  stroke="#1f3841"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </g>
            );
          })
        : null}

      {type === "box"
        ? summaries.map((summary, idx) => {
            const xCenter = margin.left + slot * idx + slot / 2;
            const boxW = Math.min(slot * 0.5, 54);
            const iqr = summary.q3 - summary.q1;
            const lowFence = summary.q1 - 1.5 * iqr;
            const highFence = summary.q3 + 1.5 * iqr;
            const inliers = groups[idx].values.filter((value) => value >= lowFence && value <= highFence);
            const whiskerLow = inliers.length ? Math.min(...inliers) : summary.min;
            const whiskerHigh = inliers.length ? Math.max(...inliers) : summary.max;
            const outliers = groups[idx].values.filter((value) => value < lowFence || value > highFence);

            return (
              <g key={`box-${summary.name}`}>
                <line x1={xCenter} x2={xCenter} y1={yScale(whiskerLow)} y2={yScale(whiskerHigh)} stroke="#244a57" strokeWidth={2} />
                <line x1={xCenter - 12} x2={xCenter + 12} y1={yScale(whiskerLow)} y2={yScale(whiskerLow)} stroke="#244a57" strokeWidth={2} />
                <line x1={xCenter - 12} x2={xCenter + 12} y1={yScale(whiskerHigh)} y2={yScale(whiskerHigh)} stroke="#244a57" strokeWidth={2} />
                <rect
                  x={xCenter - boxW / 2}
                  y={yScale(summary.q3)}
                  width={boxW}
                  height={Math.max(1, yScale(summary.q1) - yScale(summary.q3))}
                  fill="#88b9af"
                  stroke="#244a57"
                  strokeWidth={2}
                  opacity={0.9}
                  rx={4}
                />
                <line x1={xCenter - boxW / 2} x2={xCenter + boxW / 2} y1={yScale(summary.median)} y2={yScale(summary.median)} stroke="#193039" strokeWidth={3} />

                {outliers.map((outlier, pointIndex) => (
                  <circle
                    key={`outlier-${idx}-${pointIndex}`}
                    cx={xCenter + pseudoJitter(idx, pointIndex, boxW * 0.36)}
                    cy={yScale(outlier)}
                    r={3.5}
                    fill="#193039"
                    opacity={0.75}
                  />
                ))}
              </g>
            );
          })
        : null}

      {type === "mean-line" && points.length > 1 ? (
        <>
          <polyline
            fill="none"
            stroke="#2d6878"
            strokeWidth={3}
            points={points.map((point) => `${point.x},${point.y}`).join(" ")}
          />
          {points.map((point) => (
            <circle key={`mean-point-${point.summary.name}`} cx={point.x} cy={point.y} r={5} fill="#16313b" />
          ))}
        </>
      ) : null}

      {groups.map((group, idx) => {
        const xCenter = margin.left + slot * idx + slot / 2;
        return (
          <text key={`x-${group.name}`} x={xCenter} y={height - 24} textAnchor="middle" fontSize="12" fill="#33484f">
            {truncate(group.name, 14)}
          </text>
        );
      })}

      <text x={14} y={18} fontSize="12" fill="#42545c">
        Value
      </text>
    </svg>
  );
}

function XYChart({ points, summary, type }: { points: XYPoint[]; summary: XYSummary; type: XYChartType }) {
  const width = 920;
  const height = 380;
  const margin = { top: 18, right: 22, bottom: 64, left: 66 };

  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);

  const xDomain = expandDomain(Math.min(...xValues), Math.max(...xValues), 0.12);
  const yDomain = expandDomain(Math.min(...yValues), Math.max(...yValues), 0.15);

  const xScale = makeScale(xDomain[0], xDomain[1], margin.left, width - margin.right);
  const yScale = makeScale(yDomain[0], yDomain[1], height - margin.bottom, margin.top);

  const xTicks = ticks(xDomain[0], xDomain[1], 5);
  const yTicks = ticks(yDomain[0], yDomain[1], 5);

  const sorted = [...points].sort((a, b) => a.x - b.x);

  const regY1 = summary.intercept + summary.slope * xDomain[0];
  const regY2 = summary.intercept + summary.slope * xDomain[1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      <rect x={0} y={0} width={width} height={height} fill="#fff" />

      {xTicks.map((tick) => (
        <g key={`x-grid-${tick}`}>
          <line x1={xScale(tick)} x2={xScale(tick)} y1={margin.top} y2={height - margin.bottom} stroke="#eef2f4" />
          <text x={xScale(tick)} y={height - margin.bottom + 20} textAnchor="middle" fontSize="11" fill="#51616a">
            {formatNumber(tick)}
          </text>
        </g>
      ))}

      {yTicks.map((tick) => (
        <g key={`y-grid-${tick}`}>
          <line x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} stroke="#eef2f4" />
          <text x={margin.left - 10} y={yScale(tick) + 4} textAnchor="end" fontSize="11" fill="#51616a">
            {formatNumber(tick)}
          </text>
        </g>
      ))}

      <line x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} stroke="#869298" />
      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={height - margin.bottom} stroke="#869298" />

      {type === "line" ? (
        <polyline
          fill="none"
          stroke="#2d6878"
          strokeWidth={3}
          points={sorted.map((point) => `${xScale(point.x)},${yScale(point.y)}`).join(" ")}
        />
      ) : null}

      {type === "scatter" ? (
        <line
          x1={xScale(xDomain[0])}
          x2={xScale(xDomain[1])}
          y1={yScale(regY1)}
          y2={yScale(regY2)}
          stroke="#c06f44"
          strokeWidth={2.6}
          strokeDasharray="6 5"
        />
      ) : null}

      {points.map((point, idx) => (
        <circle
          key={`xy-${idx}`}
          cx={xScale(point.x)}
          cy={yScale(point.y)}
          r={4.3}
          fill="#1f4d5a"
          opacity={0.85}
        />
      ))}

      <text x={width / 2} y={height - 14} textAnchor="middle" fontSize="12" fill="#42545c">
        X
      </text>
      <text x={20} y={height / 2} textAnchor="middle" fontSize="12" fill="#42545c" transform={`rotate(-90 20 ${height / 2})`}>
        Y
      </text>
    </svg>
  );
}

function parseDelimitedTable(input: string, hasHeader: boolean): ParsedTable {
  const cleaned = input.replace(/\r/g, "").trim();
  if (!cleaned) {
    throw new Error("empty");
  }

  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("empty");
  }

  const delimiter = detectDelimiter(lines[0]);
  const rawRows = lines.map((line) => parseLine(line, delimiter));
  const width = Math.max(...rawRows.map((row) => row.length));

  const padded = rawRows.map((row) => {
    const copy = [...row];
    while (copy.length < width) {
      copy.push("");
    }
    return copy;
  });

  let headers: string[];
  let rows: string[][];

  if (hasHeader) {
    headers = padded[0].map((value, idx) => value.trim() || `Column ${idx + 1}`);
    rows = padded.slice(1);
  } else {
    headers = new Array(width).fill(0).map((_, idx) => `Column ${idx + 1}`);
    rows = padded;
  }

  return {
    headers,
    rows,
    delimiter,
    warning: rows.length === 0 ? "No data rows after header." : undefined,
  };
}

function detectDelimiter(line: string): string {
  const candidates = [",", "\t", ";"];
  let best = candidates[0];
  let bestScore = -1;

  for (const candidate of candidates) {
    const score = parseLine(line, candidate).length;
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

function parseLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      out.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  out.push(current.trim());
  return out;
}

function extractGroups(table: ParsedTable): GroupData[] {
  return table.headers
    .map((header, colIndex) => {
      const values = table.rows
        .map((row) => parseNumber(row[colIndex]))
        .filter((value): value is number => Number.isFinite(value));

      return {
        name: header,
        values,
      };
    })
    .filter((group) => group.values.length > 0);
}

function extractXYPoints(table: ParsedTable, xColumn: number, yColumn: number): XYPoint[] {
  if (xColumn === yColumn) {
    return [];
  }

  return table.rows
    .map((row) => ({
      x: parseNumber(row[xColumn]),
      y: parseNumber(row[yColumn]),
    }))
    .filter((point): point is XYPoint => Number.isFinite(point.x) && Number.isFinite(point.y));
}

function summarizeGroup(group: GroupData): GroupSummary {
  const sorted = [...group.values].sort((a, b) => a - b);
  const n = sorted.length;
  const groupMean = mean(sorted);
  const groupSd = standardDeviation(sorted);
  const sem = n > 0 ? groupSd / Math.sqrt(n) : Number.NaN;

  return {
    name: group.name,
    n,
    mean: groupMean,
    median: quantile(sorted, 0.5),
    sd: groupSd,
    sem,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    q1: quantile(sorted, 0.25),
    q3: quantile(sorted, 0.75),
    ci95Low: groupMean - 1.96 * sem,
    ci95High: groupMean + 1.96 * sem,
  };
}

function summarizeXY(points: XYPoint[]): XYSummary {
  const n = points.length;
  if (n === 0) {
    return {
      n: 0,
      xMean: Number.NaN,
      yMean: Number.NaN,
      xSd: Number.NaN,
      ySd: Number.NaN,
      r: Number.NaN,
      slope: Number.NaN,
      intercept: Number.NaN,
      rSquared: Number.NaN,
      pValue: null,
    };
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const xMean = mean(xs);
  const yMean = mean(ys);

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - xMean;
    const dy = ys[i] - yMean;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const r = denX === 0 || denY === 0 ? 0 : num / Math.sqrt(denX * denY);
  const slope = denX === 0 ? 0 : num / denX;
  const intercept = yMean - slope * xMean;
  const rSquared = r * r;

  let pValue: number | null = null;
  if (n > 2 && Math.abs(r) < 1) {
    const t = r * Math.sqrt((n - 2) / (1 - r * r));
    pValue = 2 * (1 - studentTCdf(Math.abs(t), n - 2));
  } else if (n > 2 && Math.abs(r) === 1) {
    pValue = 0;
  }

  return {
    n,
    xMean,
    yMean,
    xSd: standardDeviation(xs),
    ySd: standardDeviation(ys),
    r,
    slope,
    intercept,
    rSquared,
    pValue,
  };
}

function welchTTest(groupA: number[], groupB: number[]): WelchResult | null {
  if (groupA.length < 2 || groupB.length < 2) {
    return null;
  }

  const meanA = mean(groupA);
  const meanB = mean(groupB);
  const varA = variance(groupA);
  const varB = variance(groupB);
  const nA = groupA.length;
  const nB = groupB.length;

  const seTerm = varA / nA + varB / nB;
  if (seTerm === 0) {
    return null;
  }

  const t = (meanA - meanB) / Math.sqrt(seTerm);
  const numerator = seTerm * seTerm;
  const denominator = (varA * varA) / (nA * nA * (nA - 1)) + (varB * varB) / (nB * nB * (nB - 1));
  const df = denominator === 0 ? Number.NaN : numerator / denominator;
  const p = Number.isFinite(df) ? 2 * (1 - studentTCdf(Math.abs(t), df)) : Number.NaN;

  return { t, df, p };
}

function oneWayAnova(groups: number[][]): AnovaResult | null {
  const clean = groups.filter((group) => group.length > 0);
  const k = clean.length;
  if (k < 2) {
    return null;
  }

  const all = clean.flat();
  const totalN = all.length;
  if (totalN <= k) {
    return null;
  }

  const grandMean = mean(all);

  let ssBetween = 0;
  let ssWithin = 0;

  for (const group of clean) {
    const m = mean(group);
    ssBetween += group.length * (m - grandMean) ** 2;
    for (const value of group) {
      ssWithin += (value - m) ** 2;
    }
  }

  const dfBetween = k - 1;
  const dfWithin = totalN - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;

  if (msWithin === 0) {
    return null;
  }

  const f = msBetween / msWithin;
  const p = 1 - fCdf(f, dfBetween, dfWithin);

  return {
    f,
    dfBetween,
    dfWithin,
    p,
  };
}

function mean(values: number[]): number {
  if (!values.length) {
    return Number.NaN;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values: number[]): number {
  const n = values.length;
  if (n < 2) {
    return 0;
  }

  const m = mean(values);
  let acc = 0;
  for (const value of values) {
    acc += (value - m) ** 2;
  }
  return acc / (n - 1);
}

function standardDeviation(values: number[]): number {
  return Math.sqrt(Math.max(variance(values), 0));
}

function quantile(sortedValues: number[], p: number): number {
  if (!sortedValues.length) {
    return Number.NaN;
  }
  if (sortedValues.length === 1) {
    return sortedValues[0];
  }

  const pos = (sortedValues.length - 1) * p;
  const lower = Math.floor(pos);
  const upper = Math.ceil(pos);

  if (lower === upper) {
    return sortedValues[lower];
  }

  const weight = pos - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function parseNumber(value: string | undefined): number {
  if (!value) {
    return Number.NaN;
  }

  const normalized = value.trim().replace(/,/g, ".");
  if (!normalized) {
    return Number.NaN;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "NA";
  }

  const abs = Math.abs(value);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) {
    return value.toExponential(2);
  }

  return value.toFixed(4).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function formatPValue(value: number): string {
  if (!Number.isFinite(value)) {
    return "NA";
  }
  if (value < 0.0001) {
    return "< 0.0001";
  }
  return value.toFixed(4);
}

function delimiterName(delimiter: string): string {
  if (delimiter === "\t") {
    return "tab";
  }
  if (delimiter === ",") {
    return "comma";
  }
  return "semicolon";
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1)}…`;
}

function pseudoJitter(groupIndex: number, pointIndex: number, spread: number): number {
  const seed = (groupIndex + 1) * 9349 + (pointIndex + 1) * 421;
  const noise = Math.sin(seed) * 43758.5453;
  const frac = noise - Math.floor(noise);
  return (frac - 0.5) * 2 * spread;
}

function expandDomain(min: number, max: number, ratio: number): [number, number] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0, 1];
  }

  if (min === max) {
    const delta = min === 0 ? 1 : Math.abs(min) * 0.2;
    return [min - delta, max + delta];
  }

  const span = max - min;
  return [min - span * ratio, max + span * ratio];
}

function makeScale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) {
  const span = domainMax - domainMin;
  if (span === 0) {
    return () => (rangeMin + rangeMax) / 2;
  }

  return (value: number) => {
    const t = (value - domainMin) / span;
    return rangeMin + (rangeMax - rangeMin) * t;
  };
}

function ticks(min: number, max: number, targetCount: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0, 1];
  }

  if (min === max) {
    return [min];
  }

  const span = max - min;
  const rawStep = span / Math.max(targetCount, 2);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const candidates = [1, 2, 5, 10].map((factor) => factor * magnitude);

  let step = candidates[0];
  for (const candidate of candidates) {
    if (rawStep <= candidate) {
      step = candidate;
      break;
    }
  }

  const start = Math.ceil(min / step) * step;
  const values: number[] = [];

  for (let value = start; value <= max + step * 0.5; value += step) {
    values.push(Number(value.toFixed(12)));
  }

  if (values.length === 0) {
    values.push(min, max);
  }

  return values;
}

function studentTCdf(t: number, degreesOfFreedom: number): number {
  if (!Number.isFinite(t) || !Number.isFinite(degreesOfFreedom) || degreesOfFreedom <= 0) {
    return Number.NaN;
  }

  if (t === 0) {
    return 0.5;
  }

  const x = degreesOfFreedom / (degreesOfFreedom + t * t);
  const ib = regularizedIncompleteBeta(x, degreesOfFreedom / 2, 0.5);

  if (t > 0) {
    return 1 - 0.5 * ib;
  }
  return 0.5 * ib;
}

function fCdf(f: number, d1: number, d2: number): number {
  if (!Number.isFinite(f) || !Number.isFinite(d1) || !Number.isFinite(d2) || f < 0 || d1 <= 0 || d2 <= 0) {
    return Number.NaN;
  }

  const x = (d1 * f) / (d1 * f + d2);
  return regularizedIncompleteBeta(x, d1 / 2, d2 / 2);
}

function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }

  const logBt = logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x);
  const bt = Math.exp(logBt);

  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContinuedFraction(x, a, b)) / a;
  }

  return 1 - (bt * betaContinuedFraction(1 - x, b, a)) / b;
}

function betaContinuedFraction(x: number, a: number, b: number): number {
  const maxIterations = 200;
  const epsilon = 3e-12;
  const tiny = 1e-30;

  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < tiny) {
    d = tiny;
  }
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;

    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) {
      d = tiny;
    }
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) {
      c = tiny;
    }
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) {
      d = tiny;
    }
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) {
      c = tiny;
    }

    d = 1 / d;
    const delta = d * c;
    h *= delta;

    if (Math.abs(delta - 1) < epsilon) {
      break;
    }
  }

  return h;
}

function logGamma(z: number): number {
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  let x = 0.9999999999998099;
  const shifted = z - 1;

  for (let i = 0; i < p.length; i += 1) {
    x += p[i] / (shifted + i + 1);
  }

  const t = shifted + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(x);
}
