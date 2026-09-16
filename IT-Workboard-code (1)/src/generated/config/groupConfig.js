export const GROUPS = [
  {
    id: 'new_group96591', label: 'IT Projects',
    columns: [
      { key: 'status', head: 'Status', type: 'badge' },
      { key: 'projOp', head: 'Type', type: 'badge' },
      { key: 'priority', head: 'Priority', type: 'badge' },
      { key: 'person', head: 'Assigned', type: 'people' },
      { key: 'vendor', head: 'Vendor', type: 'text' },
    ],
  },
  {
    id: 'group_mm404h32', label: 'Apps & Systems',
    columns: [
      { key: 'status', head: 'Status', type: 'badge' },
      { key: 'priority', head: 'Priority', type: 'badge' },
      { key: 'person', head: 'Assigned', type: 'people' },
      { key: 'infrastructureType', head: 'Infra Type', type: 'dropdown' },
      { key: 'vendor', head: 'Vendor', type: 'text' },
    ],
  },
  {
    id: 'group_mm40z7pp', label: 'Network & Security',
    columns: [
      { key: 'status', head: 'Status', type: 'badge' },
      { key: 'priority', head: 'Priority', type: 'badge' },
      { key: 'person', head: 'Assigned', type: 'people' },
      { key: 'infrastructureType', head: 'Infra Type', type: 'dropdown' },
      { key: 'slaHours', head: 'SLA (Hrs)', type: 'text' },
    ],
  },
  {
    id: 'group_mm40j3je', label: 'Desktop Support',
    columns: [
      { key: 'status', head: 'Status', type: 'badge' },
      { key: 'priority', head: 'Priority', type: 'badge' },
      { key: 'person', head: 'Assigned', type: 'people' },
      { key: 'slaHours', head: 'SLA (Hrs)', type: 'text' },
      { key: 'completionStatus', head: 'Completion', type: 'badge' },
    ],
  },
  {
    id: 'new_group', label: 'Completed',
    columns: [
      { key: 'status', head: 'Status', type: 'badge' },
      { key: 'completionStatus', head: 'Completion', type: 'badge' },
      { key: 'nextDueDate', head: 'Due Date', type: 'date' },
      { key: 'person', head: 'Assigned', type: 'people' },
      { key: 'vendor', head: 'Vendor', type: 'text' },
    ],
  },
  {
    id: 'group_mm43t82', label: 'IT Budget',
    columns: [
      { key: 'annualCostBhd', head: 'Annual (BHD)', type: 'currency' },
      { key: 'monthlyCostBhd', head: 'Monthly (BHD)', type: 'currency' },
      { key: 'paymentStatus', head: 'Payment', type: 'badge' },
      { key: 'approved', head: 'Approved', type: 'checkbox' },
      { key: 'budgetCategories', head: 'Category', type: 'text' },
    ],
  },
];
