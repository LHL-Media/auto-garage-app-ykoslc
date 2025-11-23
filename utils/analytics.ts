
import { FuelLog, MaintenanceRecord, Vehicle, InsurancePolicy, Modification, FuelEfficiencyData, MaintenanceCostData, MonthlyExpenseData, TotalCostOfOwnership } from '@/types/vehicle';

export const AnalyticsService = {
  /**
   * Calculate fuel efficiency (L/100km) between two fuel logs
   */
  calculateFuelEfficiency(currentLog: FuelLog, previousLog: FuelLog): number {
    if (currentLog.partialFill) {
      return 0; // Skip partial fills
    }
    
    const distanceTraveled = currentLog.mileage - previousLog.mileage;
    if (distanceTraveled <= 0) {
      return 0;
    }
    
    const efficiency = (currentLog.amount / distanceTraveled) * 100;
    return Math.round(efficiency * 100) / 100;
  },

  /**
   * Calculate cost per km
   */
  calculateCostPerKm(fuelLogs: FuelLog[]): number {
    if (fuelLogs.length < 2) {
      return 0;
    }
    
    const sortedLogs = [...fuelLogs].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const totalCost = sortedLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalDistance = sortedLogs[sortedLogs.length - 1].mileage - sortedLogs[0].mileage;
    
    if (totalDistance <= 0) {
      return 0;
    }
    
    return Math.round((totalCost / totalDistance) * 100) / 100;
  },

  /**
   * Get fuel efficiency trend data
   */
  getFuelEfficiencyTrend(fuelLogs: FuelLog[]): FuelEfficiencyData[] {
    const sortedLogs = [...fuelLogs].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const trendData: FuelEfficiencyData[] = [];
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const currentLog = sortedLogs[i];
      const previousLog = sortedLogs[i - 1];
      
      if (!currentLog.partialFill) {
        const efficiency = this.calculateFuelEfficiency(currentLog, previousLog);
        if (efficiency > 0) {
          trendData.push({
            date: currentLog.date,
            efficiency,
            cost: currentLog.cost,
          });
        }
      }
    }
    
    return trendData;
  },

  /**
   * Get best and worst fuel economy
   */
  getBestWorstFuelEconomy(fuelLogs: FuelLog[]): { best: FuelEfficiencyData | null; worst: FuelEfficiencyData | null } {
    const trendData = this.getFuelEfficiencyTrend(fuelLogs);
    
    if (trendData.length === 0) {
      return { best: null, worst: null };
    }
    
    const best = trendData.reduce((prev, current) => 
      current.efficiency < prev.efficiency ? current : prev
    );
    
    const worst = trendData.reduce((prev, current) => 
      current.efficiency > prev.efficiency ? current : prev
    );
    
    return { best, worst };
  },

  /**
   * Get maintenance cost breakdown by category
   */
  getMaintenanceCostBreakdown(maintenanceRecords: MaintenanceRecord[]): MaintenanceCostData[] {
    const breakdown = new Map<string, { totalCost: number; count: number }>();
    
    maintenanceRecords.forEach(record => {
      const existing = breakdown.get(record.category) || { totalCost: 0, count: 0 };
      breakdown.set(record.category, {
        totalCost: existing.totalCost + record.totalCost,
        count: existing.count + 1,
      });
    });
    
    return Array.from(breakdown.entries()).map(([category, data]) => ({
      category: category as any,
      totalCost: data.totalCost,
      count: data.count,
    }));
  },

  /**
   * Get monthly expense data
   */
  getMonthlyExpenses(
    fuelLogs: FuelLog[],
    maintenanceRecords: MaintenanceRecord[],
    insurancePolicies: InsurancePolicy[]
  ): MonthlyExpenseData[] {
    const monthlyData = new Map<string, MonthlyExpenseData>();
    
    // Process fuel logs
    fuelLogs.forEach(log => {
      const monthKey = new Date(log.date).toISOString().substring(0, 7); // YYYY-MM
      const existing = monthlyData.get(monthKey) || {
        month: monthKey,
        fuel: 0,
        maintenance: 0,
        insurance: 0,
        total: 0,
      };
      existing.fuel += log.cost;
      monthlyData.set(monthKey, existing);
    });
    
    // Process maintenance records
    maintenanceRecords.forEach(record => {
      const monthKey = new Date(record.date).toISOString().substring(0, 7);
      const existing = monthlyData.get(monthKey) || {
        month: monthKey,
        fuel: 0,
        maintenance: 0,
        insurance: 0,
        total: 0,
      };
      existing.maintenance += record.totalCost;
      monthlyData.set(monthKey, existing);
    });
    
    // Process insurance (distribute premium across months)
    insurancePolicies.forEach(policy => {
      if (policy.premium) {
        const startDate = new Date(policy.startDate);
        const endDate = new Date(policy.expiryDate);
        const months = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthlyPremium = policy.premium / months;
        
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const monthKey = currentDate.toISOString().substring(0, 7);
          const existing = monthlyData.get(monthKey) || {
            month: monthKey,
            fuel: 0,
            maintenance: 0,
            insurance: 0,
            total: 0,
          };
          existing.insurance += monthlyPremium;
          monthlyData.set(monthKey, existing);
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
    });
    
    // Calculate totals
    monthlyData.forEach((data, key) => {
      data.total = data.fuel + data.maintenance + data.insurance;
      monthlyData.set(key, data);
    });
    
    return Array.from(monthlyData.values()).sort((a, b) => a.month.localeCompare(b.month));
  },

  /**
   * Calculate total cost of ownership
   */
  calculateTotalCostOfOwnership(
    vehicle: Vehicle,
    fuelLogs: FuelLog[],
    maintenanceRecords: MaintenanceRecord[],
    insurancePolicies: InsurancePolicy[],
    modifications: Modification[]
  ): TotalCostOfOwnership {
    const totalFuel = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalMaintenance = maintenanceRecords.reduce((sum, record) => sum + record.totalCost, 0);
    const totalInsurance = insurancePolicies.reduce((sum, policy) => sum + (policy.premium || 0), 0);
    const totalModifications = modifications.reduce((sum, mod) => sum + mod.cost, 0);
    
    // Simple depreciation calculation (10% per year)
    const yearsOwned = (new Date().getTime() - new Date(vehicle.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const depreciation = vehicle.purchasePrice * 0.1 * yearsOwned;
    
    const total = vehicle.purchasePrice + totalFuel + totalMaintenance + totalInsurance + totalModifications - depreciation;
    
    return {
      purchasePrice: vehicle.purchasePrice,
      depreciation,
      totalFuel,
      totalMaintenance,
      totalInsurance,
      totalModifications,
      total,
    };
  },

  /**
   * Validate odometer reading (warn if mileage decreases)
   */
  validateOdometer(newMileage: number, currentMileage: number): { valid: boolean; message?: string } {
    if (newMileage < currentMileage) {
      return {
        valid: false,
        message: 'Warning: New mileage is less than current mileage. This may indicate an error.',
      };
    }
    return { valid: true };
  },

  /**
   * Check if expense alert should be triggered (20% above average)
   */
  shouldTriggerExpenseAlert(monthlyExpenses: MonthlyExpenseData[]): { alert: boolean; message?: string } {
    if (monthlyExpenses.length < 2) {
      return { alert: false };
    }
    
    const recentExpenses = monthlyExpenses.slice(-3);
    const average = recentExpenses.slice(0, -1).reduce((sum, data) => sum + data.total, 0) / (recentExpenses.length - 1);
    const current = recentExpenses[recentExpenses.length - 1].total;
    
    if (current > average * 1.2) {
      return {
        alert: true,
        message: `Your expenses this month (€${current.toFixed(2)}) are 20% higher than your average (€${average.toFixed(2)}).`,
      };
    }
    
    return { alert: false };
  },

  /**
   * Suggest next service based on typical intervals
   */
  suggestNextService(
    maintenanceRecords: MaintenanceRecord[],
    currentMileage: number
  ): { category: string; suggestedMileage: number; reason: string }[] {
    const suggestions: { category: string; suggestedMileage: number; reason: string }[] = [];
    
    const serviceIntervals: Record<string, number> = {
      oil_change: 15000,
      tire_rotation: 10000,
      brake_service: 50000,
      inspection: 20000,
      air_filter: 30000,
      cabin_filter: 20000,
      spark_plugs: 60000,
      coolant: 40000,
    };
    
    Object.entries(serviceIntervals).forEach(([category, interval]) => {
      const lastService = maintenanceRecords
        .filter(r => r.category === category)
        .sort((a, b) => b.mileage - a.mileage)[0];
      
      if (!lastService) {
        suggestions.push({
          category,
          suggestedMileage: currentMileage + interval,
          reason: 'No previous service recorded',
        });
      } else {
        const nextServiceMileage = lastService.mileage + interval;
        if (currentMileage >= nextServiceMileage - 1000) {
          suggestions.push({
            category,
            suggestedMileage: nextServiceMileage,
            reason: `Due soon (last service at ${lastService.mileage} km)`,
          });
        }
      }
    });
    
    return suggestions;
  },
};
