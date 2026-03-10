"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState, useEffect } from "react";

type GoalKey = "familyBRL" | "emergency" | "etf";
type MainTab = "dashboard" | "automation" | "sideHustles";
type SideHustlesTab = "sell" | "freelance" | "youtube";

type GoalState = {
  target: number;
  current: number;
  monthlyContribution: number;
};

type FixedCostItem = {
  id: string;
  label: string;
  amount: number;
};

type FxSettings = {
  eurToBrl: number;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
};

type SellStatus =
  | "Backlog"
  | "Draft"
  | "Listed"
  | "Reserved"
  | "Sold"
  | "Shipped"
  | "Paid";

type SellChecklist = {
  photosDone: boolean;
  measurementsDone: boolean;
  titleDone: boolean;
  descriptionDone: boolean;
  listingPosted: boolean;
};

type SellItem = {
  id: string;
  name: string;
  category: string;
  platform: string;
  status: SellStatus;
  listingDate: string;
  soldDate: string;
  askPrice: number;
  soldPrice: number;
  fees: number;
  shippingCost: number;
  packagingCost: number;
  netProfit: number;
  notes: string;
  checklist: SellChecklist;
};

type ServiceType = "FigurePolish" | "RHelp" | "SlidesUpgrade" | "EnglishEdit" | "Other";

type FreelanceStatus =
  | "Lead"
  | "Negotiating"
  | "InProgress"
  | "Delivered"
  | "Paid"
  | "Testimonial";

type FreelanceProject = {
  id: string;
  clientName: string;
  source: string;
  serviceType: ServiceType;
  status: FreelanceStatus;
  quoteAmount: number;
  paidAmount: number;
  deadline: string;
  hoursSpent: number;
  effectiveRate: number;
  notes: string;
  nextAction: string;
};

type ServicePackage = {
  id: string;
  name: string;
  serviceType: ServiceType;
  defaultPrice: number;
  turnaroundDays: number;
  includedRevisions: number;
  scopeLimits: string;
};

type VideoFormat = "Long" | "Short";
type VideoStatus = "Idea" | "Outline" | "Filmed" | "Edited" | "Uploaded" | "Published";

type YoutubeVideo = {
  id: string;
  title: string;
  format: VideoFormat;
  status: VideoStatus;
  tags: string[];
  publishDate: string;
  url: string;
  hoursSpent: number;
  notes: string;
};

type MilestoneItem = {
  id: string;
  text: string;
  done: boolean;
};

type TransferLog = {
  id: string;
  date: string;
  amount: number;
  sourceBreakdown: {
    sellStuff: number;
    freelance: number;
    youtube: number;
  };
  note: string;
  brlCredited: number;
};

type SideHustlesData = {
  sellItems: SellItem[];
  freelanceProjects: FreelanceProject[];
  servicePackages: ServicePackage[];
  youtubeVideos: YoutubeVideo[];
  youtubeMilestones: MilestoneItem[];
  youtubeIncome: number;
  transferLogs: TransferLog[];
};

type FinanceData = {
  netIncome: number;
  variableBudget: number;
  fixedCostItems: FixedCostItem[];
  fx: FxSettings;
  goals: Record<GoalKey, GoalState>;
  transactions: Transaction[];
  sideHustles: SideHustlesData;
};

const STORAGE_KEY = "personal-finance-dashboard-v1";

const SELL_STATUSES: SellStatus[] = ["Backlog", "Draft", "Listed", "Reserved", "Sold", "Shipped", "Paid"];
const FREELANCE_STATUSES: FreelanceStatus[] = ["Lead", "Negotiating", "InProgress", "Delivered", "Paid", "Testimonial"];
const VIDEO_STATUSES: VideoStatus[] = ["Idea", "Outline", "Filmed", "Edited", "Uploaded", "Published"];
const SERVICE_TYPES: ServiceType[] = ["FigurePolish", "RHelp", "SlidesUpgrade", "EnglishEdit", "Other"];

const GOAL_META: Record<GoalKey, { label: string; currency: "EUR" | "BRL" | "EUR/BRL" }> = {
  familyBRL: { label: "Family", currency: "EUR/BRL" },
  emergency: { label: "Emergency", currency: "EUR" },
  etf: { label: "ETF", currency: "EUR" },
};

const SAVINGS_SNAPSHOT = [
  { key: "bitpanda", label: "Bitpanda", amount: 1438, tone: "bg-amber-50 border-amber-200 text-amber-900" },
  {
    key: "revolut-flex",
    label: "Revolut Flexible Cash Funds",
    amount: 2288,
    tone: "bg-sky-50 border-sky-200 text-sky-900",
  },
  {
    key: "revolut-savings",
    label: "Revolut Savings Account",
    amount: 950,
    tone: "bg-emerald-50 border-emerald-200 text-emerald-900",
  },
];

const DEFAULT_DATA: FinanceData = {
  netIncome: 4500,
  variableBudget: 900,
  fixedCostItems: [
    { id: "rent", label: "Rent", amount: 1200 },
    { id: "utilities", label: "Utilities", amount: 250 },
    { id: "insurance", label: "Insurance", amount: 350 },
  ],
  fx: {
    eurToBrl: 5.4,
  },
  goals: {
    familyBRL: { target: 30000, current: 4500, monthlyContribution: 900 },
    emergency: { target: 10000, current: 2500, monthlyContribution: 300 },
    etf: { target: 20000, current: 3200, monthlyContribution: 500 },
  },
  transactions: [],
  sideHustles: buildSeedSideHustles(),
};

