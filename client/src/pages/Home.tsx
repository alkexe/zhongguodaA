/**
 * Design: 科技感仪表盘风格 - A股市场分析报告
 * - 深色主题 (#050D1F 背景)
 * - 玻璃拟态卡片 (Glassmorphism)
 * - 中国红涨绿跌配色
 * - Noto Serif SC 标题 / Roboto Mono 数字 / Noto Sans SC 正文
 * - 交互式 Recharts 图表
 */
import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/HXNo0QnZb38WsbRE48UVi8/sandbox/oct9bgl510cFdqubjaVB60-img-1_1771584836000_na1fn_YXN0b2NrLWhlcm8tYmc.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSFhObzBRblpiMzhXc2JSRTQ4VVZpOC9zYW5kYm94L29jdDliZ2w1MTBjRmRxdWJqYVZCNjAtaW1nLTFfMTc3MTU4NDgzNjAwMF9uYTFmbl9ZWE4wYjJOckxXaGxjbTh0WW1jLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=tx~xAIgR110u9Z6xTwEx7TIe5JpxkG2EW9lsRGcDXCrdHQO~EISTyBfwEsNZvtAzY2cKlk99t5lZpeCekX1M9AS5W7NcoCfupXSzbMfB6fzd-TmXDT1yS536F647iDofISlAxGUxfgZBH8OLferOpcrcAu2VSvJ4~5hWEegC~glEksgIPVJ5lHqmPZMRSExGQqJK2MsmATEZ-3TBFbyOYtpPX4Dj4tgsArq5Pf6QkFB7slAKjfhgKu4EAui5grKYlaUBt5ozLTenwqAQ-xE5R1tdVIPpKvH5woyR1NhwO-YmMpQ37D43IL-HLJXSK-M4lzVtCStOOtoQ9GQeNLgcGQ__";

// 上证指数近期日线数据（2026年1月-2月）
const shanghaiDailyData = [
  { date: "01/20", close: 4113.65, change: -0.01, vol: 73.44 },
  { date: "01/21", close: 4116.94, change: 0.08, vol: 66.70 },
  { date: "01/22", close: 4122.58, change: 0.14, vol: 70.97 },
  { date: "01/23", close: 4136.16, change: 0.33, vol: 78.21 },
  { date: "01/26", close: 4132.60, change: -0.09, vol: 88.74 },
  { date: "01/27", close: 4139.90, change: 0.18, vol: 75.50 },
  { date: "01/28", close: 4151.24, change: 0.27, vol: 82.30 },
  { date: "01/29", close: 4157.98, change: 0.16, vol: 90.59 },
  { date: "01/30", close: 4117.95, change: -0.96, vol: 80.43 },
  { date: "02/02", close: 4015.75, change: -2.48, vol: 73.30 },
  { date: "02/03", close: 4067.74, change: 1.29, vol: 63.77 },
  { date: "02/04", close: 4102.20, change: 0.85, vol: 67.43 },
  { date: "02/05", close: 4075.92, change: -0.64, vol: 59.67 },
  { date: "02/06", close: 4065.58, change: -0.25, vol: 55.67 },
  { date: "02/09", close: 4123.09, change: 1.41, vol: 57.26 },
  { date: "02/10", close: 4128.37, change: 0.13, vol: 52.46 },
  { date: "02/11", close: 4131.98, change: 0.09, vol: 50.07 },
  { date: "02/12", close: 4134.02, change: 0.05, vol: 52.94 },
  { date: "02/13", close: 4082.07, change: -1.26, vol: 50.08 },
];

