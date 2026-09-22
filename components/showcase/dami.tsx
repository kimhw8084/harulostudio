"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShowcaseFoot, ShowcaseShell, clampInt, formatMoney } from "./shared";
import { centsToDollars, dollarsToCents } from "@/lib/publishing/money";

type Month = "September" | "August";
const monthData: Record<Month, { budget: number; categories: Record<string, number>; recurring: { label: string; amount: number }[] }> = {
  September: { budget: 240000, categories: { Food: 28400, Travel: 12200, Home: 16800 }, recurring: [{ label: "Rent", amount: 90000 }, { label: "Phone", amount: 4200 }] },
  August: { budget: 240000, categories: { Food: 31200, Home: 19400, Other: 8600 }, recurring: [{ label: "Rent", amount: 90000 }, { label: "Phone", amount: 4200 }, { label: "Books", amount: 2200 }] },
};

export function DamiSpecimen() {
  const [month, setMonth] = useState<Month>("September");
  const [category, setCategory] = useState("Food");
  const [allocation, setAllocation] = useState(30000);
  const data = monthData[month];
  const spent = Object.values(data.categories).reduce((sum, value) => sum + value, 0);
  const recurring = data.recurring.reduce((sum, item) => sum + item.amount, 0);
  const allocated = clampInt(allocation, 0, data.budget);
  const remaining = data.budget - spent - recurring - allocated;
  const rows = useMemo(() => Object.entries(data.categories), [data]);
  const reset = () => { setMonth("September"); setCategory("Food"); setAllocation(30000); };
  return (
    <ShowcaseShell name="Dami">
      <p className="concept-title">The everyday, added up.</p>
      <p className="showcase-note">Sample financial data only. No financial advice or account connection.</p>
      <div className="weather-switches" aria-label="Sample month">
        {(Object.keys(monthData) as Month[]).map((value) => <Button key={value} type="button" variant="ghost" aria-pressed={month === value} onClick={() => { setMonth(value); setCategory(Object.keys(monthData[value].categories)[0]); setAllocation(30000); }}>{value}</Button>)}
      </div>
      <label className="showcase-select-label" htmlFor="dami-category">Category</label>
      <select id="dami-category" value={category} onChange={(event) => setCategory(event.target.value)}>{Object.keys(data.categories).map((value) => <option key={value}>{value}</option>)}</select>
      <label className="showcase-select-label" htmlFor="dami-allocation">Editable allocation</label>
      <input id="dami-allocation" type="number" min="0" max={centsToDollars(data.budget)} step="1" value={centsToDollars(allocation)} onChange={(event) => setAllocation(clampInt(dollarsToCents(Number(event.target.value) || 0), 0, data.budget))} />
      <div className="dami-totals"><div><span>Budget</span><strong>{formatMoney(data.budget)}</strong></div><div><span>Spent</span><strong>{formatMoney(spent)}</strong></div><div><span>Recurring</span><strong>{formatMoney(recurring)}</strong></div><div data-state={remaining < 0 ? "over" : "ok"}><span>Remaining</span><strong>{formatMoney(remaining)}</strong>{remaining < 0 ? <small>Overallocated in sample data</small> : <small>Available after planned items</small>}</div></div>
      <table className="showcase-table"><caption>{month} sample categories and recurring items</caption><thead><tr><th scope="col">Category</th><th scope="col">Amount</th></tr></thead><tbody>{rows.map(([name, value]) => <tr key={name} data-selected={name === category}><th scope="row">{name}</th><td>{formatMoney(value)}</td></tr>)}{data.recurring.map((item) => <tr key={item.label}><th scope="row">Recurring · {item.label}</th><td>{formatMoney(item.amount)}</td></tr>)}</tbody></table>
      <div className="dami-chart" aria-label="Category spending chart">{rows.map(([name, value]) => <div key={name}><span>{name}</span><i style={{ width: `${Math.min(100, (value / Math.max(...Object.values(data.categories))) * 100)}%` }} /><strong>{formatMoney(value)}</strong></div>)}</div>
      <ShowcaseFoot onReset={reset} />
    </ShowcaseShell>
  );
}
