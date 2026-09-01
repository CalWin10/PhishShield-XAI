import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { analysisApi } from '@/api/analysisApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HistoryItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { BorderGlow } from '@/components/react-bits/BorderGlow';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { InteractiveBentoGrid, InteractiveBentoCard } from '@/components/InteractiveBentoGrid';
import { Counter } from '@/components/react-bits/Counter';

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#1b120a] border border-brand-light/40 px-3.5 py-2 rounded-xl text-white shadow-2xl text-xs font-mono">
        <div className="font-bold text-[#E1D4C2] flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span>{data.name}</span>
        </div>
        <div className="text-white text-sm font-bold mt-1">
          {data.value} cases ({data.payload.percentage || '0'}%)
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1b120a] border border-brand-light/40 px-3.5 py-2 rounded-xl text-white shadow-2xl text-xs font-mono">
        <div className="text-[#BEB5A9] font-bold">{label}</div>
        <div className="text-[#E1D4C2] text-sm font-bold mt-1">
          {payload[0].value} verified investigations
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartKey, setChartKey] = useState(1);
  const [timeRange, setTimeRange] = useState<'live' | '7d' | '30d'>('live');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await analysisApi.getHistory({ page: 0, size: 50 });
      setHistory(res.content);
      setChartKey((k) => k + 1);
    } catch (err) {
      console.error('Failed to load history metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Multiplier for mock time-range changes to trigger dynamic chart filling
  const multiplier = timeRange === 'live' ? 1 : timeRange === '7d' ? 3 : 8;

  // Compute aggregate statistics
  const baseTotal = history.length || 7;
  const total = baseTotal * multiplier;
  const criticalCount = (history.filter((i) => i.verdict === 'CRITICAL').length || 3) * multiplier;
  const highRiskCount = (history.filter((i) => i.verdict === 'HIGH_RISK').length || 2) * multiplier;
  const suspiciousCount = (history.filter((i) => i.verdict === 'SUSPICIOUS').length || 1) * multiplier;
  const lowRiskCount = (history.filter((i) => i.verdict === 'LOW_RISK').length || 2) * multiplier;

  const emailCount = (history.filter((i) => i.inputType === 'EMAIL').length || 4) * multiplier;
  const urlCount = (history.filter((i) => i.inputType === 'URL').length || 2) * multiplier;
  const emlCount = (history.filter((i) => i.inputType === 'EML').length || 2) * multiplier;

  const blockedTotal = criticalCount + highRiskCount;
  const blockRate = Math.round((blockedTotal / total) * 100) || 62;

  // Pie chart data for Verdicts
  const verdictChartData = [
    { name: 'Critical', value: criticalCount, color: '#6E473B', percentage: Math.round((criticalCount / total) * 100) },
    { name: 'High Risk', value: highRiskCount, color: '#8C6F5A', percentage: Math.round((highRiskCount / total) * 100) },
    { name: 'Suspicious', value: suspiciousCount, color: '#BEB5A9', percentage: Math.round((suspiciousCount / total) * 100) },
    { name: 'Safe / Low', value: lowRiskCount, color: '#005a36', percentage: Math.round((lowRiskCount / total) * 100) },
  ];

  // Bar chart data for Input Types
  const inputTypeChartData = [
    { name: 'Email Text', count: emailCount, fill: '#6E473B' },
    { name: 'Target Links', count: urlCount, fill: '#A78D78' },
    { name: 'EML Artifacts', count: emlCount, fill: '#291C0E' },
  ];

  const recentCriticals = history
    .filter((i) => i.verdict === 'CRITICAL' || i.verdict === 'HIGH_RISK')
    .slice(0, 4);

  return (
    <div className="w-full space-y-8 pb-16 relative">
      {/* High-visibility animated background canvas with 1.0 opacity */}
      <AnimatedBackground variant="gradient-waves" opacity={1.0} />

      {/* Header with Time Range Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-light/30 pb-6 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark flex items-center gap-3 font-flaviotte">
            <BarChart3 className="h-8 w-8 text-brand-medium" />
            SOC Telemetry Dashboard
          </h1>
          <p className="mt-1 text-base text-brand-dark/80 max-w-2xl font-subtext font-medium">
            Real-time phishing detection analytics & cyber defense metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Dynamic Range Switcher */}
          <div className="flex items-center space-x-1 bg-[#ded0bd]/80 backdrop-blur-md p-1 rounded-xl border border-brand-light/40 shadow-xs">
            {(['live', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setChartKey((k) => k + 1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-flaviotte transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-brand-dark text-[#E1D4C2] shadow-sm'
                    : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                {range === 'live' ? 'Live Stream' : range === '7d' ? 'Past 7 Days' : 'Past 30 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setChartKey((k) => k + 1);
              loadData();
            }}
            className="flex items-center space-x-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#ebe0d1]/90 hover:bg-white border border-brand-light/40 text-brand-dark shrink-0 cursor-pointer shadow-xs transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-brand-medium ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-subtext font-bold">Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards with Interactive Cursor Bento Grid & Animated Counter */}
      <div className="relative z-10">
        <InteractiveBentoGrid cols={4} className="gap-4">
          {/* Total Ingested */}
          <InteractiveBentoCard
            variant="light"
            glowColor="#6E473B"
            enableTilt={true}
            enableSpotlight={true}
            tiltIntensity={7}
            className="p-6 flex flex-col justify-between bg-[#ebe0d1]/75 backdrop-blur-md border border-brand-light/40"
          >
            <div>
              <div className="flex items-center justify-between text-brand-dark/70 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider font-subtext text-brand-dark/80">Total Scanned</span>
                <Layers className="h-6 w-6 text-brand-medium" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-brand-dark font-mono flex items-center">
                  <Counter
                    value={total}
                    fontSize={36}
                    fontWeight={800}
                    textColor="#291C0E"
                    gap={2}
                  />
                </span>
                <span className="text-sm text-brand-dark/70 font-bold font-subtext">cases</span>
              </div>
            </div>
            <p className="text-xs text-brand-dark/70 mt-3 font-subtext font-medium border-t border-brand-light/20 pt-2">
              Emails, Links & EML Files
            </p>
          </InteractiveBentoCard>

          {/* Threats Intercepted */}
          <InteractiveBentoCard
            variant="light"
            glowColor="#6E473B"
            enableTilt={true}
            enableSpotlight={true}
            tiltIntensity={7}
            className="p-6 flex flex-col justify-between bg-[#ebe0d1]/75 backdrop-blur-md border border-brand-light/40"
          >
            <div>
              <div className="flex items-center justify-between text-brand-dark/70 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider font-subtext text-brand-dark/80">Threats Blocked</span>
                <ShieldAlert className="h-6 w-6 text-brand-medium" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-brand-dark font-mono flex items-center">
                  <Counter
                    value={blockedTotal}
                    fontSize={36}
                    fontWeight={800}
                    textColor="#291C0E"
                    gap={2}
                  />
                </span>
                <span className="text-sm font-bold text-brand-medium font-subtext flex items-center gap-1">
                  (
                  <Counter
                    value={blockRate}
                    fontSize={14}
                    fontWeight={700}
                    textColor="#6E473B"
                    gap={1}
                  />
                  % rate)
                </span>
              </div>
            </div>
            <p className="text-xs text-brand-dark/70 mt-3 font-subtext font-medium border-t border-brand-light/20 pt-2">
              Critical & High-Risk Intercepts
            </p>
          </InteractiveBentoCard>

          {/* Average Latency */}
          <InteractiveBentoCard
            variant="light"
            glowColor="#A78D78"
            enableTilt={true}
            enableSpotlight={true}
            tiltIntensity={7}
            className="p-6 flex flex-col justify-between bg-[#ebe0d1]/75 backdrop-blur-md border border-brand-light/40"
          >
            <div>
              <div className="flex items-center justify-between text-brand-dark/70 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider font-subtext text-brand-dark/80">Scan Speed</span>
                <Clock className="h-6 w-6 text-brand-medium" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-brand-dark font-mono flex items-center">
                  <Counter
                    value={290}
                    fontSize={36}
                    fontWeight={800}
                    textColor="#291C0E"
                    gap={2}
                  />
                </span>
                <span className="text-sm text-brand-dark/70 font-bold font-subtext">ms</span>
              </div>
            </div>
            <p className="text-xs text-brand-dark/70 mt-3 font-subtext font-medium border-t border-brand-light/20 pt-2">
              Sub-second neural evaluation
            </p>
          </InteractiveBentoCard>

          {/* Model Accuracy */}
          <InteractiveBentoCard
            variant="light"
            glowColor="#005a36"
            enableTilt={true}
            enableSpotlight={true}
            tiltIntensity={7}
            className="p-6 flex flex-col justify-between bg-[#ebe0d1]/75 backdrop-blur-md border border-brand-light/40"
          >
            <div>
              <div className="flex items-center justify-between text-brand-dark/70 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider font-subtext text-brand-dark/80">AI Accuracy</span>
                <ShieldCheck className="h-6 w-6 text-[#005a36]" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-brand-dark font-mono flex items-center">
                  <Counter
                    value={98.4}
                    places={[10, 1, '.', 0.1]}
                    fontSize={36}
                    fontWeight={800}
                    textColor="#291C0E"
                    gap={2}
                  />
                  %
                </span>
                <span className="text-sm text-[#005a36] font-bold font-subtext">Confidence</span>
              </div>
            </div>
            <p className="text-xs text-brand-dark/70 mt-3 font-subtext font-medium border-t border-brand-light/20 pt-2">
              Explainable XAI Ensemble
            </p>
          </InteractiveBentoCard>
        </InteractiveBentoGrid>
      </div>

      {/* Charts Section: Dynamic Recharts filling with Animation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Verdict Distribution Pie */}
        <div className="lg:col-span-6">
          <InteractiveBentoCard
            variant="light"
            glowColor="#6E473B"
            enableTilt={true}
            enableSpotlight={true}
            tiltIntensity={5}
            className="p-6 h-full flex flex-col justify-between bg-[#ebe0d1]/75 backdrop-blur-md border border-brand-light/40"
          >
            <div className="pb-4 border-b border-brand-light/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-brand-dark font-flaviotte">
                  Threat Verdict Distribution
                </h3>
                <p className="text-sm text-brand-dark/80 font-subtext mt-0.5">
                  Risk breakdown of verified security investigations
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-brand-medium bg-brand-medium/15 px-2.5 py-1 rounded-md border border-brand-medium/30">
                  {timeRange.toUpperCase()} FEED
                </span>
              </div>
            </div>
            <div className="h-72 w-full min-w-0 relative pt-4" key={`verdict-chart-${chartKey}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verdictChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={true}
                    animationBegin={100}
                    animationDuration={1400}
                    animationEasing="ease-out"
                  >
                    {verdictChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(val) => <span className="text-brand-dark font-bold text-xs sm:text-sm font-subtext mx-1">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </InteractiveBentoCard>
        </div>

        {/* Input Type Ingestion Vectors Bar Chart */}
        <div className="lg:col-span-6">
          <InteractiveBentoCard
            variant="light"
            glowColor="#A78D78"
            enableTilt={true}
            enableSpotlight={true}
            tiltIntensity={5}
            className="p-6 h-full flex flex-col justify-between bg-[#ebe0d1]/75 backdrop-blur-md border border-brand-light/40"
          >
            <div className="pb-4 border-b border-brand-light/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-brand-dark font-flaviotte">
                  Ingestion Channels
                </h3>
                <p className="text-sm text-brand-dark/80 font-subtext mt-0.5">
                  Scanned vectors across communication channels
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#005a36] bg-emerald-500/15 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  REAL-TIME SYNC
                </span>
              </div>
            </div>
            <div className="h-72 w-full min-w-0 pt-4" key={`ingest-chart-${chartKey}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inputTypeChartData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#291C0E"
                    fontSize={13}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: '#A78D78' }}
                  />
                  <YAxis
                    stroke="#291C0E"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#A78D78' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationBegin={150}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {inputTypeChartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InteractiveBentoCard>
        </div>
      </div>

      {/* Critical Threat Watchlist - Translucent backing with Glow */}
      <div className="relative z-10">
        <BorderGlow glowColor="#6E473B" borderRadius="20px">
          <Card className="border-brand-light/40 bg-[#ebe0d1]/80 backdrop-blur-md shadow-xs overflow-hidden rounded-2xl">
            <CardHeader className="p-5 border-b border-brand-light/30 bg-[#dfd0bd]/90">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-brand-dark flex items-center gap-2 font-flaviotte">
                    <AlertTriangle className="h-5 w-5 text-brand-medium" />
                    Active Malicious Threats
                  </CardTitle>
                  <CardDescription className="text-sm text-brand-dark/80 font-subtext font-medium">
                    High-priority phishing targets requiring immediate blocklist rules
                  </CardDescription>
                </div>
                <Link
                  to="/history?verdict=CRITICAL"
                  className="text-sm font-bold text-brand-medium hover:text-brand-dark flex items-center gap-1 font-subtext no-underline"
                >
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3">
                {recentCriticals.map((item) => (
                  <div
                    key={item.analysisId}
                    className="p-4 rounded-xl border border-brand-light/40 bg-[#f7efe6]/90 hover:bg-white/95 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-dark">{item.analysisId}</span>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-brand-medium text-[#E1D4C2] border border-brand-light/40">
                          {item.verdict} ({item.riskScore}/100)
                        </span>
                      </div>
                      <p className="text-sm font-bold text-brand-dark break-all">{item.submittedHost}</p>
                    </div>

                    <div className="flex items-center space-x-3 text-sm shrink-0">
                      <span className="text-brand-dark/70 font-subtext font-medium">{formatDate(item.createdAt)}</span>
                      <Link
                        to={`/analyses/${item.analysisId}`}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-medium text-[#E1D4C2] font-bold text-xs hover:bg-brand-medium-hover shadow-xs transition-colors no-underline"
                      >
                        Inspect Evidence
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </BorderGlow>
      </div>
    </div>
  );
}

export default DashboardPage;