export default function FinancePage() {
  const [tab, setTab] = useState<MainTab>("dashboard");
  const [data, setData] = useState<FinanceData>(DEFAULT_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setData(sanitizeData(JSON.parse(raw)));
      } catch {
        setData(DEFAULT_DATA);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const fixedCostsTotal = useMemo(
    () => data.fixedCostItems.reduce((sum, item) => sum + item.amount, 0),
    [data.fixedCostItems],
  );

  const familyContributionEur = useMemo(
    () => convertBrlToEur(data.goals.familyBRL.monthlyContribution, data.fx.eurToBrl),
    [data.goals.familyBRL.monthlyContribution, data.fx.eurToBrl],
  );

  const totalGoalContributionEur = useMemo(
    () => familyContributionEur + data.goals.emergency.monthlyContribution + data.goals.etf.monthlyContribution,
    [familyContributionEur, data.goals.emergency.monthlyContribution, data.goals.etf.monthlyContribution],
  );

  const monthlyBalance = data.netIncome - fixedCostsTotal - data.variableBudget - totalGoalContributionEur;
  const weeklyAllowance = data.variableBudget / 4.33;

  const familyTimeline = useMemo(() => {
    const entries: Array<{ monthLabel: string; projected: number; progress: number }> = [];
    let projected = data.goals.familyBRL.current;
    const today = new Date();

    for (let month = 0; month < 12; month += 1) {
      const cursor = new Date(today.getFullYear(), today.getMonth() + month + 1, 1);
      projected += data.goals.familyBRL.monthlyContribution;
      entries.push({
        monthLabel: cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        projected,
        progress: safeProgress(projected, data.goals.familyBRL.target),
      });
    }
    return entries;
  }, [data.goals.familyBRL.current, data.goals.familyBRL.monthlyContribution, data.goals.familyBRL.target]);

  const txSummary = useMemo(() => summarizeTransactions(data.transactions), [data.transactions]);

  const updateSideHustles = (updater: (prev: SideHustlesData) => SideHustlesData) => {
    setData((prev) => ({
      ...prev,
      sideHustles: updater(prev.sideHustles),
    }));
  };

  const updateCoreNumber = (key: "netIncome" | "variableBudget", raw: string) => {
    setData((prev) => ({ ...prev, [key]: toNumber(raw) }));
  };

  const updateFxRate = (raw: string) => {
    setData((prev) => ({
      ...prev,
      fx: {
        ...prev.fx,
        eurToBrl: toPositiveNumber(raw, prev.fx.eurToBrl),
      },
    }));
  };

  const updateGoalNumber = (goal: GoalKey, field: keyof GoalState, raw: string) => {
    setData((prev) => ({
      ...prev,
      goals: {
        ...prev.goals,
        [goal]: { ...prev.goals[goal], [field]: toNumber(raw) },
      },
    }));
  };

  const updateFamilyGoalFromEur = (field: keyof GoalState, raw: string) => {
    setData((prev) => ({
      ...prev,
      goals: {
        ...prev.goals,
        familyBRL: {
          ...prev.goals.familyBRL,
          [field]: roundMoney(convertEurToBrl(toNumber(raw), prev.fx.eurToBrl)),
        },
      },
    }));
  };

  const updateFixedCostItem = (id: string, field: "label" | "amount", raw: string) => {
    setData((prev) => ({
      ...prev,
      fixedCostItems: prev.fixedCostItems.map((item) => {
        if (item.id !== id) return item;
        if (field === "label") return { ...item, label: raw };
        return { ...item, amount: toNumber(raw) };
      }),
    }));
  };

  const addFixedCostItem = () => {
    setData((prev) => ({
      ...prev,
      fixedCostItems: [...prev.fixedCostItems, { id: makeId("cost"), label: "", amount: 0 }],
    }));
  };

  const removeFixedCostItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      fixedCostItems: prev.fixedCostItems.filter((item) => item.id !== id),
    }));
  };

  const handleMarkTransferredToFamily = (amount: number, note: string, breakdown: TransferLog["sourceBreakdown"]) => {
    if (amount <= 0) {
      setNotice("Transfer amount must be greater than zero.");
      return;
    }

    setData((prev) => {
      const brlCredited = roundMoney(convertEurToBrl(amount, prev.fx.eurToBrl));
      return {
        ...prev,
        goals: {
          ...prev.goals,
          familyBRL: {
            ...prev.goals.familyBRL,
            current: roundMoney(prev.goals.familyBRL.current + brlCredited),
          },
        },
        sideHustles: {
          ...prev.sideHustles,
          transferLogs: [
            {
              id: makeId("transfer"),
              date: new Date().toISOString().slice(0, 10),
              amount: roundMoney(amount),
              sourceBreakdown: {
                sellStuff: roundMoney(breakdown.sellStuff),
                freelance: roundMoney(breakdown.freelance),
                youtube: roundMoney(breakdown.youtube),
              },
              note: note.trim(),
              brlCredited,
            },
            ...prev.sideHustles.transferLogs,
          ],
        },
      };
    });
    setNotice("Transfer logged and credited to Family goal.");
  };

  const handleExportJson = () => {
    const payload = JSON.stringify(data, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `finance-dashboard-${stamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Export complete.");
  };

  const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = await file.text();
      setData(sanitizeData(JSON.parse(raw)));
      setNotice("JSON imported.");
    } catch {
      setNotice("Could not import JSON file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleImportCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = await file.text();
      const imported = parseTransactions(raw);
      setData((prev) => ({ ...prev, transactions: imported }));
      setNotice(`Imported ${imported.length} transactions from CSV.`);
    } catch {
      setNotice("Could not parse CSV file.");
    } finally {
      event.target.value = "";
    }
  };

  const clearTransactions = () => {
    setData((prev) => ({ ...prev, transactions: [] }));
    setNotice("Imported transactions cleared.");
  };

  const extraIncomeStats = getExtraIncomeStats(data.sideHustles);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <Link href="/tools" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              ← Tools
            </Link>
            <h1 className="mt-1 text-xl font-semibold">Personal Finance Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button type="button" onClick={() => setTab("dashboard")} className={tabButtonClass(tab === "dashboard")}>
              Dashboard
            </button>
            <button type="button" onClick={() => setTab("automation")} className={tabButtonClass(tab === "automation")}>
              Automation plan
            </button>
            <button type="button" onClick={() => setTab("sideHustles")} className={tabButtonClass(tab === "sideHustles")}>
              Side Hustles
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
        {!hydrated ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading saved data...</div>
        ) : null}

        {notice ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</div>
        ) : null}

        {tab === "dashboard" ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Net Income" value={formatCurrency(data.netIncome, "EUR")} />
              <StatCard label="Monthly Spending Plan" value={formatCurrency(fixedCostsTotal + data.variableBudget, "EUR")} />
              <StatCard label="Monthly Goal Funding (EUR equiv.)" value={formatCurrency(totalGoalContributionEur, "EUR")} />
              <StatCard
                label={monthlyBalance >= 0 ? "Unallocated Cash" : "Monthly Shortfall"}
                value={formatCurrency(Math.abs(monthlyBalance), "EUR")}
                warning={monthlyBalance < 0}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {SAVINGS_SNAPSHOT.map((item) => (
                <div key={item.key} className={`rounded-xl border p-4 ${item.tone}`}>
                  <p className="text-xs uppercase tracking-wide opacity-75">Savings</p>
                  <p className="mt-1 text-sm font-medium">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{formatCurrency(item.amount, "EUR")}</p>
                </div>
              ))}
            </div>

            <ExtraIncomeSummaryWidget
              stats={extraIncomeStats}
              fxRate={data.fx.eurToBrl}
              familyGoal={data.goals.familyBRL}
              onMarkTransferred={handleMarkTransferredToFamily}
              transferLogs={data.sideHustles.transferLogs}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card title="Monthly Inputs">
                <div className="space-y-4">
                  <NumericInput
                    label="Net income (EUR)"
                    value={data.netIncome}
                    onChange={(value) => updateCoreNumber("netIncome", value)}
                  />
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-500">Fixed monthly costs total (auto sum)</p>
                    <p className="text-base font-semibold text-slate-900">{formatCurrency(fixedCostsTotal, "EUR")}</p>
                  </div>
                  <NumericInput
                    label="Variable monthly budget (EUR)"
                    value={data.variableBudget}
                    onChange={(value) => updateCoreNumber("variableBudget", value)}
                  />
                  <NumericInput
                    label="FX rate (1 EUR = ? BRL)"
                    value={data.fx.eurToBrl}
                    step="0.0001"
                    min={0.0001}
                    onChange={updateFxRate}
                  />
                  <p className="text-xs text-slate-500">
                    Weekly allowance rule preview: <strong>{formatCurrency(weeklyAllowance, "EUR")}</strong> per week.
                  </p>
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">Fixed monthly costs breakdown (EUR)</h3>
                    <button
                      type="button"
                      onClick={addFixedCostItem}
                      className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-100"
                    >
                      + Add line
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.fixedCostItems.length === 0 ? (
                      <p className="text-xs text-slate-500">No fixed-cost items yet. Add a line above.</p>
                    ) : (
                      data.fixedCostItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                          <label className="block">
                            <span className="mb-1 block text-xs text-slate-600">Item</span>
                            <input
                              type="text"
                              value={item.label}
                              placeholder="e.g. Rent"
                              onChange={(event) => updateFixedCostItem(item.id, "label", event.target.value)}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                            />
                          </label>
                          <NumericInput
                            label="Amount"
                            value={item.amount}
                            onChange={(value) => updateFixedCostItem(item.id, "amount", value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeFixedCostItem(item.id)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Goal Trackers" className="xl:col-span-2">
                <div className="space-y-5">
                  {(Object.keys(data.goals) as GoalKey[]).map((goalKey) => {
                    const meta = GOAL_META[goalKey];
                    const goal = data.goals[goalKey];
                    const progress = safeProgress(goal.current, goal.target);

                    if (goalKey === "familyBRL") {
                      const eurTarget = roundMoney(convertBrlToEur(goal.target, data.fx.eurToBrl));
                      const eurCurrent = roundMoney(convertBrlToEur(goal.current, data.fx.eurToBrl));
                      const eurMonthly = roundMoney(convertBrlToEur(goal.monthlyContribution, data.fx.eurToBrl));
                      return (
                        <div key={goalKey} className="rounded-xl border border-slate-200 p-4">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-medium">{meta.label} ({meta.currency})</h3>
                            <span className="text-sm text-slate-600">{Math.round(progress)}% complete</span>
                          </div>
                          <ProgressBar progress={progress} />
                          <div className="mt-3 grid grid-cols-1 gap-3">
                            <CurrencyPairInput
                              label="Target"
                              brlValue={goal.target}
                              eurValue={eurTarget}
                              onBrlChange={(value) => updateGoalNumber("familyBRL", "target", value)}
                              onEurChange={(value) => updateFamilyGoalFromEur("target", value)}
                            />
                            <CurrencyPairInput
                              label="Current"
                              brlValue={goal.current}
                              eurValue={eurCurrent}
                              onBrlChange={(value) => updateGoalNumber("familyBRL", "current", value)}
                              onEurChange={(value) => updateFamilyGoalFromEur("current", value)}
                            />
                            <CurrencyPairInput
                              label="Monthly contribution"
                              brlValue={goal.monthlyContribution}
                              eurValue={eurMonthly}
                              onBrlChange={(value) => updateGoalNumber("familyBRL", "monthlyContribution", value)}
                              onEurChange={(value) => updateFamilyGoalFromEur("monthlyContribution", value)}
                            />
                          </div>
                          <p className="mt-3 text-xs text-slate-500">
                            {formatCurrency(goal.current, "BRL")} ({formatCurrency(eurCurrent, "EUR")}) of {formatCurrency(goal.target, "BRL")} ({formatCurrency(eurTarget, "EUR")})
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={goalKey} className="rounded-xl border border-slate-200 p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-medium">{meta.label}</h3>
                          <span className="text-sm text-slate-600">{Math.round(progress)}% complete</span>
                        </div>
                        <ProgressBar progress={progress} />
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <NumericInput
                            label={`Target (${meta.currency})`}
                            value={goal.target}
                            onChange={(value) => updateGoalNumber(goalKey, "target", value)}
                          />
                          <NumericInput
                            label={`Current (${meta.currency})`}
                            value={goal.current}
                            onChange={(value) => updateGoalNumber(goalKey, "current", value)}
                          />
                          <NumericInput
                            label={`Monthly contribution (${meta.currency})`}
                            value={goal.monthlyContribution}
                            onChange={(value) => updateGoalNumber(goalKey, "monthlyContribution", value)}
                          />
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          {formatCurrency(goal.current, meta.currency as "EUR" | "BRL")} of {formatCurrency(goal.target, meta.currency as "EUR" | "BRL")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card title="Family BRL Timeline (12 months)" className="xl:col-span-2">
                <div className="mb-3 text-xs text-slate-500">Rate used: 1 EUR = {data.fx.eurToBrl.toFixed(4)} BRL</div>
                <div className="space-y-3">
                  {familyTimeline.map((entry) => (
                    <div key={entry.monthLabel} className="rounded-xl border border-slate-200 p-3">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{entry.monthLabel}</span>
                        <span>
                          {formatCurrency(entry.projected, "BRL")} / {formatCurrency(convertBrlToEur(entry.projected, data.fx.eurToBrl), "EUR")}
                        </span>
                      </div>
                      <ProgressBar progress={entry.progress} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Data Management">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="w-full rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                      Export JSON
                    </button>
                    <label className="block text-sm font-medium text-slate-700">Import JSON</label>
                    <input
                      type="file"
                      accept="application/json"
                      onChange={handleImportJson}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="mb-2 text-sm font-semibold">Optional CSV import (N26/Revolut)</h3>
                    <p className="mb-2 text-xs text-slate-500">Replaces current imported transactions with categorized rows.</p>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleImportCsv}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={clearTransactions}
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
                    >
                      Clear imported transactions
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Imported Transactions">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <StatCard label="Rows" value={String(txSummary.count)} small />
                <StatCard label="Income" value={formatCurrency(txSummary.income, "EUR")} small />
                <StatCard label="Expenses" value={formatCurrency(txSummary.expenses, "EUR")} small />
                <StatCard label="Net" value={formatCurrency(txSummary.net, "EUR")} warning={txSummary.net < 0} small />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold">Expense categories</h3>
                  <div className="space-y-2 text-sm">
                    {txSummary.categories.length === 0 ? (
                      <p className="text-slate-500">No CSV data imported yet.</p>
                    ) : (
                      txSummary.categories.map((item) => (
                        <div key={item.category} className="flex items-center justify-between">
                          <span className="text-slate-700">{item.category}</span>
                          <strong>{formatCurrency(item.amount, "EUR")}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2">Category</th>
                        <th className="px-3 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactions.slice(0, 120).map((tx) => (
                        <tr key={tx.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 text-slate-600">{tx.date || "-"}</td>
                          <td className="px-3 py-2">{tx.description || "-"}</td>
                          <td className="px-3 py-2 text-slate-600">{tx.category}</td>
                          <td className={["px-3 py-2 text-right font-medium", tx.amount < 0 ? "text-rose-700" : "text-emerald-700"].join(" ")}>
                            {formatCurrency(tx.amount, "EUR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </>
        ) : null}

        {tab === "automation" ? (
          <AutomationPlan
            fixedCosts={fixedCostsTotal}
            variableBudget={data.variableBudget}
            goals={data.goals}
            netIncome={data.netIncome}
            eurToBrl={data.fx.eurToBrl}
          />
        ) : null}

        {tab === "sideHustles" ? (
          <SideHustlesSection
            sideHustles={data.sideHustles}
            setSideHustles={(next) => updateSideHustles(() => next)}
            extraIncomeStats={extraIncomeStats}
            familyGoal={data.goals.familyBRL}
            fxRate={data.fx.eurToBrl}
            onMarkTransferred={handleMarkTransferredToFamily}
          />
        ) : null}
      </section>
    </main>
  );
}

function SideHustlesSection({
  sideHustles,
  setSideHustles,
  extraIncomeStats,
  familyGoal,
  fxRate,
  onMarkTransferred,
}: {
  sideHustles: SideHustlesData;
  setSideHustles: (value: SideHustlesData) => void;
  extraIncomeStats: ReturnType<typeof getExtraIncomeStats>;
  familyGoal: GoalState;
  fxRate: number;
  onMarkTransferred: (amount: number, note: string, breakdown: TransferLog["sourceBreakdown"]) => void;
}) {
  const [tab, setTab] = useState<SideHustlesTab>("sell");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
        <button type="button" className={tabButtonClass(tab === "sell")} onClick={() => setTab("sell")}>Sell Stuff</button>
        <button type="button" className={tabButtonClass(tab === "freelance")} onClick={() => setTab("freelance")}>Freelance Science Services</button>
        <button type="button" className={tabButtonClass(tab === "youtube")} onClick={() => setTab("youtube")}>YouTube Tracker</button>
      </div>

      <ExtraIncomeSummaryWidget
        stats={extraIncomeStats}
        fxRate={fxRate}
        familyGoal={familyGoal}
        onMarkTransferred={onMarkTransferred}
        transferLogs={sideHustles.transferLogs}
      />

      {tab === "sell" ? (
        <SellStuffModule
          items={sideHustles.sellItems}
          onChange={(sellItems) => setSideHustles({ ...sideHustles, sellItems })}
        />
      ) : null}

      {tab === "freelance" ? (
        <FreelanceModule
          projects={sideHustles.freelanceProjects}
          packages={sideHustles.servicePackages}
          onProjectsChange={(freelanceProjects) => setSideHustles({ ...sideHustles, freelanceProjects })}
          onPackagesChange={(servicePackages) => setSideHustles({ ...sideHustles, servicePackages })}
        />
      ) : null}

      {tab === "youtube" ? (
        <YouTubeModule
          videos={sideHustles.youtubeVideos}
          milestones={sideHustles.youtubeMilestones}
          youtubeIncome={sideHustles.youtubeIncome}
          onVideosChange={(youtubeVideos) => setSideHustles({ ...sideHustles, youtubeVideos })}
          onMilestonesChange={(youtubeMilestones) => setSideHustles({ ...sideHustles, youtubeMilestones })}
          onYoutubeIncomeChange={(youtubeIncome) => setSideHustles({ ...sideHustles, youtubeIncome })}
        />
      ) : null}
    </div>
  );
}

function SellStuffModule({ items, onChange }: { items: SellItem[]; onChange: (items: SellItem[]) => void }) {
  const [view, setView] = useState<"board" | "table">("board");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | SellStatus>("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  const monthKeys = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.listingDate) set.add(item.listingDate.slice(0, 7));
      if (item.soldDate) set.add(item.soldDate.slice(0, 7));
    }
    return [...set].sort().reverse();
  }, [items]);

  const platforms = useMemo(() => [...new Set(items.map((item) => item.platform).filter(Boolean))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (platformFilter !== "All" && item.platform !== platformFilter) return false;
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      if (monthFilter !== "All") {
        const listingKey = item.listingDate ? item.listingDate.slice(0, 7) : "";
        const soldKey = item.soldDate ? item.soldDate.slice(0, 7) : "";
        if (listingKey !== monthFilter && soldKey !== monthFilter) return false;
      }
      return true;
    });
  }, [items, platformFilter, statusFilter, monthFilter]);

  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const metrics = getSellMetrics(items);

  const addItem = () => {
    const next = [createSellItem(), ...items].map(recalcSellItem);
    onChange(next);
    setSelectedId(next[0]?.id ?? null);
  };

  const updateItem = (id: string, patch: Partial<SellItem>) => {
    onChange(items.map((item) => (item.id === id ? recalcSellItem({ ...item, ...patch }) : item)));
  };

  const updateChecklist = (id: string, key: keyof SellChecklist, checked: boolean) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              checklist: { ...item.checklist, [key]: checked },
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Listed this month" value={String(metrics.listedThisMonth)} small />
        <StatCard label="Sold this month" value={String(metrics.soldThisMonth)} small />
        <StatCard label="Net profit this month" value={formatCurrency(metrics.netProfitThisMonth, "EUR")} small />
        <StatCard label="Avg days-to-sell" value={metrics.avgDaysToSell > 0 ? `${metrics.avgDaysToSell.toFixed(1)} d` : "-"} small />
        <StatCard label="Backlog count" value={String(metrics.backlogCount)} small />
      </div>

      <Card title="Sell Stuff Controls">
        <div className="flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add item
          </button>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">View</span>
            <select
              value={view}
              onChange={(event) => setView(event.target.value as "board" | "table")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="board">Pipeline board</option>
              <option value="table">Table view</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">Platform</span>
            <select
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option>All</option>
              {platforms.map((platform) => (
                <option key={platform}>{platform}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "All" | SellStatus)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="All">All</option>
              {SELL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">Month</span>
            <select
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="All">All</option>
              {monthKeys.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {items.length === 0 ? <EmptyState text="No sell items yet. Use + Add item to start your pipeline." /> : null}

      {view === "board" ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {SELL_STATUSES.map((status) => {
              const columnItems = filteredItems.filter((item) => item.status === status);
              return (
                <div key={status} className="w-72 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{status}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{columnItems.length}</span>
                  </div>
                  <div className="space-y-2">
                    {columnItems.length === 0 ? (
                      <p className="text-xs text-slate-500">No items in this stage.</p>
                    ) : (
                      columnItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={[
                            "w-full rounded-lg border p-2 text-left",
                            selectedId === item.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <p className="text-sm font-medium">{item.name || "Untitled"}</p>
                          <p className="text-xs text-slate-500">{item.platform || "No platform"}</p>
                          <p className="mt-1 text-xs text-slate-600">Net: {formatCurrency(item.netProfit, "EUR")}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Platform</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">List date</th>
                <th className="px-3 py-2">Sold date</th>
                <th className="px-3 py-2">Ask</th>
                <th className="px-3 py-2">Sold</th>
                <th className="px-3 py-2">Net profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50" onClick={() => setSelectedId(item.id)}>
                  <td className="px-3 py-2">{item.name || "Untitled"}</td>
                  <td className="px-3 py-2">{item.platform || "-"}</td>
                  <td className="px-3 py-2">{item.status}</td>
                  <td className="px-3 py-2">{item.listingDate || "-"}</td>
                  <td className="px-3 py-2">{item.soldDate || "-"}</td>
                  <td className="px-3 py-2">{formatCurrency(item.askPrice, "EUR")}</td>
                  <td className="px-3 py-2">{formatCurrency(item.soldPrice, "EUR")}</td>
                  <td className="px-3 py-2">{formatCurrency(item.netProfit, "EUR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 ? <EmptyState text="No rows match the selected filters." compact /> : null}
        </div>
      )}

      {selectedItem ? (
        <Card title="Sell Item Editor">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <TextInput label="Name" value={selectedItem.name} onChange={(value) => updateItem(selectedItem.id, { name: value })} />
            <TextInput
              label="Category"
              value={selectedItem.category}
              onChange={(value) => updateItem(selectedItem.id, { category: value })}
            />
            <TextInput
              label="Platform"
              value={selectedItem.platform}
              onChange={(value) => updateItem(selectedItem.id, { platform: value })}
            />
            <SelectInput
              label="Status"
              value={selectedItem.status}
              options={SELL_STATUSES}
              onChange={(value) => updateItem(selectedItem.id, { status: value as SellStatus })}
            />
            <DateInput
              label="Listing date"
              value={selectedItem.listingDate}
              onChange={(value) => updateItem(selectedItem.id, { listingDate: value })}
            />
            <DateInput
              label="Sold date"
              value={selectedItem.soldDate}
              onChange={(value) => updateItem(selectedItem.id, { soldDate: value })}
            />
            <NumericInput
              label="Ask price"
              value={selectedItem.askPrice}
              onChange={(value) => updateItem(selectedItem.id, { askPrice: toNumber(value) })}
            />
            <NumericInput
              label="Sold price"
              value={selectedItem.soldPrice}
              onChange={(value) => updateItem(selectedItem.id, { soldPrice: toNumber(value) })}
            />
            <NumericInput
              label="Fees"
              value={selectedItem.fees}
              onChange={(value) => updateItem(selectedItem.id, { fees: toNumber(value) })}
            />
            <NumericInput
              label="Shipping cost"
              value={selectedItem.shippingCost}
              onChange={(value) => updateItem(selectedItem.id, { shippingCost: toNumber(value) })}
            />
            <NumericInput
              label="Packaging cost"
              value={selectedItem.packagingCost}
              onChange={(value) => updateItem(selectedItem.id, { packagingCost: toNumber(value) })}
            />
            <ReadOnlyInput label="Net profit (computed)" value={formatCurrency(selectedItem.netProfit, "EUR")} />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-3">
            <h3 className="mb-2 text-sm font-semibold">Checklist</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                ["photosDone", "Photos ready"],
                ["measurementsDone", "Measurements done"],
                ["titleDone", "Title written"],
                ["descriptionDone", "Description ready"],
                ["listingPosted", "Listing posted"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedItem.checklist[key as keyof SellChecklist]}
                    onChange={(event) => updateChecklist(selectedItem.id, key as keyof SellChecklist, event.target.checked)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <TextArea
              label="Notes"
              value={selectedItem.notes}
              onChange={(value) => updateItem(selectedItem.id, { notes: value })}
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => removeItem(selectedItem.id)}
              className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              Delete item
            </button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function FreelanceModule({
  projects,
  packages,
  onProjectsChange,
  onPackagesChange,
}: {
  projects: FreelanceProject[];
  packages: ServicePackage[];
  onProjectsChange: (projects: FreelanceProject[]) => void;
  onPackagesChange: (packages: ServicePackage[]) => void;
}) {
  const [view, setView] = useState<"pipeline" | "catalog" | "template">("pipeline");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id ?? null);

  const [templatePackageId, setTemplatePackageId] = useState<string>(packages[0]?.id ?? "");
  const [templatePrice, setTemplatePrice] = useState<string>("");
  const [templateClient, setTemplateClient] = useState("there");

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;
  const selectedPackage = packages.find((pkg) => pkg.id === templatePackageId) ?? null;

  const addProject = () => {
    const next = [createFreelanceProject(), ...projects].map(recalcFreelanceProject);
    onProjectsChange(next);
    setSelectedProjectId(next[0]?.id ?? null);
  };

  const updateProject = (id: string, patch: Partial<FreelanceProject>) => {
    onProjectsChange(projects.map((project) => (project.id === id ? recalcFreelanceProject({ ...project, ...patch }) : project)));
  };

  const removeProject = (id: string) => {
    const next = projects.filter((project) => project.id !== id);
    onProjectsChange(next);
    if (selectedProjectId === id) setSelectedProjectId(next[0]?.id ?? null);
  };

  const addPackage = () => {
    onPackagesChange([createServicePackage(), ...packages]);
  };

  const updatePackage = (id: string, patch: Partial<ServicePackage>) => {
    onPackagesChange(packages.map((pkg) => (pkg.id === id ? { ...pkg, ...patch } : pkg)));
  };

  const removePackage = (id: string) => {
    const next = packages.filter((pkg) => pkg.id !== id);
    onPackagesChange(next);
    if (templatePackageId === id) setTemplatePackageId(next[0]?.id ?? "");
  };

  const generated = useMemo(() => {
    if (!selectedPackage) return { offer: "", scope: "" };
    const price = toNumber(templatePrice) > 0 ? toNumber(templatePrice) : selectedPackage.defaultPrice;
    const offer = [
      `Hi ${templateClient || "there"},`,
      `I can deliver the ${selectedPackage.name} package for ${formatCurrency(price, "EUR")} with a turnaround of ${selectedPackage.turnaroundDays} days.`,
      `This includes up to ${selectedPackage.includedRevisions} revision round(s).`,
      "If this works for you, I can start immediately and share a timeline in the first update.",
    ].join(" ");
    const scope = [
      `Scope: ${selectedPackage.scopeLimits || "Defined in package details."}`,
      `Revisions included: ${selectedPackage.includedRevisions}`,
      "Any additional out-of-scope requests can be quoted separately before work starts.",
    ].join("\n");
    return { offer, scope };
  }, [selectedPackage, templatePrice, templateClient]);

  return (
    <div className="space-y-6">
      <Card title="Freelance Views">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={tabButtonClass(view === "pipeline")} onClick={() => setView("pipeline")}>Projects pipeline</button>
          <button type="button" className={tabButtonClass(view === "catalog")} onClick={() => setView("catalog")}>Service catalog</button>
          <button type="button" className={tabButtonClass(view === "template")} onClick={() => setView("template")}>Template generator</button>
        </div>
      </Card>

      {view === "pipeline" ? (
        <>
          <Card title="Projects Pipeline">
            <div className="mb-3">
              <button
                type="button"
                onClick={addProject}
                className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                + Add project
              </button>
            </div>

            {projects.length === 0 ? <EmptyState text="No freelance projects yet. Add your first lead." /> : null}

            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max gap-3">
                {FREELANCE_STATUSES.map((status) => {
                  const columnProjects = projects.filter((project) => project.status === status);
                  return (
                    <div key={status} className="w-72 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">{status}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{columnProjects.length}</span>
                      </div>
                      <div className="space-y-2">
                        {columnProjects.length === 0 ? (
                          <p className="text-xs text-slate-500">No projects in this stage.</p>
                        ) : (
                          columnProjects.map((project) => (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => setSelectedProjectId(project.id)}
                              className={[
                                "w-full rounded-lg border p-2 text-left",
                                selectedProjectId === project.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              <p className="text-sm font-medium">{project.clientName || "Unnamed client"}</p>
                              <p className="text-xs text-slate-500">{project.serviceType}</p>
                              <p className="mt-1 text-xs">Paid: {formatCurrency(project.paidAmount, "EUR")}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {selectedProject ? (
            <Card title="Project Editor">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <TextInput
                  label="Client name"
                  value={selectedProject.clientName}
                  onChange={(value) => updateProject(selectedProject.id, { clientName: value })}
                />
                <TextInput
                  label="Source"
                  value={selectedProject.source}
                  onChange={(value) => updateProject(selectedProject.id, { source: value })}
                />
                <SelectInput
                  label="Service type"
                  value={selectedProject.serviceType}
                  options={SERVICE_TYPES}
                  onChange={(value) => updateProject(selectedProject.id, { serviceType: value as ServiceType })}
                />
                <SelectInput
                  label="Status"
                  value={selectedProject.status}
                  options={FREELANCE_STATUSES}
                  onChange={(value) => updateProject(selectedProject.id, { status: value as FreelanceStatus })}
                />
                <NumericInput
                  label="Quote amount"
                  value={selectedProject.quoteAmount}
                  onChange={(value) => updateProject(selectedProject.id, { quoteAmount: toNumber(value) })}
                />
                <NumericInput
                  label="Paid amount"
                  value={selectedProject.paidAmount}
                  onChange={(value) => updateProject(selectedProject.id, { paidAmount: toNumber(value) })}
                />
                <DateInput
                  label="Deadline"
                  value={selectedProject.deadline}
                  onChange={(value) => updateProject(selectedProject.id, { deadline: value })}
                />
                <NumericInput
                  label="Hours spent"
                  value={selectedProject.hoursSpent}
                  onChange={(value) => updateProject(selectedProject.id, { hoursSpent: toNumber(value) })}
                />
                <ReadOnlyInput label="Effective rate (computed)" value={formatCurrency(selectedProject.effectiveRate, "EUR")} />
                <TextInput
                  label="Next action"
                  value={selectedProject.nextAction}
                  onChange={(value) => updateProject(selectedProject.id, { nextAction: value })}
                />
              </div>
              <div className="mt-4">
                <TextArea
                  label="Notes"
                  value={selectedProject.notes}
                  onChange={(value) => updateProject(selectedProject.id, { notes: value })}
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => removeProject(selectedProject.id)}
                  className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                >
                  Delete project
                </button>
              </div>
            </Card>
          ) : null}
        </>
      ) : null}

      {view === "catalog" ? (
        <Card title="Service Catalog">
          <div className="mb-3">
            <button
              type="button"
              onClick={addPackage}
              className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              + Add package
            </button>
          </div>
          {packages.length === 0 ? <EmptyState text="No package templates yet." /> : null}
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded-xl border border-slate-200 p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <TextInput label="Package name" value={pkg.name} onChange={(value) => updatePackage(pkg.id, { name: value })} />
                  <SelectInput
                    label="Service type"
                    value={pkg.serviceType}
                    options={SERVICE_TYPES}
                    onChange={(value) => updatePackage(pkg.id, { serviceType: value as ServiceType })}
                  />
                  <NumericInput
                    label="Default price"
                    value={pkg.defaultPrice}
                    onChange={(value) => updatePackage(pkg.id, { defaultPrice: toNumber(value) })}
                  />
                  <NumericInput
                    label="Turnaround (days)"
                    value={pkg.turnaroundDays}
                    step="1"
                    onChange={(value) => updatePackage(pkg.id, { turnaroundDays: Math.round(toNumber(value)) })}
                  />
                  <NumericInput
                    label="Included revisions"
                    value={pkg.includedRevisions}
                    step="1"
                    onChange={(value) => updatePackage(pkg.id, { includedRevisions: Math.round(toNumber(value)) })}
                  />
                </div>
                <div className="mt-3">
                  <TextArea
                    label="Scope limits"
                    value={pkg.scopeLimits}
                    onChange={(value) => updatePackage(pkg.id, { scopeLimits: value })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePackage(pkg.id)}
                  className="mt-3 rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                >
                  Delete package
                </button>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {view === "template" ? (
        <Card title="Template Generator">
          {packages.length === 0 ? (
            <EmptyState text="Create at least one package in Service Catalog to use template generation." />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <SelectInput
                  label="Package"
                  value={templatePackageId}
                  options={packages.map((pkg) => pkg.id)}
                  optionLabels={Object.fromEntries(packages.map((pkg) => [pkg.id, pkg.name]))}
                  onChange={setTemplatePackageId}
                />
                <NumericInput label="Custom price (optional)" value={toNumber(templatePrice)} onChange={setTemplatePrice} />
                <TextInput label="Client name" value={templateClient} onChange={setTemplateClient} />
              </div>
              <div className="mt-4 space-y-3">
                <TextArea label="Offer message" value={generated.offer} onChange={() => {}} readOnly />
                <TextArea label="Scope & revisions" value={generated.scope} onChange={() => {}} readOnly />
              </div>
            </>
          )}
        </Card>
      ) : null}
    </div>
  );
}

function YouTubeModule({
  videos,
  milestones,
  youtubeIncome,
  onVideosChange,
  onMilestonesChange,
  onYoutubeIncomeChange,
}: {
  videos: YoutubeVideo[];
  milestones: MilestoneItem[];
  youtubeIncome: number;
  onVideosChange: (videos: YoutubeVideo[]) => void;
  onMilestonesChange: (milestones: MilestoneItem[]) => void;
  onYoutubeIncomeChange: (youtubeIncome: number) => void;
}) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(videos[0]?.id ?? null);
  const selectedVideo = videos.find((video) => video.id === selectedVideoId) ?? null;

  const publishedThisMonth = useMemo(() => {
    const { start, end } = getCurrentMonthRange();
    return videos.filter((video) => video.status === "Published" && inDateRange(video.publishDate, start, end)).length;
  }, [videos]);

  const hoursThisMonth = useMemo(() => {
    const { start, end } = getCurrentMonthRange();
    return videos
      .filter((video) => inDateRange(video.publishDate, start, end))
      .reduce((sum, video) => sum + video.hoursSpent, 0);
  }, [videos]);

  const chartRows = useMemo(() => buildYouTubeChartRows(videos), [videos]);

  const addVideo = () => {
    const next = [createYouTubeVideo(), ...videos];
    onVideosChange(next);
    setSelectedVideoId(next[0]?.id ?? null);
  };

  const updateVideo = (id: string, patch: Partial<YoutubeVideo>) => {
    onVideosChange(videos.map((video) => (video.id === id ? { ...video, ...patch } : video)));
  };

  const removeVideo = (id: string) => {
    const next = videos.filter((video) => video.id !== id);
    onVideosChange(next);
    if (selectedVideoId === id) setSelectedVideoId(next[0]?.id ?? null);
  };

  const addMilestone = () => {
    onMilestonesChange([{ id: makeId("milestone"), text: "", done: false }, ...milestones]);
  };

  const updateMilestone = (id: string, patch: Partial<MilestoneItem>) => {
    onMilestonesChange(milestones.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeMilestone = (id: string) => {
    onMilestonesChange(milestones.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card title="YouTube Pipeline">
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={addVideo}
            className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add video
          </button>
          <NumericInput
            label="Optional YouTube income (EUR)"
            value={youtubeIncome}
            onChange={(value) => onYoutubeIncomeChange(toNumber(value))}
          />
        </div>

        {videos.length === 0 ? <EmptyState text="No videos yet. Add your first content item." /> : null}

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {VIDEO_STATUSES.map((status) => {
              const columnVideos = videos.filter((video) => video.status === status);
              return (
                <div key={status} className="w-72 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{status}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{columnVideos.length}</span>
                  </div>
                  <div className="space-y-2">
                    {columnVideos.length === 0 ? (
                      <p className="text-xs text-slate-500">No videos in this stage.</p>
                    ) : (
                      columnVideos.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => setSelectedVideoId(video.id)}
                          className={[
                            "w-full rounded-lg border p-2 text-left",
                            selectedVideoId === video.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <p className="text-sm font-medium">{video.title || "Untitled"}</p>
                          <p className="text-xs text-slate-500">{video.format}</p>
                          <p className="mt-1 text-xs">Hours: {video.hoursSpent.toFixed(1)}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {selectedVideo ? (
        <Card title="Video Editor">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <TextInput label="Title" value={selectedVideo.title} onChange={(value) => updateVideo(selectedVideo.id, { title: value })} />
            <SelectInput
              label="Format"
              value={selectedVideo.format}
              options={["Long", "Short"]}
              onChange={(value) => updateVideo(selectedVideo.id, { format: value as VideoFormat })}
            />
            <SelectInput
              label="Status"
              value={selectedVideo.status}
              options={VIDEO_STATUSES}
              onChange={(value) => updateVideo(selectedVideo.id, { status: value as VideoStatus })}
            />
            <DateInput
              label="Publish date"
              value={selectedVideo.publishDate}
              onChange={(value) => updateVideo(selectedVideo.id, { publishDate: value })}
            />
            <TextInput
              label="URL"
              value={selectedVideo.url}
              onChange={(value) => updateVideo(selectedVideo.id, { url: value })}
            />
            <NumericInput
              label="Hours spent"
              value={selectedVideo.hoursSpent}
              onChange={(value) => updateVideo(selectedVideo.id, { hoursSpent: toNumber(value) })}
            />
            <TextInput
              label="Tags (comma separated)"
              value={selectedVideo.tags.join(", ")}
              onChange={(value) =>
                updateVideo(selectedVideo.id, {
                  tags: value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div className="mt-4">
            <TextArea label="Notes" value={selectedVideo.notes} onChange={(value) => updateVideo(selectedVideo.id, { notes: value })} />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => removeVideo(selectedVideo.id)}
              className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              Delete video
            </button>
          </div>
        </Card>
      ) : null}

      <Card title="Monthly Metrics">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatCard label="Videos published (this month)" value={String(publishedThisMonth)} />
          <StatCard label="Hours spent (this month)" value={`${hoursThisMonth.toFixed(1)} h`} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <MiniBarChart title="Published videos (last 6 months)" rows={chartRows.map((row) => ({ label: row.label, value: row.published }))} />
          <MiniBarChart title="Hours spent (last 6 months)" rows={chartRows.map((row) => ({ label: row.label, value: row.hours }))} />
        </div>
      </Card>

      <Card title="Milestones Checklist">
        <div className="mb-3">
          <button
            type="button"
            onClick={addMilestone}
            className="rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Add milestone
          </button>
        </div>
        {milestones.length === 0 ? <EmptyState text="No milestones yet." compact /> : null}
        <div className="space-y-2">
          {milestones.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-2">
              <input
                type="checkbox"
                checked={item.done}
                onChange={(event) => updateMilestone(item.id, { done: event.target.checked })}
              />
              <input
                type="text"
                value={item.text}
                onChange={(event) => updateMilestone(item.id, { text: event.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Milestone"
              />
              <button
                type="button"
                onClick={() => removeMilestone(item.id)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ExtraIncomeSummaryWidget({
  stats,
  fxRate,
  familyGoal,
  onMarkTransferred,
  transferLogs,
}: {
  stats: ReturnType<typeof getExtraIncomeStats>;
  fxRate: number;
  familyGoal: GoalState;
  onMarkTransferred: (amount: number, note: string, breakdown: TransferLog["sourceBreakdown"]) => void;
  transferLogs: TransferLog[];
}) {
  const [amountText, setAmountText] = useState("");
  const [note, setNote] = useState("");

  const transferredTotal = useMemo(
    () => transferLogs.reduce((sum, row) => sum + row.amount, 0),
    [transferLogs],
  );
  const availableToTransfer = Math.max(0, stats.total - transferredTotal);

  const familyRemainingBrl = Math.max(0, familyGoal.target - familyGoal.current);
  const familyRemainingEur = convertBrlToEur(familyRemainingBrl, fxRate);

  const handleTransfer = () => {
    const amount = toNumber(amountText) || availableToTransfer;
    if (amount <= 0) return;
    const bounded = Math.min(amount, availableToTransfer);
    onMarkTransferred(bounded, note, {
      sellStuff: stats.sellPaid,
      freelance: stats.freelancePaid,
      youtube: stats.youtubeIncome,
    });
    setAmountText("");
    setNote("");
  };

  return (
    <Card title="Extra Income Summary">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="SellStuff net profit (Paid)" value={formatCurrency(stats.sellPaid, "EUR")} />
        <StatCard label="Freelance paidAmount (Paid)" value={formatCurrency(stats.freelancePaid, "EUR")} />
        <StatCard label="YouTube income" value={formatCurrency(stats.youtubeIncome, "EUR")} />
        <StatCard label="Total extra income" value={formatCurrency(stats.total, "EUR")} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Family Goal Impact</p>
          <p className="mt-2 text-sm text-slate-700">Transferred so far: <strong>{formatCurrency(transferredTotal, "EUR")}</strong></p>
          <p className="mt-1 text-sm text-slate-700">Available to transfer: <strong>{formatCurrency(availableToTransfer, "EUR")}</strong></p>
          <p className="mt-1 text-sm text-slate-700">
            Remaining Family target now: <strong>{formatCurrency(familyRemainingBrl, "BRL")}</strong> ({formatCurrency(familyRemainingEur, "EUR")})
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold">Mark transferred to Family Goal</h3>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <NumericInput
              label="Amount (EUR)"
              value={toNumber(amountText) || 0}
              onChange={setAmountText}
            />
            <TextInput label="Note" value={note} onChange={setNote} placeholder="Optional note" />
          </div>
          <button
            type="button"
            onClick={handleTransfer}
            className="mt-3 rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Mark transferred to Family Goal
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Source breakdown</th>
              <th className="px-3 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {transferLogs.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2">{formatCurrency(row.amount, "EUR")}</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  Sell {formatCurrency(row.sourceBreakdown.sellStuff, "EUR")}, Freelance {formatCurrency(row.sourceBreakdown.freelance, "EUR")}, YT {formatCurrency(row.sourceBreakdown.youtube, "EUR")}
                </td>
                <td className="px-3 py-2">{row.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transferLogs.length === 0 ? <EmptyState text="No transfer log entries yet." compact /> : null}
      </div>
    </Card>
  );
}

function AutomationPlan({
  fixedCosts,
  variableBudget,
  goals,
  netIncome,
  eurToBrl,
}: {
  fixedCosts: number;
  variableBudget: number;
  goals: Record<GoalKey, GoalState>;
  netIncome: number;
  eurToBrl: number;
}) {
  const familyMonthlyBrl = goals.familyBRL.monthlyContribution;
  const familyMonthlyEur = convertBrlToEur(familyMonthlyBrl, eurToBrl);
  const totalGoalsEur = familyMonthlyEur + goals.emergency.monthlyContribution + goals.etf.monthlyContribution;
  const weekly = variableBudget / 4.33;
  const monthlyBuffer = netIncome - fixedCosts - variableBudget - totalGoalsEur;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card title="N26 Spaces setup">
        <ul className="space-y-2 text-sm text-slate-700">
          <li>Fixed Costs Space: {formatCurrency(fixedCosts, "EUR")}</li>
          <li>Everyday Spending Space: {formatCurrency(variableBudget, "EUR")}</li>
          <li>
            Family BRL Space: {formatCurrency(familyMonthlyBrl, "BRL")} ({formatCurrency(familyMonthlyEur, "EUR")})
          </li>
          <li>Emergency Space: {formatCurrency(goals.emergency.monthlyContribution, "EUR")}</li>
          <li>ETF Cash Space: {formatCurrency(goals.etf.monthlyContribution, "EUR")}</li>
        </ul>
      </Card>

      <Card title="Income Sorter amounts">
        <ul className="space-y-2 text-sm text-slate-700">
          <li>On payday move {formatCurrency(fixedCosts, "EUR")} to Fixed Costs Space.</li>
          <li>Move {formatCurrency(variableBudget, "EUR")} to Everyday Spending Space.</li>
          <li>Move {formatCurrency(familyMonthlyBrl, "BRL")} ({formatCurrency(familyMonthlyEur, "EUR")}) to Family BRL Space.</li>
          <li>Move {formatCurrency(goals.emergency.monthlyContribution, "EUR")} to Emergency Space.</li>
          <li>Move {formatCurrency(goals.etf.monthlyContribution, "EUR")} to ETF Cash Space.</li>
          <li>
            {monthlyBuffer >= 0
              ? `Leave ${formatCurrency(monthlyBuffer, "EUR")} as monthly buffer.`
              : `Reduce budgets by ${formatCurrency(Math.abs(monthlyBuffer), "EUR")} to avoid overspending.`}
          </li>
        </ul>
      </Card>

      <Card title="Weekly allowance rule">
        <p className="text-sm text-slate-700">
          Keep the card budget to <strong>{formatCurrency(weekly, "EUR")}</strong> per week ({formatCurrency(variableBudget, "EUR")} per month).
        </p>
        <p className="mt-2 text-xs text-slate-500">Suggested rule: every Monday, reset the week budget and move leftovers into Emergency Space.</p>
      </Card>

      <Card title="Broker ETF Sparplan amount">
        <p className="text-sm text-slate-700">
          Set broker ETF Sparplan to <strong>{formatCurrency(goals.etf.monthlyContribution, "EUR")}</strong> monthly.
        </p>
        <p className="mt-2 text-xs text-slate-500">Trigger date suggestion: 2-4 business days after salary credit to avoid timing failures.</p>
      </Card>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 ${className}`}>
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyState({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div className={compact ? "p-3 text-sm text-slate-500" : "rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500"}>
      {text}
    </div>
  );
}

function StatCard({
  label,
  value,
  warning = false,
  small = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className={small ? "text-xs text-slate-500" : "text-sm text-slate-500"}>{label}</p>
      <p className={["mt-1 font-semibold", small ? "text-lg" : "text-xl", warning ? "text-rose-700" : ""].join(" ")}>{value}</p>
    </div>
  );
}

function NumericInput({
  label,
  value,
  onChange,
  min = 0,
  step = "0.01",
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  min?: number;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
  optionLabels,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  optionLabels?: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}

function ReadOnlyInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function CurrencyPairInput({
  label,
  brlValue,
  eurValue,
  onBrlChange,
  onEurChange,
}: {
  label: string;
  brlValue: number;
  eurValue: number;
  onBrlChange: (value: string) => void;
  onEurChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <h4 className="mb-2 text-sm font-medium text-slate-700">{label}</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumericInput label="BRL" value={roundMoney(brlValue)} onChange={onBrlChange} />
        <NumericInput label="EUR" value={roundMoney(eurValue)} onChange={onEurChange} />
      </div>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const width = Math.max(0, Math.min(progress, 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}

function MiniBarChart({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[48px_1fr_70px] items-center gap-2 text-xs">
            <span className="text-slate-600">{row.label}</span>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-slate-700" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
            <span className="text-right text-slate-700">{row.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCurrency(value: number, currency: "EUR" | "BRL"): string {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function toNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function toPositiveNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function safeProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.max(0, Math.min((current / target) * 100, 100));
}

function tabButtonClass(active: boolean): string {
  return [
    "rounded-lg px-3 py-1.5 text-sm font-medium",
    active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200",
  ].join(" ");
}

function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

function convertBrlToEur(brl: number, eurToBrl: number): number {
  if (!Number.isFinite(eurToBrl) || eurToBrl <= 0) return 0;
  return brl / eurToBrl;
}

function convertEurToBrl(eur: number, eurToBrl: number): number {
  if (!Number.isFinite(eurToBrl) || eurToBrl <= 0) return 0;
  return eur * eurToBrl;
}

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseFlexibleNumber(raw: string): number {
  const value = raw.trim();
  if (!value) return Number.NaN;
  const stripped = value.replace(/[^\d,.-]/g, "");
  const lastComma = stripped.lastIndexOf(",");
  const lastDot = stripped.lastIndexOf(".");
  let normalized = stripped;

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) {
      normalized = stripped.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = stripped.replace(/,/g, "");
    }
  } else if (lastComma > -1 && lastDot === -1) {
    normalized = stripped.replace(",", ".");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/\s+/g, " ").trim();
}

function findHeaderIndex(headers: string[], aliases: string[]): number {
  for (const alias of aliases) {
    const exact = headers.indexOf(alias);
    if (exact >= 0) return exact;
    const fuzzy = headers.findIndex((header) => header.includes(alias));
    if (fuzzy >= 0) return fuzzy;
  }
  return -1;
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ",") {
      row.push(field.trim());
      field = "";
      continue;
    }
    if (char === "\n") {
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (char === "\r") continue;
    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }
  return rows;
}

function categorize(description: string, amount: number): string {
  if (amount > 0) return "Income";
  const text = description.toLowerCase();
  if (/(rent|miete|aluguel|landlord)/.test(text)) return "Housing";
  if (/(lidl|aldi|carrefour|supermarket|grocery|mercado)/.test(text)) return "Groceries";
  if (/(uber|bolt|bus|train|metro|fuel|gasoline)/.test(text)) return "Transport";
  if (/(electric|water|internet|phone|mobile|netflix|spotify|prime)/.test(text)) return "Utilities/Subscriptions";
  if (/(restaurant|cafe|coffee|bar|delivery|amazon|shopping)/.test(text)) return "Lifestyle";
  if (/(broker|trade republic|scalable|etf|degiro)/.test(text)) return "Investments";
  return "Other";
}

function parseTransactions(csvText: string): Transaction[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => normalizeHeader(header));
  const body = rows.slice(1);
  const dateIndex = findHeaderIndex(headers, ["date", "completed date", "created date", "booking date"]);
  const amountIndex = findHeaderIndex(headers, ["amount", "amount (eur)", "charged amount", "value"]);
  const descriptionIndex = findHeaderIndex(headers, ["payee", "description", "merchant", "payment reference", "reference", "counterparty"]);
  const typeIndex = findHeaderIndex(headers, ["type", "transaction type", "state", "cash flow"]);

  if (amountIndex < 0) return [];

  const parsed: Transaction[] = [];
  for (let i = 0; i < body.length; i += 1) {
    const row = body[i];
    const amountRaw = row[amountIndex] ?? "";
    let amount = parseFlexibleNumber(amountRaw);
    if (!Number.isFinite(amount)) continue;

    const description = (descriptionIndex >= 0 ? row[descriptionIndex] : "")?.trim() ?? "";
    const date = (dateIndex >= 0 ? row[dateIndex] : "")?.trim() ?? "";
    const flowType = (typeIndex >= 0 ? row[typeIndex] : "")?.toLowerCase() ?? "";

    if (amount > 0 && /(card|cash|debit|payment|withdrawal|transfer out|outgoing)/.test(flowType)) {
      amount = -amount;
    }
    if (amount < 0 && /(salary|incoming|credit|refund|transfer in)/.test(flowType)) {
      amount = Math.abs(amount);
    }

    parsed.push({
      id: `${i}-${Math.random().toString(36).slice(2, 8)}`,
      date,
      description,
      amount,
      category: categorize(description, amount),
    });
  }

  return parsed;
}

function summarizeTransactions(transactions: Transaction[]) {
  const summary = {
    count: transactions.length,
    income: 0,
    expenses: 0,
    net: 0,
    categories: [] as Array<{ category: string; amount: number }>,
  };
  const byCategory = new Map<string, number>();

  for (const tx of transactions) {
    summary.net += tx.amount;
    if (tx.amount >= 0) {
      summary.income += tx.amount;
    } else {
      const expenseValue = Math.abs(tx.amount);
      summary.expenses += expenseValue;
      byCategory.set(tx.category, (byCategory.get(tx.category) ?? 0) + expenseValue);
    }
  }

  summary.categories = [...byCategory.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  return summary;
}

function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

function inDateRange(dateText: string, start: Date, end: Date): boolean {
  if (!dateText) return false;
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return false;
  return date >= start && date <= end;
}

function daysBetween(startText: string, endText: string): number {
  if (!startText || !endText) return 0;
  const start = new Date(startText);
  const end = new Date(endText);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getSellMetrics(items: SellItem[]) {
  const { start, end } = getCurrentMonthRange();
  const listedThisMonth = items.filter((item) => inDateRange(item.listingDate, start, end)).length;
  const soldThisMonth = items.filter((item) => inDateRange(item.soldDate, start, end)).length;
  const netProfitThisMonth = items
    .filter((item) => inDateRange(item.soldDate, start, end))
    .reduce((sum, item) => sum + item.netProfit, 0);
  const soldItems = items.filter((item) => item.listingDate && item.soldDate);
  const avgDaysToSell =
    soldItems.length > 0
      ? soldItems.reduce((sum, item) => sum + daysBetween(item.listingDate, item.soldDate), 0) / soldItems.length
      : 0;
  const backlogCount = items.filter((item) => item.status === "Backlog").length;

  return {
    listedThisMonth,
    soldThisMonth,
    netProfitThisMonth: roundMoney(netProfitThisMonth),
    avgDaysToSell,
    backlogCount,
  };
}

function getExtraIncomeStats(sideHustles: SideHustlesData) {
  const sellPaid = roundMoney(
    sideHustles.sellItems
      .filter((item) => item.status === "Paid")
      .reduce((sum, item) => sum + item.netProfit, 0),
  );
  const freelancePaid = roundMoney(
    sideHustles.freelanceProjects
      .filter((project) => project.status === "Paid")
      .reduce((sum, project) => sum + project.paidAmount, 0),
  );
  const youtubeIncome = roundMoney(sideHustles.youtubeIncome);

  return {
    sellPaid,
    freelancePaid,
    youtubeIncome,
    total: roundMoney(sellPaid + freelancePaid + youtubeIncome),
  };
}

function buildYouTubeChartRows(videos: YoutubeVideo[]) {
  const rows: Array<{ label: string; published: number; hours: number }> = [];
  const now = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
    const label = monthDate.toLocaleDateString("en-US", { month: "short" });
    const published = videos.filter((video) => video.status === "Published" && inDateRange(video.publishDate, start, end)).length;
    const hours = videos.filter((video) => inDateRange(video.publishDate, start, end)).reduce((sum, video) => sum + video.hoursSpent, 0);
    rows.push({ label, published, hours: roundMoney(hours) });
  }

  return rows;
}

function createSellItem(): SellItem {
  return recalcSellItem({
    id: makeId("sell"),
    name: "",
    category: "",
    platform: "Vinted",
    status: "Backlog",
    listingDate: "",
    soldDate: "",
    askPrice: 0,
    soldPrice: 0,
    fees: 0,
    shippingCost: 0,
    packagingCost: 0,
    netProfit: 0,
    notes: "",
    checklist: {
      photosDone: false,
      measurementsDone: false,
      titleDone: false,
      descriptionDone: false,
      listingPosted: false,
    },
  });
}

function recalcSellItem(item: SellItem): SellItem {
  const netProfit = roundMoney(item.soldPrice - item.fees - item.shippingCost - item.packagingCost);
  return { ...item, netProfit };
}

function createFreelanceProject(): FreelanceProject {
  return recalcFreelanceProject({
    id: makeId("project"),
    clientName: "",
    source: "",
    serviceType: "FigurePolish",
    status: "Lead",
    quoteAmount: 0,
    paidAmount: 0,
    deadline: "",
    hoursSpent: 0,
    effectiveRate: 0,
    notes: "",
    nextAction: "",
  });
}

function recalcFreelanceProject(project: FreelanceProject): FreelanceProject {
  const baseAmount = project.paidAmount > 0 ? project.paidAmount : project.quoteAmount;
  const effectiveRate = project.hoursSpent > 0 ? roundMoney(baseAmount / project.hoursSpent) : 0;
  return { ...project, effectiveRate };
}

function createServicePackage(): ServicePackage {
  return {
    id: makeId("package"),
    name: "",
    serviceType: "Other",
    defaultPrice: 0,
    turnaroundDays: 7,
    includedRevisions: 1,
    scopeLimits: "",
  };
}

function createYouTubeVideo(): YoutubeVideo {
  return {
    id: makeId("video"),
    title: "",
    format: "Long",
    status: "Idea",
    tags: [],
    publishDate: "",
    url: "",
    hoursSpent: 0,
    notes: "",
  };
}

function buildSeedSideHustles(): SideHustlesData {
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 12);
  const lastMonth = lastMonthDate.toISOString().slice(0, 10);

  const seedSell: SellItem[] = [
    recalcSellItem({
      id: makeId("sell"),
      name: "Vintage blazer",
      category: "Clothing",
      platform: "Vinted",
      status: "Paid",
      listingDate: `${thisMonth}-02`,
      soldDate: `${thisMonth}-05`,
      askPrice: 75,
      soldPrice: 70,
      fees: 5,
      shippingCost: 6,
      packagingCost: 1.5,
      netProfit: 0,
      notes: "Fast sale.",
      checklist: { photosDone: true, measurementsDone: true, titleDone: true, descriptionDone: true, listingPosted: true },
    }),
    recalcSellItem({
      id: makeId("sell"),
      name: "Desk lamp",
      category: "Home",
      platform: "Wallapop",
      status: "Listed",
      listingDate: `${thisMonth}-07`,
      soldDate: "",
      askPrice: 28,
      soldPrice: 0,
      fees: 0,
      shippingCost: 0,
      packagingCost: 0,
      netProfit: 0,
      notes: "Need better photos",
      checklist: { photosDone: true, measurementsDone: true, titleDone: true, descriptionDone: false, listingPosted: true },
    }),
    recalcSellItem({
      id: makeId("sell"),
      name: "Camera strap",
      category: "Accessories",
      platform: "Vinted",
      status: "Backlog",
      listingDate: "",
      soldDate: "",
      askPrice: 20,
      soldPrice: 0,
      fees: 0,
      shippingCost: 0,
      packagingCost: 0,
      netProfit: 0,
      notes: "Clean item first",
      checklist: { photosDone: false, measurementsDone: false, titleDone: false, descriptionDone: false, listingPosted: false },
    }),
  ];

  const seedProjects: FreelanceProject[] = [
    recalcFreelanceProject({
      id: makeId("project"),
      clientName: "Lab group A",
      source: "LinkedIn",
      serviceType: "FigurePolish",
      status: "InProgress",
      quoteAmount: 220,
      paidAmount: 0,
      deadline: `${thisMonth}-20`,
      hoursSpent: 3,
      effectiveRate: 0,
      notes: "Revise 2 figures and legend consistency.",
      nextAction: "Send first draft tomorrow",
    }),
    recalcFreelanceProject({
      id: makeId("project"),
      clientName: "PhD candidate B",
      source: "Referral",
      serviceType: "EnglishEdit",
      status: "Paid",
      quoteAmount: 150,
      paidAmount: 150,
      deadline: `${thisMonth}-08`,
      hoursSpent: 2.5,
      effectiveRate: 0,
      notes: "Abstract + cover letter edit.",
      nextAction: "Ask for testimonial",
    }),
    recalcFreelanceProject({
      id: makeId("project"),
      clientName: "Startup C",
      source: "Upwork",
      serviceType: "SlidesUpgrade",
      status: "Negotiating",
      quoteAmount: 340,
      paidAmount: 0,
      deadline: lastMonth,
      hoursSpent: 0,
      effectiveRate: 0,
      notes: "Waiting budget confirmation.",
      nextAction: "Follow up Monday",
    }),
  ];

  const seedPackages: ServicePackage[] = [
    {
      id: makeId("package"),
      name: "Figure Polish Basic",
      serviceType: "FigurePolish",
      defaultPrice: 180,
      turnaroundDays: 5,
      includedRevisions: 1,
      scopeLimits: "Up to 3 figures, style consistency, minor annotation cleanup.",
    },
    {
      id: makeId("package"),
      name: "R Help Sprint",
      serviceType: "RHelp",
      defaultPrice: 140,
      turnaroundDays: 3,
      includedRevisions: 1,
      scopeLimits: "Up to 2 scripts, debugging + reproducibility checks.",
    },
    {
      id: makeId("package"),
      name: "Slides Upgrade",
      serviceType: "SlidesUpgrade",
      defaultPrice: 220,
      turnaroundDays: 4,
      includedRevisions: 2,
      scopeLimits: "Up to 20 slides, layout and visual hierarchy improvements.",
    },
  ];

  const seedVideos: YoutubeVideo[] = [
    {
      id: makeId("video"),
      title: "How I plan science side hustles",
      format: "Long",
      status: "Published",
      tags: ["science", "freelance", "productivity"],
      publishDate: `${thisMonth}-04`,
      url: "",
      hoursSpent: 6,
      notes: "Good retention in first 30s.",
    },
    {
      id: makeId("video"),
      title: "Quick grant figure tip",
      format: "Short",
      status: "Edited",
      tags: ["tips", "figures"],
      publishDate: `${thisMonth}-11`,
      url: "",
      hoursSpent: 2,
      notes: "Need caption pass.",
    },
    {
      id: makeId("video"),
      title: "R plotting mistakes",
      format: "Long",
      status: "Outline",
      tags: ["R", "dataviz"],
      publishDate: "",
      url: "",
      hoursSpent: 1,
      notes: "Add 3 practical examples.",
    },
  ];

  const seedMilestones: MilestoneItem[] = [
    { id: makeId("milestone"), text: "Publish 4 videos this month", done: false },
    { id: makeId("milestone"), text: "Batch script 3 Shorts", done: false },
    { id: makeId("milestone"), text: "Create new thumbnail template", done: true },
  ];

  return {
    sellItems: seedSell,
    freelanceProjects: seedProjects,
    servicePackages: seedPackages,
    youtubeVideos: seedVideos,
    youtubeMilestones: seedMilestones,
    youtubeIncome: 0,
    transferLogs: [],
  };
}

function asSellStatus(value: unknown): SellStatus {
  return SELL_STATUSES.includes(value as SellStatus) ? (value as SellStatus) : "Backlog";
}

function asServiceType(value: unknown): ServiceType {
  return SERVICE_TYPES.includes(value as ServiceType) ? (value as ServiceType) : "Other";
}

function asFreelanceStatus(value: unknown): FreelanceStatus {
  return FREELANCE_STATUSES.includes(value as FreelanceStatus) ? (value as FreelanceStatus) : "Lead";
}

function asVideoStatus(value: unknown): VideoStatus {
  return VIDEO_STATUSES.includes(value as VideoStatus) ? (value as VideoStatus) : "Idea";
}

function asVideoFormat(value: unknown): VideoFormat {
  return value === "Short" ? "Short" : "Long";
}

function sanitizeData(raw: unknown): FinanceData {
  const fallback = DEFAULT_DATA;
  if (!raw || typeof raw !== "object") return fallback;

  const data = raw as Partial<FinanceData> & {
    fixedCosts?: number;
    sideHustles?: Partial<SideHustlesData>;
  };

  const goals = data.goals as Partial<Record<GoalKey, Partial<GoalState>>> | undefined;

  const fixedCostItems = Array.isArray(data.fixedCostItems)
    ? data.fixedCostItems
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const typed = item as Partial<FixedCostItem>;
          return {
            id: String(typed.id ?? makeId("cost")),
            label: String(typed.label ?? ""),
            amount: Number.isFinite(typed.amount) ? Number(typed.amount) : 0,
          };
        })
        .filter((item): item is FixedCostItem => item !== null)
    : Number.isFinite(data.fixedCosts)
      ? [{ id: makeId("cost"), label: "Fixed costs", amount: Number(data.fixedCosts) }]
      : fallback.fixedCostItems;

  const transactions = Array.isArray(data.transactions)
    ? data.transactions
        .map((tx) => {
          if (!tx || typeof tx !== "object") return null;
          const typed = tx as Partial<Transaction>;
          return {
            id: String(typed.id ?? makeId("tx")),
            date: String(typed.date ?? ""),
            description: String(typed.description ?? ""),
            amount: Number.isFinite(typed.amount) ? Number(typed.amount) : 0,
            category: String(typed.category ?? "Other"),
          };
        })
        .filter((tx): tx is Transaction => tx !== null)
    : fallback.transactions;

  const side = data.sideHustles;

  const sellItems = Array.isArray(side?.sellItems)
    ? side.sellItems
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const typed = item as Partial<SellItem>;
          const checklistRaw = typed.checklist as Partial<SellChecklist> | undefined;
          return recalcSellItem({
            id: String(typed.id ?? makeId("sell")),
            name: String(typed.name ?? ""),
            category: String(typed.category ?? ""),
            platform: String(typed.platform ?? ""),
            status: asSellStatus(typed.status),
            listingDate: String(typed.listingDate ?? ""),
            soldDate: String(typed.soldDate ?? ""),
            askPrice: Number.isFinite(typed.askPrice) ? Number(typed.askPrice) : 0,
            soldPrice: Number.isFinite(typed.soldPrice) ? Number(typed.soldPrice) : 0,
            fees: Number.isFinite(typed.fees) ? Number(typed.fees) : 0,
            shippingCost: Number.isFinite(typed.shippingCost) ? Number(typed.shippingCost) : 0,
            packagingCost: Number.isFinite(typed.packagingCost) ? Number(typed.packagingCost) : 0,
            netProfit: Number.isFinite(typed.netProfit) ? Number(typed.netProfit) : 0,
            notes: String(typed.notes ?? ""),
            checklist: {
              photosDone: Boolean(checklistRaw?.photosDone),
              measurementsDone: Boolean(checklistRaw?.measurementsDone),
              titleDone: Boolean(checklistRaw?.titleDone),
              descriptionDone: Boolean(checklistRaw?.descriptionDone),
              listingPosted: Boolean(checklistRaw?.listingPosted),
            },
          });
        })
        .filter((item): item is SellItem => item !== null)
    : fallback.sideHustles.sellItems;

  const freelanceProjects = Array.isArray(side?.freelanceProjects)
    ? side.freelanceProjects
        .map((project) => {
          if (!project || typeof project !== "object") return null;
          const typed = project as Partial<FreelanceProject>;
          return recalcFreelanceProject({
            id: String(typed.id ?? makeId("project")),
            clientName: String(typed.clientName ?? ""),
            source: String(typed.source ?? ""),
            serviceType: asServiceType(typed.serviceType),
            status: asFreelanceStatus(typed.status),
            quoteAmount: Number.isFinite(typed.quoteAmount) ? Number(typed.quoteAmount) : 0,
            paidAmount: Number.isFinite(typed.paidAmount) ? Number(typed.paidAmount) : 0,
            deadline: String(typed.deadline ?? ""),
            hoursSpent: Number.isFinite(typed.hoursSpent) ? Number(typed.hoursSpent) : 0,
            effectiveRate: Number.isFinite(typed.effectiveRate) ? Number(typed.effectiveRate) : 0,
            notes: String(typed.notes ?? ""),
            nextAction: String(typed.nextAction ?? ""),
          });
        })
        .filter((project): project is FreelanceProject => project !== null)
    : fallback.sideHustles.freelanceProjects;

  const servicePackages = Array.isArray(side?.servicePackages)
    ? side.servicePackages
        .map((pkg) => {
          if (!pkg || typeof pkg !== "object") return null;
          const typed = pkg as Partial<ServicePackage>;
          return {
            id: String(typed.id ?? makeId("package")),
            name: String(typed.name ?? ""),
            serviceType: asServiceType(typed.serviceType),
            defaultPrice: Number.isFinite(typed.defaultPrice) ? Number(typed.defaultPrice) : 0,
            turnaroundDays: Number.isFinite(typed.turnaroundDays) ? Number(typed.turnaroundDays) : 7,
            includedRevisions: Number.isFinite(typed.includedRevisions) ? Number(typed.includedRevisions) : 1,
            scopeLimits: String(typed.scopeLimits ?? ""),
          };
        })
        .filter((pkg): pkg is ServicePackage => pkg !== null)
    : fallback.sideHustles.servicePackages;

  const youtubeVideos = Array.isArray(side?.youtubeVideos)
    ? side.youtubeVideos
        .map((video) => {
          if (!video || typeof video !== "object") return null;
          const typed = video as Partial<YoutubeVideo>;
          return {
            id: String(typed.id ?? makeId("video")),
            title: String(typed.title ?? ""),
            format: asVideoFormat(typed.format),
            status: asVideoStatus(typed.status),
            tags: Array.isArray(typed.tags) ? typed.tags.map((tag) => String(tag)) : [],
            publishDate: String(typed.publishDate ?? ""),
            url: String(typed.url ?? ""),
            hoursSpent: Number.isFinite(typed.hoursSpent) ? Number(typed.hoursSpent) : 0,
            notes: String(typed.notes ?? ""),
          };
        })
        .filter((video): video is YoutubeVideo => video !== null)
    : fallback.sideHustles.youtubeVideos;

  const youtubeMilestones = Array.isArray(side?.youtubeMilestones)
    ? side.youtubeMilestones
        .map((milestone) => {
          if (!milestone || typeof milestone !== "object") return null;
          const typed = milestone as Partial<MilestoneItem>;
          return {
            id: String(typed.id ?? makeId("milestone")),
            text: String(typed.text ?? ""),
            done: Boolean(typed.done),
          };
        })
        .filter((item): item is MilestoneItem => item !== null)
    : fallback.sideHustles.youtubeMilestones;

  const transferLogs = Array.isArray(side?.transferLogs)
    ? side.transferLogs
        .map((log) => {
          if (!log || typeof log !== "object") return null;
          const typed = log as Partial<TransferLog>;
          const breakdown = typed.sourceBreakdown as Partial<TransferLog["sourceBreakdown"]> | undefined;
          return {
            id: String(typed.id ?? makeId("transfer")),
            date: String(typed.date ?? ""),
            amount: Number.isFinite(typed.amount) ? Number(typed.amount) : 0,
            sourceBreakdown: {
              sellStuff: Number.isFinite(breakdown?.sellStuff) ? Number(breakdown?.sellStuff) : 0,
              freelance: Number.isFinite(breakdown?.freelance) ? Number(breakdown?.freelance) : 0,
              youtube: Number.isFinite(breakdown?.youtube) ? Number(breakdown?.youtube) : 0,
            },
            note: String(typed.note ?? ""),
            brlCredited: Number.isFinite(typed.brlCredited) ? Number(typed.brlCredited) : 0,
          };
        })
        .filter((log): log is TransferLog => log !== null)
    : fallback.sideHustles.transferLogs;

  const eurToBrl = Number.isFinite(data.fx?.eurToBrl) && Number(data.fx?.eurToBrl) > 0 ? Number(data.fx?.eurToBrl) : fallback.fx.eurToBrl;

  return {
    netIncome: Number.isFinite(data.netIncome) ? Number(data.netIncome) : fallback.netIncome,
    variableBudget: Number.isFinite(data.variableBudget) ? Number(data.variableBudget) : fallback.variableBudget,
    fixedCostItems,
    fx: { eurToBrl },
    goals: {
      familyBRL: {
        target: Number.isFinite(goals?.familyBRL?.target) ? Number(goals?.familyBRL?.target) : fallback.goals.familyBRL.target,
        current: Number.isFinite(goals?.familyBRL?.current) ? Number(goals?.familyBRL?.current) : fallback.goals.familyBRL.current,
        monthlyContribution: Number.isFinite(goals?.familyBRL?.monthlyContribution)
          ? Number(goals?.familyBRL?.monthlyContribution)
          : fallback.goals.familyBRL.monthlyContribution,
      },
      emergency: {
        target: Number.isFinite(goals?.emergency?.target) ? Number(goals?.emergency?.target) : fallback.goals.emergency.target,
        current: Number.isFinite(goals?.emergency?.current) ? Number(goals?.emergency?.current) : fallback.goals.emergency.current,
        monthlyContribution: Number.isFinite(goals?.emergency?.monthlyContribution)
          ? Number(goals?.emergency?.monthlyContribution)
          : fallback.goals.emergency.monthlyContribution,
      },
      etf: {
        target: Number.isFinite(goals?.etf?.target) ? Number(goals?.etf?.target) : fallback.goals.etf.target,
        current: Number.isFinite(goals?.etf?.current) ? Number(goals?.etf?.current) : fallback.goals.etf.current,
        monthlyContribution: Number.isFinite(goals?.etf?.monthlyContribution)
          ? Number(goals?.etf?.monthlyContribution)
          : fallback.goals.etf.monthlyContribution,
      },
    },
    transactions,
    sideHustles: {
      sellItems,
      freelanceProjects,
      servicePackages,
      youtubeVideos,
      youtubeMilestones,
      youtubeIncome: Number.isFinite(side?.youtubeIncome) ? Number(side?.youtubeIncome) : fallback.sideHustles.youtubeIncome,
      transferLogs,
    },
  };
}
