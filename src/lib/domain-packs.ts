export interface KpiChipConfig {
  label: string;
  id: string;
  sub: string;
  status?: 'ok' | 'warn' | 'err' | 'neutral';
}

export interface DomainPackLabels {
  periodTitle: string;
  periodSub: string;
  kpiChips: KpiChipConfig[];
  rcTitle: string;
  rcLabelA: string;
  rcLabelB: string;
  rcTakeaway: string;
  contribTitle: string;
  progressionTitle: string;
  bucketTitle: string;
  detailTitle: string;
  detailNarrative: string;
}

export interface DomainPack {
  domain: string;
  labels: DomainPackLabels;
}

export const GENERIC_PACK: DomainPack = {
  domain: 'generic',
  labels: {
    periodTitle: 'Period Detail',
    periodSub: 'Time progression & distribution breakdown',
    kpiChips: [
      { label: 'Volume', id: 'ddVol', sub: 'Total records' },
      { label: 'Completed', id: 'ddHandled', sub: 'Processed' },
      { label: 'Target Met', id: 'ddCompliance', sub: 'Within threshold', status: 'ok' },
      { label: 'Exceptions', id: 'ddBreaches', sub: 'Out of bounds', status: 'err' },
    ],
    rcTitle: 'Segment Breakdown',
    rcLabelA: 'Primary Segment',
    rcLabelB: 'Secondary Segment',
    rcTakeaway: 'Operational takeaway summary',
    contribTitle: 'Active Contributors / Entities',
    progressionTitle: 'Metric Progression',
    bucketTitle: 'Interval Breakdown — Click bar for detail',
    detailTitle: 'Interval Detail',
    detailNarrative: 'Select a column above to inspect operational drivers.',
  },
};

export const SERVICE_OPS_PACK: DomainPack = {
  domain: 'service-ops',
  labels: {
    periodTitle: 'Date Detail',
    periodSub: 'Intraday progression & root cause breakdown',
    kpiChips: [
      { label: 'Volume', id: 'ddVol', sub: 'Total records' },
      { label: 'Completed', id: 'ddHandled', sub: 'Handled' },
      { label: 'Compliance', id: 'ddCompliance', sub: 'Within SLA/target', status: 'ok' },
      { label: 'Breaches / Drops', id: 'ddBreaches', sub: 'Out of SLA', status: 'err' },
    ],
    rcTitle: 'Root Cause Breakdown',
    rcLabelA: 'Primary Delay',
    rcLabelB: 'Secondary / Drop',
    rcTakeaway: 'Operational takeaway summary',
    contribTitle: 'Active Contributors / Entities',
    progressionTitle: 'Intraday Metric Progression',
    bucketTitle: 'Hourly Breakdown — Click bar for detail',
    detailTitle: 'Hour Detail',
    detailNarrative: 'Select an hourly column above to inspect operational drivers.',
  },
};

export const SALES_DISTRIBUTION_PACK: DomainPack = {
  domain: 'sales-distribution',
  labels: {
    periodTitle: 'Order Fulfillment Detail',
    periodSub: 'Dispatch progression & delivery breakdown',
    kpiChips: [
      { label: 'Total Orders', id: 'ddVol', sub: 'Gross orders' },
      { label: 'Fulfilled', id: 'ddHandled', sub: 'Delivered' },
      { label: 'On-Time In-Full', id: 'ddCompliance', sub: 'OTIF target', status: 'ok' },
      { label: 'Exceptions', id: 'ddBreaches', sub: 'Delayed / Damaged', status: 'err' },
    ],
    rcTitle: 'Exception Breakdown',
    rcLabelA: 'Delay',
    rcLabelB: 'Shortage / Damage',
    rcTakeaway: 'Fulfillment exception takeaway',
    contribTitle: 'Top Hubs & Carriers',
    progressionTitle: 'Dispatch Progression',
    bucketTitle: 'Time Window Breakdown — Click bar for detail',
    detailTitle: 'Window Detail',
    detailNarrative: 'Select a time window above to inspect fulfillment performance.',
  },
};

export const DOMAIN_PACKS: Record<string, DomainPack> = {
  'generic': GENERIC_PACK,
  'service-ops': SERVICE_OPS_PACK,
  'sales-distribution': SALES_DISTRIBUTION_PACK,
};

export function getDomainPack(domain?: string, customLabels?: Partial<DomainPackLabels>): DomainPack {
  const base = (domain && DOMAIN_PACKS[domain.toLowerCase()]) || GENERIC_PACK;
  if (!customLabels) {
    return base;
  }
  return {
    domain: base.domain,
    labels: {
      ...base.labels,
      ...customLabels,
    },
  };
}
