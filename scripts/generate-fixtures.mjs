import fs from 'node:fs';
import path from 'node:path';

const fixturesDir = path.resolve('test/fixtures');
fs.mkdirSync(fixturesDir, { recursive: true });

// 1. sales_distribution.csv (~500 rows)
const districts = ['Nagpur', 'Amravati', 'Wardha', 'Chandrapur', 'Yavatmal', 'Bhandara', 'Gondia', 'Akola'];
const channels = ['Retailer', 'Distributor', 'Direct', 'Supermarket', 'Wholesale'];
const skus = ['SKU-101', 'SKU-204', 'SKU-309', 'SKU-402', 'SKU-505', 'SKU-612'];
const statuses = ['Delivered', 'Delivered', 'Delivered', 'Partial', 'Returned', 'Cancelled'];
const reasons = ['', '', '', 'Damaged in transit', 'Stockout at warehouse', 'Customer unavailable', 'Address incomplete'];

const salesRows = [
  'Order_ID,Order_Date,District,Channel,SKU,Ordered_Units,Delivered_Units,Unit_Price,Ordered_Value,Delivered_Value,Status,Issue_Reason,Customer_Rating,Delivery_Distance_KM'
];

for (let i = 1; i <= 500; i++) {
  const id = `ORD-${String(i).padStart(4, '0')}`;
  const day = (i % 28) + 1;
  const month = (i % 3) + 1;
  const date = `2026-0${month}-${String(day).padStart(2, '0')}`;
  const dist = districts[i % districts.length];
  const chan = channels[i % channels.length];
  const sku = skus[i % skus.length];
  const orderedUnits = (i % 20) + 5;
  const status = statuses[i % statuses.length];
  let deliveredUnits = orderedUnits;
  let reason = '';
  if (status === 'Partial') {
    deliveredUnits = Math.floor(orderedUnits * 0.6);
    reason = reasons[3 + (i % 4)];
  } else if (status === 'Returned' || status === 'Cancelled') {
    deliveredUnits = 0;
    reason = reasons[3 + (i % 4)];
  }
  const unitPrice = 120 + (i % 8) * 15;
  const orderedVal = orderedUnits * unitPrice;
  const deliveredVal = deliveredUnits * unitPrice;
  const rating = (3.0 + (i % 21) * 0.1).toFixed(1);
  const distance = (12.5 + (i % 40) * 1.8).toFixed(1);

  salesRows.push(`${id},${date},${dist},${chan},${sku},${orderedUnits},${deliveredUnits},${unitPrice},${orderedVal},${deliveredVal},${status},"${reason}",${rating},${distance}`);
}
fs.writeFileSync(path.join(fixturesDir, 'sales_distribution.csv'), salesRows.join('\n'), 'utf8');

// 2. service_ops.csv (~400 rows)
const queues = ['Billing & Invoicing', 'Technical Support', 'Order Tracking', 'Returns & Refunds', 'Enterprise VIP'];
const agents = ['Aarav Patel', 'Priya Sharma', 'Rohan Gupta', 'Neha Deshmukh', 'Vikram Singh', 'Ananya Iyer'];
const outcomes = ['Resolved First Contact', 'Escalated Tier 2', 'Resolved Follow-up', 'Customer Abandoned'];

const opsRows = [
  'Ticket_ID,Timestamp,Queue,Agent,Duration_Seconds,Wait_Time_Seconds,Outcome,SLA_Breach_Flag'
];

for (let i = 1; i <= 400; i++) {
  const id = `TCK-${String(i).padStart(4, '0')}`;
  const day = (i % 28) + 1;
  const hour = 8 + (i % 12);
  const min = (i * 7) % 60;
  const sec = (i * 13) % 60;
  const time = `2026-03-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}Z`;
  const queue = queues[i % queues.length];
  const agent = agents[i % agents.length];
  const duration = 90 + (i % 50) * 18;
  const wait = 10 + (i % 30) * 12;
  const outcome = outcomes[i % outcomes.length];
  const breach = duration > 600 || wait > 180 ? 'TRUE' : 'FALSE';

  opsRows.push(`${id},${time},"${queue}","${agent}",${duration},${wait},"${outcome}",${breach}`);
}
fs.writeFileSync(path.join(fixturesDir, 'service_ops.csv'), opsRows.join('\n'), 'utf8');

// 3. edge_cases.csv
// BOM + quoted commas, quoted newlines, apostrophes & quotes in category values, empty strings, dd/mm/yyyy, bad date, non-numeric
const edgeRows = [
  'Item_ID,Date,Store_Name,Category,Amount,Notes',
  '1,01/03/2026,"O\'Neil ""Main"" Store",Electronics,1200.50,"Simple note"',
  '2,15/03/2026,"Quick Mart, Downtown",Groceries,45.00,"Quoted, comma note"',
  '3,20/03/2026,"Metro Station Kiosk","Multi\nLine\nCategory",99.90,"Note with\nembedded\nnewline"',
  '4,25/03/2026,"Corner Shop","","15.00","Empty category"',
  '5,invalid-date,"Boutique Outlet",Fashion,250.00,"Bad date test"',
  '6,28/03/2026,"Super Depot",Home,"N/A","Non-numeric amount row"'
];
// Prepend UTF-8 BOM \uFEFF
const bomContent = '\uFEFF' + edgeRows.join('\n');
fs.writeFileSync(path.join(fixturesDir, 'edge_cases.csv'), bomContent, 'utf8');

// 4. edge_cases_semicolon.csv
const semicolonRows = [
  'Item_ID;Date;Store_Name;Category;Amount;Notes',
  '1;01/03/2026;Store A;Electronics;1200;Note 1',
  '2;02/03/2026;Store B;Groceries;45;Note 2',
  '3;03/03/2026;Store C;Home;80;Note 3'
];
fs.writeFileSync(path.join(fixturesDir, 'edge_cases_semicolon.csv'), semicolonRows.join('\n'), 'utf8');

console.log('Test fixtures created successfully in test/fixtures/');