// 2025全年月度数据
const monthlyData2025 = [
  { month: "1月", close: 3250, change: 0.5 },
  { month: "2月", close: 3320, change: 2.2 },
  { month: "3月", close: 3380, change: 1.8 },
  { month: "4月", close: 3290, change: -2.7 },
  { month: "5月", close: 3460, change: 5.2 },
  { month: "6月", close: 3510, change: 1.4 },
  { month: "7月", close: 3620, change: 3.1 },
  { month: "8月", close: 3580, change: -1.1 },
  { month: "9月", close: 3820, change: 6.7 },
  { month: "10月", close: 3900, change: 2.1 },
  { month: "11月", close: 3889, change: -0.3 },
  { month: "12月", close: 3968, change: 2.0 },
];

// 行业板块表现（2月13日）
const sectorData = [
  { name: "船舶制造", change: 3.82, color: "#E53935" },
  { name: "航天航空", change: 2.65, color: "#E53935" },
  { name: "军工", change: 1.43, color: "#E53935" },
  { name: "计算机设备", change: 0.87, color: "#E53935" },
  { name: "通用航空", change: 0.62, color: "#E53935" },
  { name: "医疗器械", change: -0.35, color: "#00C853" },
  { name: "白酒", change: -0.78, color: "#00C853" },
  { name: "房地产", change: -1.12, color: "#00C853" },
  { name: "银行", change: -1.45, color: "#00C853" },
  { name: "有色金属", change: -2.18, color: "#00C853" },
];

// 热门概念板块（节后预期）
const hotConceptsData = [
  { name: "人形机器人", score: 95, hot: true },
  { name: "AI芯片", score: 88, hot: true },
  { name: "低空经济", score: 82, hot: true },
  { name: "商业航天", score: 78, hot: true },
  { name: "AI大模型", score: 75, hot: true },
  { name: "新能源车", score: 65, hot: false },
  { name: "半导体", score: 72, hot: true },
  { name: "军工", score: 68, hot: false },
];

// 主要指数数据
const indicesData = [
  { name: "上证指数", value: 4082.07, change: -51.95, pct: -1.26, vol: "5008亿" },
  { name: "深证成指", value: 14100.19, change: -183.12, pct: -1.28, vol: "6821亿" },
  { name: "创业板指", value: 3275.96, change: -52.18, pct: -1.57, vol: "3245亿" },
  { name: "科创50", value: 1285.43, change: -18.76, pct: -1.44, vol: "1876亿" },
  { name: "北证50", value: 1342.18, change: -22.45, pct: -1.64, vol: "892亿" },
];

// 节后历史开门红概率
const postHolidayData = [
  { year: "2016", day1: 1, day5: 1 },
  { year: "2017", day1: 1, day5: 1 },
  { year: "2018", day1: 0, day5: 0 },
  { year: "2019", day1: 1, day5: 1 },
  { year: "2020", day1: 0, day5: 0 },
  { year: "2021", day1: 1, day5: 1 },
  { year: "2022", day1: 1, day5: 1 },
  { year: "2023", day1: 1, day5: 1 },
  { year: "2024", day1: 1, day5: 1 },
  { year: "2025", day1: 1, day5: 1 },
];

// 市场情绪雷达图
const sentimentData = [
  { subject: "流动性", A: 85 },
  { subject: "政策预期", A: 78 },
  { subject: "估值吸引力", A: 72 },
  { subject: "外资情绪", A: 58 },
  { subject: "技术面", A: 65 },
  { subject: "基本面", A: 70 },
];

