import {
  useDocxExport, createMultiSectionDocument, createTheme, createNumberingConfig,
  coverPage, toc, richParagraph, callout, advancedTable,
  p, table,
  HeadingLevel, AlignmentType, PageBreak, Paragraph, TextRun, PageNumber,
} from '@skills/docx-export.jsx';
import { Button } from '@components/ui/button';
import { FileText } from 'lucide-react';
import { Spinner } from '@components/ui/spinner';

export default function ComplianceDocExport({ aggregates }) {
  const { exportToDocx, isExporting } = useDocxExport();

  const handleExport = () => {
    const agg = aggregates;
    const t = agg?.totals || {};
    const c = agg?.counts || {};
    const r = agg?.rates || {};
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const theme = createTheme({
      primary: '0A2E5C',
      secondary: '1A5276',
      accent: '0EA5E9',
      neutral: '1E293B',
      font: 'Calibri'
    });

    const legalNum = createNumberingConfig('outline');

    const cover = coverPage({
      title: 'IT Portfolio Compliance Dashboard',
      subtitle: 'Workflow & Score Calculation Reference Document',
      author: 'TRA IT Department',
      date: today,
      colors: { primary: '0A2E5C' }
    });

    const bodyChildren = buildDocumentBody(theme, legalNum, t, c, r, today);

    const doc = createMultiSectionDocument({
      title: 'IT Portfolio Compliance Dashboard — Workflow Document',
      styles: theme.styles,
      numbering: { config: [...(theme.numbering?.config || []), ...legalNum.config] },
      features: { updateFields: true },
      pageNumbers: true,
      sections: [
        cover,
        { children: bodyChildren }
      ]
    });

    exportToDocx(doc, `IT_Compliance_Workflow_${new Date().toISOString().split('T')[0]}.docx`);
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="h-7 px-2 text-xs"
      disabled={isExporting || !aggregates}
    >
      {isExporting ? <Spinner size="sm" className="mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
      Export Workflow
    </Button>
  );
}

function buildDocumentBody(theme, legalNum, t, c, r, today) {
  const children = [];

  // Table of Contents
  children.push(...toc({ heading: 'Table of Contents', maxLevel: 3, hyperlink: true }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── Section 1: Document Purpose ───
  children.push(p('1. Document Purpose & Scope', { heading: HeadingLevel.HEADING_1 }));
  children.push(p('This document serves as the official reference guide for the IT Portfolio Hub Compliance Dashboard. It describes the methodology behind each compliance metric, identifies the exact board columns used as data sources, and outlines the aggregation workflow that transforms raw monday.com board data into executive-level compliance scores.'));
  children.push(p(''));
  children.push(callout('This is a living document. All scores are computed in real-time from the IT Programme Board (Board ID: 3447166437). No data is hardcoded — every metric reflects the current board state at the moment of viewing.', { type: 'info' }));
  children.push(p(''));
  children.push(p('Intended Audience:', { bold: true }));
  children.push(p('IT Management, Compliance Officers, Senior Administration, and Auditors', { bullet: true }));
  children.push(p('Department leadership requiring portfolio oversight', { bullet: true }));
  children.push(p('Stakeholders reviewing IT governance posture', { bullet: true }));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── Section 2: Data Source Architecture ───
  children.push(p('2. Data Source Architecture', { heading: HeadingLevel.HEADING_1 }));
  children.push(p('All compliance data is fetched from the IT Programme Board using the monday.com SDK Aggregate API. This ensures server-side computation — no client-side filtering or post-processing of item arrays. The board is organized into the following groups:'));
  children.push(p(''));

  children.push(advancedTable({
    headers: ['Group Name', 'Purpose'],
    rows: [
      ['Projects', 'Active IT projects with timelines and budgets'],
      ['Applications & Systems Management', 'On-premise and cloud application lifecycle'],
      ['Network & Security Operations', 'Firewall, VPN, and network infrastructure'],
      ['Desktop & End-User Support', 'Helpdesk and end-user device management'],
      ['Completed Projects', 'Archive of finished projects'],
      ['Cancelled Projects', 'Archive of cancelled initiatives'],
      ['IT BUDGET Details', 'Financial planning and budget allocation items'],
    ],
    headerStyle: { color: '0A2E5C', textColor: 'FFFFFF' },
    columnWidths: [3800, 5560],
  }));
  children.push(p(''));

  children.push(p('2.1 Key Board Columns Used', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('The following columns from the IT Programme Board are consumed by the Compliance Dashboard:'));
  children.push(p(''));

  children.push(advancedTable({
    headers: ['Column Name', 'SDK Property', 'Type', 'Used For'],
    rows: [
      ['Status', 'status', 'Status', 'Task completion state — Done, In Progress, Stuck, etc.'],
      ['Priority', 'priority', 'Status', 'Risk weighting — Critical, High, Medium, Low'],
      ['Completion Status', 'completionStatus', 'Status', 'Infrastructure health — Completed, In Progress, On Hold, Not Started'],
      ['Person', 'person', 'People', 'Assignment rate — checks if owner is assigned'],
      ['IT Budget Data', 'itBudgetData', 'File', 'Documentation coverage — checks if budget files attached'],
      ['Annual Cost (BHD)', 'annualCostBhd', 'Number', 'Cost coverage and financial totals'],
      ['Monthly Cost (BHD)', 'monthlyCostBhd', 'Number', 'Monthly cost summation'],
      ['Next Due Date', 'nextDueDate', 'Date', 'Overdue detection and upcoming due items'],
      ['Blockers/Risks', 'blockersrisks', 'Long Text', 'Risk register — items with documented blockers'],
      ['Proj / Op', 'projOp', 'Status', 'Portfolio classification — Project vs Operational'],
      ['AWS Server Count', 'awsServerCount', 'Number', 'Infrastructure asset count'],
      ['Estimated Hours', 'estimatedHours', 'Number', 'Resource effort estimation'],
      ['Infrastructure Type', 'infrastructureType', 'Dropdown', 'Platform classification for cost breakdown'],
    ],
    headerStyle: { color: '0A2E5C', textColor: 'FFFFFF' },
    columnWidths: [1800, 1500, 1000, 5060],
  }));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── Section 3: Score Calculation Methodology ───
  children.push(p('3. Score Calculation Methodology', { heading: HeadingLevel.HEADING_1 }));
  children.push(p('Each compliance gauge on the dashboard uses a specific formula. All calculations use server-side aggregation via the monday.com SDK aggregate() API, ensuring accuracy across the entire board regardless of pagination.'));
  children.push(p(''));

  // 3.1 Compliance Rate
  children.push(p('3.1 Compliance Rate', { heading: HeadingLevel.HEADING_2 }));
  children.push(callout('Formula: (Done Items + max(0, In Progress Items − Critical Items)) ÷ Total Items × 100', { type: 'tip' }));
  children.push(p(''));
  children.push(p('Rationale:', { bold: true }));
  children.push(p('Items with status "Done" are fully compliant. Items "In Progress" are partially compliant, but those flagged with "Critical" priority are excluded from the compliant count because they represent elevated risk that cannot be considered compliant until resolved.'));
  children.push(p(''));
  children.push(p('Data Sources:', { bold: true }));
  children.push(p('Status column (SDK: status) — grouped via aggregate().groupBy("status").countItems()', { bullet: true }));
  children.push(p('Priority column (SDK: priority) — grouped via aggregate().groupBy("priority").countItems()', { bullet: true }));
  children.push(p('Total item count via aggregate().countItems()', { bullet: true }));
  children.push(p(''));
  children.push(richParagraph(
    { text: 'Current Value: ' },
    { text: `${r.complianceRate || 0}%`, bold: true, color: Number(r.complianceRate) >= 80 ? '16A34A' : Number(r.complianceRate) >= 50 ? 'CA8A04' : 'DC2626' },
    { text: ` (${c.doneCount || 0} done + ${Math.max(0, (c.inProgressCount || 0) - (c.criticalCount || 0))} compliant in-progress out of ${t.totalItems || 0} total items)` }
  ));
  children.push(p(''));

  // 3.2 Assignment Rate
  children.push(p('3.2 Assignment Rate', { heading: HeadingLevel.HEADING_2 }));
  children.push(callout('Formula: Items with Person Assigned ÷ Total Items × 100', { type: 'tip' }));
  children.push(p(''));
  children.push(p('Every item in the portfolio should have an assigned owner for accountability. This metric measures what percentage of items have at least one person assigned in the Person column.'));
  children.push(p(''));
  children.push(p('Data Source:', { bold: true }));
  children.push(p('Person column (SDK: person) — counted via aggregate().where({ person: { isEmpty: false } }).countItems()', { bullet: true }));
  children.push(p(''));
  children.push(richParagraph(
    { text: 'Current Value: ' },
    { text: `${r.assignmentRate || 0}%`, bold: true, color: Number(r.assignmentRate) >= 80 ? '16A34A' : 'CA8A04' },
    { text: ` (${c.itemsAssigned || 0} of ${t.totalItems || 0} items have an owner)` }
  ));
  children.push(p(''));

  // 3.3 Documentation Coverage
  children.push(p('3.3 Documentation Coverage', { heading: HeadingLevel.HEADING_2 }));
  children.push(callout('Formula: Items with IT Budget Data Files ÷ Total Items × 100', { type: 'tip' }));
  children.push(p(''));
  children.push(p('Measures the percentage of portfolio items that have supporting documentation attached in the IT Budget Data file column. This includes RFPs, proposals, contracts, budget sheets, and other governance artifacts.'));
  children.push(p(''));
  children.push(p('Data Source:', { bold: true }));
  children.push(p('IT Budget Data column (SDK: itBudgetData) — counted via aggregate().where({ itBudgetData: { isEmpty: false } }).countItems()', { bullet: true }));
  children.push(p(''));
  children.push(richParagraph(
    { text: 'Current Value: ' },
    { text: `${r.docCoverage || 0}%`, bold: true, color: Number(r.docCoverage) >= 80 ? '16A34A' : 'CA8A04' },
    { text: ` (${c.itemsWithDocs || 0} items have documentation attached)` }
  ));
  children.push(p(''));

  // 3.4 Cost Coverage
  children.push(p('3.4 Cost Data Coverage', { heading: HeadingLevel.HEADING_2 }));
  children.push(callout('Formula: Items with Annual Cost (BHD) > 0 ÷ Total Items × 100', { type: 'tip' }));
  children.push(p(''));
  children.push(p('Tracks the percentage of items that have financial data recorded. Accurate cost data is essential for budgeting, forecasting, and audit compliance.'));
  children.push(p(''));
  children.push(p('Data Source:', { bold: true }));
  children.push(p('Annual Cost BHD column (SDK: annualCostBhd) — counted via aggregate().where({ annualCostBhd: { isEmpty: false } }).countItems()', { bullet: true }));
  children.push(p(''));
  children.push(richParagraph(
    { text: 'Current Value: ' },
    { text: `${r.costCoverage || 0}%`, bold: true, color: Number(r.costCoverage) >= 80 ? '16A34A' : 'CA8A04' },
    { text: ` (${c.itemsWithCost || 0} items have cost data, ${c.itemsWithoutCost || 0} missing)` }
  ));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 3.5 Risk Score
  children.push(p('3.5 Risk Score', { heading: HeadingLevel.HEADING_2 }));
  children.push(callout('Formula: min(100, (Critical × 10) + (Blocked × 8) + (Stuck × 5) + (Overdue × 7))', { type: 'warning' }));
  children.push(p(''));
  children.push(p('The risk score is a weighted composite index (0–100) where higher values indicate greater portfolio risk. Each risk factor contributes a different weight based on severity:'));
  children.push(p(''));

  children.push(advancedTable({
    headers: ['Risk Factor', 'Board Column', 'Weight', 'Current Count', 'Contribution'],
    rows: [
      ['Critical Priority Items', 'priority = "Critical"', '× 10', String(c.criticalCount || 0), String((c.criticalCount || 0) * 10)],
      ['On Hold Items', 'completionStatus = "On Hold"', '× 8', String(c.blockedHealth || 0), String((c.blockedHealth || 0) * 8)],
      ['Stuck Items', 'status = "Stuck"', '× 5', String(c.stuckCount || 0), String((c.stuckCount || 0) * 5)],
      ['Overdue Items', 'nextDueDate < TODAY', '× 7', String(c.overdueCount || 0), String((c.overdueCount || 0) * 7)],
    ],
    headerStyle: { color: '0A2E5C', textColor: 'FFFFFF' },
    columnWidths: [2000, 2500, 1000, 1400, 2460],
  }));
  children.push(p(''));

  const rawRisk = (c.criticalCount || 0) * 10 + (c.blockedHealth || 0) * 8 + (c.stuckCount || 0) * 5 + (c.overdueCount || 0) * 7;
  children.push(richParagraph(
    { text: 'Raw Score: ' },
    { text: String(rawRisk), bold: true },
    { text: ' → Capped Score: ' },
    { text: `${r.riskScore || 0}/100`, bold: true, color: (r.riskScore || 0) < 30 ? '16A34A' : (r.riskScore || 0) < 60 ? 'CA8A04' : 'DC2626' },
    { text: (r.riskScore || 0) < 30 ? ' (LOW RISK)' : (r.riskScore || 0) < 60 ? ' (MEDIUM RISK)' : ' (HIGH RISK — Executive Review Required)' }
  ));
  children.push(p(''));

  children.push(p('Overdue Detection Logic:', { bold: true }));
  children.push(p('An item is considered overdue when its Next Due Date is earlier than today AND its status is one of: In Progress, Not Yet Started, Stuck, or Postponed. Items with status "Done" or "Cancelled" are excluded from overdue detection.'));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── Section 4: Dashboard Components ───
  children.push(p('4. Dashboard Components Workflow', { heading: HeadingLevel.HEADING_1 }));
  children.push(p(''));

  children.push(p('4.1 Critical Alert Banner', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('Appears at the top of the dashboard when any of the following conditions are true:'));
  children.push(p('Critical priority items > 0', { bullet: true }));
  children.push(p('Overdue items > 0', { bullet: true }));
  children.push(p('Blocked infrastructure items > 0', { bullet: true }));
  children.push(p(''));

  children.push(p('4.2 Priority Distribution Chart', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('A donut chart showing the count of items per priority level (Critical, High, Medium, Low). Data is fetched via:'));
  children.push(p('aggregate().groupBy("priority").countItems("count")', { bullet: true }));
  children.push(p(''));

  children.push(p('4.3 Infrastructure Health Chart', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('A donut chart showing item distribution by the Current Status column (Completed, In Progress, Blocked, Not Started). Data is fetched via:'));
  children.push(p('aggregate().groupBy("completionStatus").countItems("count")', { bullet: true }));
  children.push(p(''));

  children.push(p('4.4 Status Breakdown Chart', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('A vertical bar chart showing item counts per workflow status (Done, In Progress, Stuck, Not Yet Started, Postponed, Cancelled, Daily Operational Tasks, Emergency Operational Task). Data is fetched via:'));
  children.push(p('aggregate().groupBy("status").countItems("count")', { bullet: true }));
  children.push(p(''));

  children.push(p('4.5 Risk Register Table', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('Displays the top 10 at-risk items filtered from loaded board items. Inclusion criteria:'));
  children.push(p('Priority is "Critical" or "High"', { bullet: true }));
  children.push(p('Status is "Stuck"', { bullet: true }));
  children.push(p('Blockers/Risks column is not empty', { bullet: true }));
  children.push(p('Sorted by priority severity (Critical → High → Medium → Low)'));
  children.push(p(''));

  children.push(p('4.6 Top 5 Highest Cost Items', { heading: HeadingLevel.HEADING_2 }));
  children.push(p('Fetched server-side using the items API with sorting and pagination:'));
  children.push(p('items().where({ annualCostBhd: { gt: 0 } }).orderBy({ column: "annualCostBhd", direction: "desc" }).withPagination({ limit: 5 })', { bullet: true }));
  children.push(p('This is a fixed Top-N query (Class B) — no Load More needed.'));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── Section 5: Data Flow Diagram ───
  children.push(p('5. Aggregation Workflow (Data Flow)', { heading: HeadingLevel.HEADING_1 }));
  children.push(p('The dashboard executes 13 parallel API calls on mount using Promise.all for optimal performance:'));
  children.push(p(''));

  children.push(advancedTable({
    headers: ['#', 'API Call', 'Method', 'Returns'],
    rows: [
      ['1', 'Global Totals', 'aggregate().sum() + countItems()', 'Annual cost, monthly cost, server count, hours, item count'],
      ['2', 'Status Distribution', 'aggregate().groupBy("status")', 'Count per status label'],
      ['3', 'Priority Distribution', 'aggregate().groupBy("priority")', 'Count per priority level'],
      ['4', 'Type Distribution', 'aggregate().groupBy("projOp")', 'Project vs Operational split'],
      ['5', 'Infrastructure Distribution', 'aggregate().groupBy("infrastructureType")', 'Cost and count per platform'],
      ['6', 'Health Distribution', 'aggregate().groupBy("completionStatus")', 'Count per health state'],
      ['7', 'Items with Cost', 'aggregate().where({ annualCostBhd: not empty })', 'Count of costed items'],
      ['8', 'Items with Docs', 'aggregate().where({ itBudgetData: not empty })', 'Count of documented items'],
      ['9', 'Assigned Items', 'aggregate().where({ person: not empty })', 'Count of assigned items'],
      ['10', 'Items with Blockers', 'aggregate().where({ blockersrisks: not empty })', 'Count of blocked items'],
      ['11', 'Overdue Items', 'aggregate().where({ nextDueDate < TODAY })', 'Count of overdue active items'],
      ['12', 'Due This Week', 'aggregate().where({ nextDueDate in 7 days })', 'Count of items due soon'],
      ['13', 'Top 5 Cost Items', 'items().orderBy(annualCostBhd desc).limit(5)', 'Highest cost item details'],
    ],
    headerStyle: { color: '0A2E5C', textColor: 'FFFFFF' },
    columnWidths: [500, 2200, 3200, 3460],
  }));

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── Section 6: Current Snapshot ───
  children.push(p('6. Current Portfolio Snapshot', { heading: HeadingLevel.HEADING_1 }));
  children.push(p(`As of ${today}, the IT Programme Board contains the following metrics:`));
  children.push(p(''));

  children.push(advancedTable({
    headers: ['Metric', 'Value'],
    rows: [
      ['Total Portfolio Items', String(t.totalItems || 0)],
      ['Projects', String(c.projectCount || 0)],
      ['Operational Tasks', String(c.operationalCount || 0)],
      ['Completed (Done)', String(c.doneCount || 0)],
      ['In Progress', String(c.inProgressCount || 0)],
      ['Stuck', String(c.stuckCount || 0)],
      ['Not Yet Started', String(c.notStartedCount || 0)],
      ['Critical Priority', String(c.criticalCount || 0)],
      ['High Priority', String(c.highPriorityCount || 0)],
      ['Overdue Items', String(c.overdueCount || 0)],
      ['Due Within 7 Days', String(c.dueThisWeekCount || 0)],
      ['Items with Blockers', String(c.itemsWithBlockers || 0)],
      ['Total Annual Cost (BHD)', (t.totalAnnualCost || 0).toLocaleString()],
      ['Total Monthly Cost (BHD)', (t.totalMonthlyCost || 0).toLocaleString()],
      ['Total AWS Servers', String(t.totalAWSServers || 0)],
      ['Total Estimated Hours', String(t.totalEstimatedHours || 0)],
    ],
    headerStyle: { color: '0A2E5C', textColor: 'FFFFFF' },
    columnWidths: [4680, 4680],
  }));
  children.push(p(''));

  children.push(p('Score Summary:', { bold: true }));
  children.push(advancedTable({
    headers: ['Score', 'Value', 'Status'],
    rows: [
      ['Compliance Rate', `${r.complianceRate || 0}%`, Number(r.complianceRate) >= 80 ? 'PASS' : Number(r.complianceRate) >= 50 ? 'WARNING' : 'FAIL'],
      ['Assignment Rate', `${r.assignmentRate || 0}%`, Number(r.assignmentRate) >= 80 ? 'PASS' : 'WARNING'],
      ['Documentation Coverage', `${r.docCoverage || 0}%`, Number(r.docCoverage) >= 80 ? 'PASS' : 'WARNING'],
      ['Cost Data Coverage', `${r.costCoverage || 0}%`, Number(r.costCoverage) >= 80 ? 'PASS' : 'WARNING'],
      ['Risk Score', `${r.riskScore || 0}/100`, (r.riskScore || 0) < 30 ? 'LOW' : (r.riskScore || 0) < 60 ? 'MEDIUM' : 'HIGH'],
    ],
    headerStyle: { color: '0A2E5C', textColor: 'FFFFFF' },
    columnWidths: [3120, 3120, 3120],
  }));

  children.push(p(''));
  children.push(p(''));

  // ─── Section 7: Recommendations ───
  children.push(p('7. Governance Recommendations', { heading: HeadingLevel.HEADING_1 }));
  children.push(p(''));

  if (Number(r.complianceRate) < 80) {
    children.push(callout(`Compliance Rate is at ${r.complianceRate}% — below the 80% threshold. Review stuck and critical items and resolve blockers to improve this score.`, { type: 'warning' }));
    children.push(p(''));
  }
  if (Number(r.assignmentRate) < 80) {
    children.push(callout(`Assignment Rate is at ${r.assignmentRate}% — ${t.totalItems - c.itemsAssigned} items lack an assigned owner. Assign responsible persons to ensure accountability.`, { type: 'warning' }));
    children.push(p(''));
  }
  if (Number(r.docCoverage) < 50) {
    children.push(callout(`Documentation Coverage is at ${r.docCoverage}%. Upload supporting documents (RFPs, contracts, budget sheets) to the IT Budget Data column for audit readiness.`, { type: 'warning' }));
    children.push(p(''));
  }
  if ((r.riskScore || 0) >= 60) {
    children.push(callout(`Risk Score is ${r.riskScore}/100 (HIGH). Immediate executive review is recommended. Focus on resolving ${c.criticalCount} critical and ${c.overdueCount} overdue items.`, { type: 'warning' }));
    children.push(p(''));
  }

  children.push(p('Periodic review of this dashboard is recommended on a weekly basis to maintain governance standards and identify emerging risks early.'));
  children.push(p(''));
  children.push(p('— End of Document —', { italic: true, alignment: AlignmentType.CENTER }));

  return children;
}
