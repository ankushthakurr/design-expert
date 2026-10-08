/** Pure ROI formulas used by the calculators. All assumptions are explicit and conservative. */

export type VoiceInput = { callsPerDay: number; missedPerDay: number; avgSale: number; conversionRate: number; staffCost: number; daysPerMonth: number };

export const VOICE_ASSUMPTIONS = { aiAnswerRate: 0.9, newBusinessShare: 0.6, aiHandledShare: 0.4, minutesPerCall: 4 };

export function voiceROI(i: VoiceInput) {
  const missedMonth = i.missedPerDay * i.daysPerMonth;
  const recoveredCalls = missedMonth * VOICE_ASSUMPTIONS.aiAnswerRate;
  const recoveredLeads = recoveredCalls * VOICE_ASSUMPTIONS.newBusinessShare;
  const newCustomers = recoveredLeads * (i.conversionRate / 100);
  const monthly = newCustomers * i.avgSale;
  const totalCalls = i.callsPerDay * i.daysPerMonth;
  const supportHours = ((totalCalls - missedMonth) * VOICE_ASSUMPTIONS.aiHandledShare * VOICE_ASSUMPTIONS.minutesPerCall) / 60 + (recoveredCalls * VOICE_ASSUMPTIONS.minutesPerCall) / 60;
  const staffHourly = i.staffCost / 208; // 26 days × 8h
  const staffTimeValue = supportHours * staffHourly;
  const missRate = i.callsPerDay ? (i.missedPerDay / i.callsPerDay) * 100 : 0;
  const ramp = [0.5, 0.75, 0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  let cum = 0;
  const cumulative = ramp.map((r) => (cum += monthly * r));
  return { missedMonth, recoveredCalls, recoveredLeads, newCustomers, monthly, annual: monthly * 12, supportHours, staffTimeValue, missRate, cumulative, afterHoursCoverage: 24 * 30 - i.daysPerMonth * 9 };
}

export function websiteROI(i: { visitors: number; currentCR: number; improvedCR: number; leadToCustomer: number; avgSale: number; investment: number }) {
  const currentLeads = i.visitors * (i.currentCR / 100);
  const newLeads = i.visitors * (i.improvedCR / 100);
  const extraLeads = newLeads - currentLeads;
  const extraRevenueMonthly = extraLeads * (i.leadToCustomer / 100) * i.avgSale;
  const annual = extraRevenueMonthly * 12;
  return { currentLeads, newLeads, extraLeads, extraRevenueMonthly, annual, roi: i.investment ? ((annual - i.investment) / i.investment) * 100 : 0, paybackMonths: extraRevenueMonthly ? i.investment / extraRevenueMonthly : Infinity };
}

export function marketingROI(i: { adSpend: number; cpc: number; landingCR: number; closeRate: number; avgSale: number; mgmtFee: number }) {
  const clicks = i.cpc ? i.adSpend / i.cpc : 0;
  const leads = clicks * (i.landingCR / 100);
  const customers = leads * (i.closeRate / 100);
  const revenue = customers * i.avgSale;
  const cost = i.adSpend + i.mgmtFee;
  return { clicks, leads, customers, revenue, cost, cpl: leads ? i.adSpend / leads : 0, cac: customers ? cost / customers : 0, roas: i.adSpend ? revenue / i.adSpend : 0, roi: cost ? ((revenue - cost) / cost) * 100 : 0 };
}

export function automationROI(i: { staff: number; hoursPerWeek: number; automatablePct: number; hourlyCost: number; investment: number }) {
  const hoursSavedMonth = i.staff * i.hoursPerWeek * 4.33 * (i.automatablePct / 100);
  const monthlySavings = hoursSavedMonth * i.hourlyCost;
  const annual = monthlySavings * 12;
  return { hoursSavedMonth, monthlySavings, annual, roi: i.investment ? ((annual - i.investment) / i.investment) * 100 : 0, paybackMonths: monthlySavings ? i.investment / monthlySavings : Infinity, productivityGain: i.hoursPerWeek ? (i.automatablePct * i.hoursPerWeek) / 40 : 0 };
}

export function leadGenROI(i: { leads: number; responseNowMins: number; contactRateNow: number; closeRate: number; avgSale: number }) {
  // Faster response improves contact rate; conservative uplift model capped at 90% contact.
  const speedFactor = i.responseNowMins <= 5 ? 1 : i.responseNowMins <= 60 ? 1.35 : i.responseNowMins <= 24 * 60 ? 1.7 : 2.1;
  const contactAfter = Math.min(90, i.contactRateNow * speedFactor);
  const customersNow = i.leads * (i.contactRateNow / 100) * (i.closeRate / 100);
  const customersAfter = i.leads * (contactAfter / 100) * (i.closeRate / 100);
  const extraCustomers = customersAfter - customersNow;
  return { contactAfter, customersNow, customersAfter, extraCustomers, extraRevenueMonthly: extraCustomers * i.avgSale, annual: extraCustomers * i.avgSale * 12 };
}

export function savingsCalc(i: { tasks: { name: string; hoursPerWeek: number; people: number; automatable: number }[]; hourlyCost: number }) {
  const rows = i.tasks.map((t) => {
    const hours = t.hoursPerWeek * t.people * 4.33 * (t.automatable / 100);
    return { ...t, hoursSaved: hours, moneySaved: hours * i.hourlyCost };
  });
  const totalHours = rows.reduce((s, r) => s + r.hoursSaved, 0);
  const totalWeeklyHours = i.tasks.reduce((s, t) => s + t.hoursPerWeek * t.people, 0);
  const people = Math.max(1, Math.max(...i.tasks.map((t) => t.people)));
  return {
    rows,
    totalHours,
    monthlySavings: totalHours * i.hourlyCost,
    annualSavings: totalHours * i.hourlyCost * 12,
    productivity: (totalHours / (people * 173)) * 100,
    efficiency: totalWeeklyHours ? (rows.reduce((s, r) => s + r.hoursSaved, 0) / (totalWeeklyHours * 4.33)) * 100 : 0,
  };
}