// 资金流向
const moneyFlowData = [
  { name: "主力净流入", value: 1250, fill: "#E53935" },
  { name: "散户净流出", value: -890, fill: "#00C853" },
  { name: "北向资金", value: 320, fill: "#1E90FF" },
  { name: "融资余额", value: 18650, fill: "#FFD700" },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1500, decimals = 2) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = null;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return count;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function IndexCard({ index }: { index: typeof indicesData[0] }) {
  const isUp = index.change > 0;
  const animatedValue = useCountUp(index.value, 1200, 2);
  return (
    <div className={`glass-card rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${isUp ? 'glow-red' : 'glow-green'}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-white/50 font-sans">{index.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono-num ${isUp ? 'bg-stock-up stock-up' : 'bg-stock-down stock-down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(index.pct).toFixed(2)}%
        </span>
      </div>
      <div className="font-mono-num text-2xl font-semibold text-white">
        {animatedValue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
      </div>
      <div className={`text-sm font-mono-num mt-1 ${isUp ? 'stock-up' : 'stock-down'}`}>
        {isUp ? '+' : ''}{index.change.toFixed(2)}
      </div>
      <div className="text-xs text-white/40 mt-2">成交额 {index.vol}</div>
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif-cn text-xl font-semibold text-white">{children}</h2>
      {sub && <p className="text-sm text-white/40 mt-1">{sub}</p>}
      <div className="mt-2 h-px bg-gradient-to-r from-blue-500/50 via-blue-400/20 to-transparent" />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-xs border border-white/10">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-mono-num">
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [activeSector, setActiveSector] = useState<number | null>(null);

  const tabs = [
    { id: 'daily' as const, label: '近期日线' },
    { id: 'monthly' as const, label: '2025年月线' },
  ];

  const postHolidayUpDays = postHolidayData.filter(d => d.day1 === 1).length;
  const postHoliday5UpDays = postHolidayData.filter(d => d.day5 === 1).length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #050D1F 0%, #0A1628 50%, #060E20 100%)' }}>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '420px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})`, opacity: 0.35 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,13,31,0.3) 0%, rgba(5,13,31,0.7) 60%, rgba(5,13,31,1) 100%)' }} />

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(30,144,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative container py-16 pt-20">
          {/* Header nav */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <span className="text-blue-400 text-sm font-bold">A</span>
              </div>
              <span className="text-white/60 text-sm font-sans">A股市场分析</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                春节休市中
              </span>
              <span>复市：2026年2月24日</span>
              <span className="text-white/20">|</span>
              <span>报告日期：2026.02.20</span>
            </div>
          </div>

          {/* Hero title */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              蛇年收官 · 马年展望
            </div>
            <h1 className="font-serif-cn text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              中国大A股市场
              <br />
              <span className="gradient-text-gold">深度分析报告</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-xl">
              覆盖蛇年最后交易日（2026年2月13日）行情复盘、板块轮动分析、热点概念追踪及马年节后行情展望。
            </p>
          </div>

          {/* Quick stats bar */}
          <div className="flex flex-wrap gap-4 mt-10">
            {[
              { label: "上证收盘", value: "4,082.07", sub: "▼ 1.26%", color: "text-red-400" },
              { label: "深证成指", value: "14,100.19", sub: "▼ 1.28%", color: "text-red-400" },
              { label: "创业板指", value: "3,275.96", sub: "▼ 1.57%", color: "text-red-400" },
              { label: "全市场成交", value: "约1.2万亿", sub: "缩量收跌", color: "text-amber-400" },
              { label: "节后开门红概率", value: "70%", sub: "历史统计", color: "text-green-400" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-lg px-4 py-3 flex flex-col">
                <span className="text-white/40 text-xs">{s.label}</span>
                <span className={`font-mono-num text-lg font-semibold text-white mt-0.5`}>{s.value}</span>
                <span className={`text-xs font-mono-num ${s.color}`}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container pb-16">

        {/* ── Section 1: 主要指数 ── */}
        <section className="mt-12">
          <SectionTitle sub="2026年2月13日（蛇年最后交易日）收盘数据">主要指数表现</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {indicesData.map((idx, i) => (
              <IndexCard key={i} index={idx} />
            ))}
          </div>
        </section>

        {/* ── Section 2: 指数走势图 ── */}
        <section className="mt-12">
          <SectionTitle sub="上证综合指数近期走势与成交量">指数走势分析</SectionTitle>
          <div className="glass-card rounded-2xl p-6">
            {/* Tab switcher */}
            <div className="flex gap-2 mb-6">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    activeTab === t.id
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'daily' ? (
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={shanghaiDailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1E90FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="close" name="收盘价" stroke="#1E90FF" strokeWidth={2} fill="url(#colorClose)" dot={false} activeDot={{ r: 4, fill: '#1E90FF' }} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <p className="text-xs text-white/40 mb-2">成交量（亿元）</p>
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={shanghaiDailyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="vol" name="成交量" radius={[2, 2, 0, 0]}>
                        {shanghaiDailyData.map((entry, index) => (
                          <Cell key={index} fill={entry.change >= 0 ? '#E53935' : '#00C853'} fillOpacity={0.7} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyData2025} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[3000, 4200]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="close" name="月收盘" stroke="#FFD700" strokeWidth={2} fill="url(#colorMonthly)" dot={{ fill: '#FFD700', r: 3 }} activeDot={{ r: 5, fill: '#FFD700' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-xs text-white/30 mt-2 text-right">数据来源：东方财富Choice数据 / Investing.com</p>
        </section>

        {/* ── Section 3: 行业板块 ── */}
        <section className="mt-12">
          <SectionTitle sub="2月13日各行业板块涨跌幅（申万一级行业）">行业板块表现</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart */}
            <div className="glass-card rounded-2xl p-6">
              <p className="text-sm text-white/50 mb-4">主要行业涨跌幅（%）</p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sectorData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="change" name="涨跌幅" radius={[0, 4, 4, 0]}>
                    {sectorData.map((entry, index) => (
                      <Cell key={index} fill={entry.change >= 0 ? '#E53935' : '#00C853'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sector detail cards */}
            <div className="space-y-2">
              <p className="text-sm text-white/50 mb-3">板块详情</p>
              {sectorData.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeSector === i ? 'bg-white/10 border border-white/15' : 'glass-card hover:bg-white/[0.06]'
                  }`}
                  onClick={() => setActiveSector(activeSector === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.change >= 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="text-sm text-white/80">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(Math.abs(s.change) / 4 * 100, 100)}%`,
                          background: s.change >= 0 ? '#E53935' : '#00C853',
                          marginLeft: s.change < 0 ? 'auto' : undefined,
                        }}
                      />
                    </div>
                    <span className={`font-mono-num text-sm w-14 text-right ${s.change >= 0 ? 'stock-up' : 'stock-down'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-300/80 leading-relaxed">
                  <span className="font-semibold">板块点评：</span>船舶制造与航天航空逆市走强，受益于国防军工政策利好及低空经济概念催化；金融、有色等权重板块承压，拖累大盘整体下行。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: 热点概念 & 市场情绪 ── */}
        <section className="mt-12">
          <SectionTitle sub="当前市场热点追踪与情绪评估">热点概念与市场情绪</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Hot concepts */}
            <div className="glass-card rounded-2xl p-6">
              <p className="text-sm text-white/50 mb-5">热门概念板块热度排行</p>
              <div className="space-y-3">
                {hotConceptsData.map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className={`text-xs w-5 text-center font-mono-num ${i < 3 ? 'text-amber-400 font-bold' : 'text-white/30'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/80 flex items-center gap-2">
                          {c.name}
                          {c.hot && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">热</span>
                          )}
                        </span>
                        <span className="text-xs font-mono-num text-white/50">{c.score}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${c.score}%`,
                            background: i < 3
                              ? 'linear-gradient(90deg, #FFD700, #FFA500)'
                              : i < 5
                              ? 'linear-gradient(90deg, #1E90FF, #00BFFF)'
                              : 'rgba(255,255,255,0.3)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  <span className="font-semibold">春晚催化：</span>2026年央视春晚机器人"炸场"，宇树科技、魔法原子等多家公司亮相，人形机器人概念有望成为马年开门主线。
                </p>
              </div>
            </div>

            {/* Sentiment radar */}
            <div className="glass-card rounded-2xl p-6">
              <p className="text-sm text-white/50 mb-2">市场情绪六维评估</p>
              <p className="text-xs text-white/30 mb-4">综合评分（满分100）</p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={sentimentData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                  <Radar name="情绪评分" dataKey="A" stroke="#1E90FF" fill="#1E90FF" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {sentimentData.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-white/40">{s.subject}</div>
                    <div className={`font-mono-num text-sm font-semibold ${s.A >= 75 ? 'text-green-400' : s.A >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {s.A}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: 节后行情展望 ── */}
        <section className="mt-12">
          <SectionTitle sub="基于历史规律与当前市场环境的节后行情预判">马年节后行情展望</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Historical stats */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <p className="text-sm text-white/50 mb-5">春节后历史表现（2016-2025年，10年统计）</p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="font-mono-num text-4xl font-bold text-green-400">{postHolidayUpDays * 10}%</div>
                  <div className="text-sm text-white/50 mt-1">节后首日上涨概率</div>
                  <div className="text-xs text-white/30 mt-1">{postHolidayUpDays}/10年上涨</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="font-mono-num text-4xl font-bold text-blue-400">{postHoliday5UpDays * 10}%</div>
                  <div className="text-sm text-white/50 mt-1">节后5日上涨概率</div>
                  <div className="text-xs text-white/30 mt-1">{postHoliday5UpDays}/10年上涨</div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {postHolidayData.map((d, i) => (
                  <div key={i} className={`rounded-lg p-2 text-center ${d.day1 === 1 ? 'bg-red-500/15 border border-red-500/25' : 'bg-green-500/15 border border-green-500/25'}`}>
                    <div className="text-xs text-white/50">{d.year}</div>
                    <div className={`text-xs font-mono-num mt-1 ${d.day1 === 1 ? 'text-red-400' : 'text-green-400'}`}>
                      {d.day1 === 1 ? '↑ 红' : '↓ 绿'}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/30 mt-3">注：红色表示节后首日上涨（A股习惯：红涨绿跌）</p>
            </div>

            {/* Key factors */}
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-5">
                <p className="text-sm text-white/60 mb-3 font-semibold">利多因素</p>
                <ul className="space-y-2">
                  {[
                    "春晚机器人效应，概念催化强劲",
                    "节前缩量下跌，筹码充分换手",
                    "流动性充裕，货币政策宽松",
                    "历史节后上涨概率高达70-80%",
                    "港股马年首日AI、机器人大涨",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="text-red-400 mt-0.5 shrink-0">▲</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-sm text-white/60 mb-3 font-semibold">风险因素</p>
                <ul className="space-y-2">
                  {[
                    "外部关税政策不确定性",
                    "美股高位震荡，外围风险",
                    "节前资金已获利了结",
                    "成交量持续萎缩需关注",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="text-green-400 mt-0.5 shrink-0">▼</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6: 年度回顾 ── */}
        <section className="mt-12">
          <SectionTitle sub="2025蛇年A股全年表现回顾">蛇年年度收官数据</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "上证指数全年涨幅", value: "+18.41%", sub: "近6年最大年度涨幅", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "深证成指全年涨幅", value: "+29.87%", sub: "大幅跑赢沪指", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "创业板指全年涨幅", value: "+49.57%", sub: "成长股强势", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "科创50全年涨幅", value: "+35.92%", sub: "科技主线贯穿全年", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "北证50全年涨幅", value: "+38.80%", sub: "北交所表现亮眼", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "全年最高点", value: "4,190.87", sub: "上证指数52周高点", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "全年最低点", value: "3,040.69", sub: "上证指数52周低点", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { label: "A股跑赢美股", value: "✓ 显著", sub: "2025年全球资产比较", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-4 border ${item.bg} glass-card`}>
                <div className="text-xs text-white/40 mb-2">{item.label}</div>
                <div className={`font-mono-num text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-white/30 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 7: 重点个股 ── */}
        <section className="mt-12">
          <SectionTitle sub="2月13日市场热门个股与节后关注标的">重点个股追踪</SectionTitle>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["个股名称", "所属板块", "2/13涨跌", "节后关注理由", "风险提示"].map((h, i) => (
                      <th key={i} className="text-left px-4 py-3 text-xs text-white/40 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "中国船舶", sector: "船舶制造", change: "+3.82%", reason: "国防订单持续，出口景气度高", risk: "估值偏高" },
                    { name: "中航沈飞", sector: "航天航空", reason: "军机换代需求旺盛，低空经济催化", change: "+2.65%", risk: "业绩兑现周期长" },
                    { name: "新易盛", sector: "AI光模块", change: "+0.10%", reason: "AI算力基础设施核心受益标的", risk: "竞争加剧" },
                    { name: "中际旭创", sector: "AI光模块", change: "+0.67%", reason: "全球光模块龙头，AI需求持续", risk: "海外政策风险" },
                    { name: "光线传媒", sector: "影视传媒", change: "+15.39%", reason: "春节档票房超预期，内容价值重估", risk: "内容周期性强" },
                    { name: "紫金矿业", sector: "有色金属", change: "-4.96%", reason: "金价高位，长期资源价值", risk: "大宗商品周期" },
                  ].map((s, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 font-semibold text-white/90">{s.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-500/15 text-blue-300 border border-blue-500/25">{s.sector}</span>
                      </td>
                      <td className={`px-4 py-3 font-mono-num font-semibold ${s.change.startsWith('+') ? 'stock-up' : 'stock-down'}`}>
                        {s.change}
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{s.reason}</td>
                      <td className="px-4 py-3 text-amber-400/70 text-xs">{s.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-white/20 mt-2">⚠ 本报告仅供参考，不构成投资建议。股市有风险，入市需谨慎。</p>
        </section>

        {/* ── Section 8: 综合研判 ── */}
        <section className="mt-12">
          <SectionTitle sub="综合基本面、技术面与市场情绪的研判结论">综合研判与投资策略</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "短期（节后1-2周）",
                rating: "谨慎乐观",
                ratingColor: "text-green-400",
                bg: "bg-green-500/10 border-green-500/20",
                points: [
                  "历史节后上涨概率70%，有望开门红",
                  "春晚机器人概念提供短期催化",
                  "港股马年首日AI板块大涨，情绪传导",
                  "关注2月24日开盘首日量能变化",
                ],
              },
              {
                title: "中期（1-3个月）",
                rating: "结构性机会",
                ratingColor: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
                points: [
                  "人形机器人、AI应用为主要主线",
                  "低空经济、商业航天政策持续催化",
                  "关注两会政策预期（3月）",
                  "防御性配置关注高股息板块",
                ],
              },
              {
                title: "主要风险",
                rating: "需要关注",
                ratingColor: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
                points: [
                  "美国关税政策变化对出口链影响",
                  "美联储降息节奏影响外资流向",
                  "地产行业持续低迷拖累经济",
                  "市场成交量能否有效放大",
                ],
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-6 border glass-card ${item.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-cn text-base font-semibold text-white">{item.title}</h3>
                  <span className={`text-sm font-semibold ${item.ratingColor}`}>{item.rating}</span>
                </div>
                <ul className="space-y-2">
                  {item.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-white/60 leading-relaxed">
                      <span className="text-white/30 mt-0.5 shrink-0">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="font-serif-cn text-white/60 text-sm">中国A股市场深度分析报告</div>
              <div className="text-xs text-white/30 mt-1">报告生成日期：2026年2月20日 · 数据截至：2026年2月13日（蛇年最后交易日）</div>
            </div>
            <div className="text-xs text-white/20 max-w-sm text-right leading-relaxed">
              数据来源：东方财富Choice数据、Investing.com、证券时报、新浪财经<br />
              <span className="text-amber-400/50">⚠ 本报告仅供参考，不构成任何投资建议</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
