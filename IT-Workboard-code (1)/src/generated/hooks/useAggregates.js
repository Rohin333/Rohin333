import { useState, useEffect, useCallback } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';

export function useAggregates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAggregates = useCallback(async () => {
    try {
      setLoading(true);
      const board = new ItProgrammeBoard();
      const today = new Date().toISOString().split('T')[0];
      const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

      const [
        totals,
        statusDist,
        priorityDist,
        typeDist,
        infraDist,
        healthDist,
        withCost,
        withDocs,
        withPerson,
        withBlockers,
        overdue,
        dueThisWeek,
        topCostResults
      ] = await Promise.all([
        board.aggregate()
          .sum('annualCostBhd', 'totalAnnualCost')
          .sum('monthlyCostBhd', 'totalMonthlyCost')
          .sum('awsServerCount', 'totalAWSServers')
          .sum('estimatedHours', 'totalEstimatedHours')
          .countItems('totalItems')
          .execute(),
        board.aggregate().groupBy('status').countItems('count').execute(),
        board.aggregate().groupBy('priority').countItems('count').execute(),
        board.aggregate().groupBy('projOp').countItems('count').execute(),
        board.aggregate()
          .groupBy('infrastructureType')
          .sum('annualCostBhd', 'annualCost')
          .sum('monthlyCostBhd', 'monthlyCost')
          .sum('awsServerCount', 'serverCount')
          .countItems('count')
          .execute(),
        board.aggregate().groupBy('completionStatus').countItems('count').execute(),
        board.aggregate().where({ annualCostBhd: { isEmpty: false } }).countItems('count').execute(),
        board.aggregate().where({ itBudgetData: { isEmpty: false } }).countItems('count').execute(),
        board.aggregate().where({ person: { isEmpty: false } }).countItems('count').execute(),
        board.aggregate().where({ blockersrisks: { isEmpty: false } }).countItems('count').execute(),
        board.aggregate()
          .where({ nextDueDate: { lt: 'TODAY' }, status: ['In Progress', 'Not Yet Started', 'Stuck', 'Postponed'] })
          .countItems('count')
          .execute(),
        board.aggregate()
          .where({ nextDueDate: [today, weekFromNow], status: ['In Progress', 'Not Yet Started', 'Stuck', 'Postponed'] })
          .countItems('count')
          .execute(),
        // Top 5 highest cost items (Class B - fixed top-N)
        board.items()
          .withColumns(['annualCostBhd', 'monthlyCostBhd', 'status', 'projOp', 'infrastructureType', 'vendor'])
          .where({ annualCostBhd: { gt: 0 } })
          .orderBy({ column: 'annualCostBhd', direction: 'desc' })
          .withPagination({ limit: 5 })
          .execute()
      ]);

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
      const blockedHealth = getDistCount(healthDist, 'completionStatus', 'On Hold');

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
        healthDist: (healthDist || []).filter(d => d.completionStatus && d.completionStatus !== 'null' && d.completionStatus.trim() !== ''),
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
