"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Zap, 
  Database, 
  Network, 
  Cpu, 
  MemoryStick,
  HardDrive,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
  bundleSize: number;
}

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PerformanceDashboard({ isOpen, onClose }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Collect performance metrics
  const collectMetrics = async () => {
    setIsCollecting(true);
    const newAlerts: string[] = [];

    try {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;

      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

      // Get memory usage (if available)
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit * 100 : 0;

      // Get network requests count
      const networkEntries = performance.getEntriesByType('resource');
      const networkRequests = networkEntries.length;

      // Calculate cache hit rate
      const cacheHits = networkEntries.filter(entry => 
        entry.transferSize === 0 && entry.decodedBodySize > 0
      ).length;
      const cacheHitRate = networkRequests > 0 ? (cacheHits / networkRequests) * 100 : 0;

      // Get bundle size (approximate)
      const bundleSize = networkEntries
        .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
        .reduce((total, entry) => total + entry.transferSize, 0);

      const newMetrics: PerformanceMetrics = {
        loadTime,
        firstContentfulPaint,
        largestContentfulPaint: 0, // Will be updated by observer
        firstInputDelay: 0, // Will be updated by observer
        cumulativeLayoutShift: 0, // Will be updated by observer
        timeToInteractive: 0, // Will be updated by observer
        memoryUsage,
        networkRequests,
        cacheHitRate,
        bundleSize
      };

      // Set up observers for additional metrics
      if ('PerformanceObserver' in window) {
        // LCP Observer
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            setMetrics(prev => prev ? { ...prev, largestContentfulPaint: lastEntry.startTime } : null);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported');
        }

        // FID Observer
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const fid = entry.processingStart - entry.startTime;
              setMetrics(prev => prev ? { ...prev, firstInputDelay: fid } : null);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observer not supported');
        }

        // CLS Observer
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                setMetrics(prev => prev ? { ...prev, cumulativeLayoutShift: clsValue } : null);
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observer not supported');
        }
      }

      setMetrics(newMetrics);

      // Generate alerts
      if (loadTime > 3000) newAlerts.push('Page load time is slow (>3s)');
      if (firstContentfulPaint > 1800) newAlerts.push('First Contentful Paint is slow (>1.8s)');
      if (memoryUsage > 80) newAlerts.push('High memory usage (>80%)');
      if (cacheHitRate < 50) newAlerts.push('Low cache hit rate (<50%)');
      if (bundleSize > 1000000) newAlerts.push('Large bundle size (>1MB)');

      setAlerts(newAlerts);

    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  // Collect metrics when dashboard opens
  useEffect(() => {
    if (isOpen) {
      collectMetrics();
    }
  }, [isOpen]);

  // Get performance score color
  const getScoreColor = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.needsImprovement) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get performance score icon
  const getScoreIcon = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (value <= thresholds.needsImprovement) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <X className="w-4 h-4 text-red-600" />;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Performance Dashboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800 dark:text-red-200">Performance Issues</h3>
              </div>
              <ul className="space-y-1">
                {alerts.map((alert, index) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-300">
                    • {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metrics Grid */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Load Time */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Load Time</span>
                  </div>
                  {getScoreIcon(metrics.loadTime, { good: 2000, needsImprovement: 4000 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.loadTime, { good: 2000, needsImprovement: 4000 })}`}>
                  {metrics.loadTime.toFixed(0)}ms
                </div>
              </div>

              {/* First Contentful Paint */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">FCP</span>
                  </div>
                  {getScoreIcon(metrics.firstContentfulPaint, { good: 1800, needsImprovement: 3000 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.firstContentfulPaint, { good: 1800, needsImprovement: 3000 })}`}>
                  {metrics.firstContentfulPaint.toFixed(0)}ms
                </div>
              </div>

              {/* Largest Contentful Paint */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">LCP</span>
                  </div>
                  {getScoreIcon(metrics.largestContentfulPaint, { good: 2500, needsImprovement: 4000 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.largestContentfulPaint, { good: 2500, needsImprovement: 4000 })}`}>
                  {metrics.largestContentfulPaint.toFixed(0)}ms
                </div>
              </div>

              {/* First Input Delay */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Network className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">FID</span>
                  </div>
                  {getScoreIcon(metrics.firstInputDelay, { good: 100, needsImprovement: 300 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.firstInputDelay, { good: 100, needsImprovement: 300 })}`}>
                  {metrics.firstInputDelay.toFixed(0)}ms
                </div>
              </div>

              {/* Cumulative Layout Shift */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">CLS</span>
                  </div>
                  {getScoreIcon(metrics.cumulativeLayoutShift, { good: 0.1, needsImprovement: 0.25 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.cumulativeLayoutShift, { good: 0.1, needsImprovement: 0.25 })}`}>
                  {metrics.cumulativeLayoutShift.toFixed(3)}
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Memory</span>
                  </div>
                  {getScoreIcon(metrics.memoryUsage, { good: 50, needsImprovement: 80 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.memoryUsage, { good: 50, needsImprovement: 80 })}`}>
                  {metrics.memoryUsage.toFixed(1)}%
                </div>
              </div>

              {/* Network Requests */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Requests</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {metrics.networkRequests}
                </div>
              </div>

              {/* Cache Hit Rate */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Cache Hit Rate</span>
                  </div>
                  {getScoreIcon(100 - metrics.cacheHitRate, { good: 20, needsImprovement: 50 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(100 - metrics.cacheHitRate, { good: 20, needsImprovement: 50 })}`}>
                  {metrics.cacheHitRate.toFixed(1)}%
                </div>
              </div>

              {/* Bundle Size */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Bundle Size</span>
                  </div>
                  {getScoreIcon(metrics.bundleSize / 1000, { good: 500, needsImprovement: 1000 })}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(metrics.bundleSize / 1000, { good: 500, needsImprovement: 1000 })}`}>
                  {(metrics.bundleSize / 1000).toFixed(0)}KB
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={collectMetrics}
              disabled={isCollecting}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCollecting ? 'Collecting...' : 'Refresh Metrics'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
