import { useState, useEffect, useCallback } from 'react';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';

// Create IT Programme Board instance with correct ID and column mappings
const board = new ITProgrammeBoard();

// Helper to retry API calls with exponential backoff
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0 || !err.message?.includes('Rate limit')) throw err;
    
    const waitTime = err.message?.includes('retry_in_seconds') 
      ? 20000  // Use Monday's suggested 20s
      : delay;
    
    console.warn(`Rate limited, retrying in ${waitTime}ms... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// Helper to batch promises with delays between batches
async function executeBatched(promiseFns, batchSize = 4, delayMs = 500) {
  const results = [];
  for (let i = 0; i < promiseFns.length; i += batchSize) {
    const batch = promiseFns.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn => retryWithBackoff(fn)));
    results.push(...batchResults);
    
    // Add delay between batches (except after last batch)
    if (i + batchSize < promiseFns.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return results;
}

export function useAggregates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAggregates = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

      // Split into batches to avoid rate limits
      const batch1 = await executeBatched([
        () => board.aggregate()
          .sum('annualCostBhd', 'totalAnnualCost')
          .sum('monthlyCostBhd', 'totalMonthlyCost')
          .sum('awsServerCount', 'totalAWSServers')
          .sum('estimatedHours', 'totalEstimatedHours')
          .countItems('totalItems')
          .execute(),
        () => board.aggregate().groupBy('status').countItems('count').execute(),
        () => board.aggregate().groupBy('priority').countItems('count').execute(),
        () => board.aggregate().groupBy('projOp').countItems('count').execute()
      ], 4, 300);

      const batch2 = await executeBatched([
        () => board.aggregate()
          .groupBy('infrastructureType')
          .sum('annualCostBhd', 'annualCost')
          .sum('monthlyCostBhd', 'monthlyCost')
          .sum('awsServerCount', 'serverCount')
          .countItems('count')
          .execute(),
        () => board.aggregate().groupBy('currentStatus').countItems('count').execute(),
        () => board.aggregate().where({ annualCostBhd: { isEmpty: false } }).countItems('count').execute(),
        () => board.aggregate().where({ itBudgetData: { isEmpty: false } }).countItems('count').execute()
      ], 4, 300);

      const batch3 = await executeBatched([
        () => board.aggregate().where({ person: { isEmpty: false } }).countItems('count').execute(),
        () => board.aggregate().where({ blockersrisks: { isEmpty: false } }).countItems('count').execute(),
        () => board.aggregate()
          .where({ nextDueDate: { lt: 'TODAY' }, status: ['In Progress', 'Not Yet Started', 'Stuck', 'Postponed'] })
          .countItems('count')
          .execute(),
        () => board.aggregate()
          .where({ nextDueDate: [today, weekFromNow], status: ['In Progress', 'Not Yet Started', 'Stuck', 'Postponed'] })
          .countItems('count')
          .execute(),
        () => board.items()
          .withColumns(['annualCostBhd', 'monthlyCostBhd', 'status', 'projOp', 'infrastructureType', 'vendor', 'department'])
          .where({ annualCostBhd: { gt: 0 } })
          .orderBy({ column: 'annualCostBhd', direction: 'desc' })
          .withPagination({ limit: 5 })
          .execute()
      ], 4, 300);

      const [
        totals,
        statusDist,
        priorityDist,
        typeDist
      ] = batch1;

      const [
        infraDist,
        healthDist,
        withCost,
        withDocs
      ] = batch2;

      const [
        withPerson,
        withBlockers,
        overdue,
        dueThisWeek,
        topCostResults
      ] = batch3;

      const t = totals?.[0] || {};
      const totalItems = t.totalItems || 0;
      const itemsWithCost = withCost?.[0]?.count || 0;
      const itemsWithDocs = withDocs?.[0]?.count || 0;
      const itemsAssigned = withPerson?.[0]?.count || 0;
      const itemsWithBlockers = withBlockers?.[0]?.count || 0;
      const overdueCount = overdue?.[0]?.count || 0;
      const dueThisWeekCount = dueThisWeek?.[0]?.count || 0;

      // Extract counts from distributions
      const getDistCount = (dist, key, value) => {
        const item = (dist || []).find(d => d[key] === value);
        return item?.count || 0;
      };

      const doneCount = getDistCount(statusDist, 'status', 'Done');
      const inProgressCount = getDistCount(statusDist, 'status', 'In Progress');
      const stuckCount = getDistCount(statusDist, 'status', 'Stuck');
      const notStartedCount = getDistCount(statusDist, 'status', 'Not Yet Started');
      const criticalCount = getDistCount(priorityDist, 'priority', 'Critical');
      const highPriorityCount = getDistCount(priorityDist, 'priority', 'High');
      const projectCount = getDistCount(typeDist, 'projOp', 'Project');
      const operationalCount = getDistCount(typeDist, 'projOp', 'Operational');
      const blockedHealth = getDistCount(healthDist, 'currentStatus', 'Blocked');

      // Compliance: Done + (InProgress minus Critical) as % of total
      const compliantItems = doneCount + Math.max(0, inProgressCount - criticalCount);
      const complianceRate = totalItems > 0 ? ((compliantItems / totalItems) * 100).toFixed(1) : 0;
      const costCoverage = totalItems > 0 ? ((itemsWithCost / totalItems) * 100).toFixed(1) : 0;
      const docCoverage = totalItems > 0 ? ((itemsWithDocs / totalItems) * 100).toFixed(1) : 0;
      const assignmentRate = totalItems > 0 ? ((itemsAssigned / totalItems) * 100).toFixed(1) : 0;
      const completionRate = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;
      const riskScore = Math.min(100, (criticalCount * 10) + (blockedHealth * 8) + (stuckCount * 5) + (overdueCount * 7));

      setData({
        totals: {
          totalItems,
          totalAnnualCost: t.totalAnnualCost || 0,
          totalMonthlyCost: t.totalMonthlyCost || 0,
          totalAWSServers: t.totalAWSServers || 0,
          totalEstimatedHours: t.totalEstimatedHours || 0
        },
        counts: {
          itemsWithCost,
          itemsWithoutCost: totalItems - itemsWithCost,
          itemsWithDocs,
          itemsAssigned,
          itemsWithBlockers,
          overdueCount,
          dueThisWeekCount,
          doneCount,
          inProgressCount,
          stuckCount,
          notStartedCount,
          criticalCount,
          highPriorityCount,
          projectCount,
          operationalCount,
          blockedHealth
        },
        rates: {
          complianceRate,
          costCoverage,
          docCoverage,
          assignmentRate,
          completionRate,
          riskScore
        },
        statusDist: (statusDist || []).filter(d => d.status),
        priorityDist: (priorityDist || []).filter(d => d.priority && d.priority !== 'null' && d.priority.trim() !== ''),
        typeDist: (typeDist || []).filter(d => d.projOp),
        infraDist: (infraDist || []).filter(d => d.infrastructureType),
        healthDist: (healthDist || []).filter(d => d.currentStatus && d.currentStatus !== 'null' && d.currentStatus.trim() !== ''),
        topCostItems: topCostResults?.items || []
      });
    } catch (err) {
      console.error('Error fetching aggregates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAggregates();
  }, [fetchAggregates]);

  return { aggregates: data, loading, error, refetch: fetchAggregates };
}
