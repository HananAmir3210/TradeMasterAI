import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Brain,
  BarChart3,
  Calendar,
  Zap,
  Award,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIFeedbackCard from "../components/AIFeedbackCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardHomeProps {
  trades: any[];
  userName?: string;
  className?: string;
}

export default function DashboardHome({ trades, userName = "Alex", className }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    avgRiskReward: 0,
    netPnL: 0,
    totalProfit: 0,
    totalLoss: 0,
    bestTrade: 0,
    worstTrade: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (trades.length === 0) return;

    const closedTrades = trades.filter(t => t.status === 'closed' && t.exit_price);
    const winningTrades = closedTrades.filter(t => {
      const pnl = t.trade_type === 'buy' ? 
        (t.exit_price - t.entry_price) * t.lot_size : 
        (t.entry_price - t.exit_price) * t.lot_size;
      return pnl > 0;
    });

    const totalProfit = closedTrades.reduce((acc, t) => {
      const pnl = t.trade_type === 'buy' ? 
        (t.exit_price - t.entry_price) * t.lot_size : 
        (t.entry_price - t.exit_price) * t.lot_size;
      return pnl > 0 ? acc + pnl : acc;
    }, 0);

    const totalLoss = closedTrades.reduce((acc, t) => {
      const pnl = t.trade_type === 'buy' ? 
        (t.exit_price - t.entry_price) * t.lot_size : 
        (t.entry_price - t.exit_price) * t.lot_size;
      return pnl < 0 ? acc + Math.abs(pnl) : acc;
    }, 0);

    const netPnL = totalProfit - totalLoss;
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

    const pnlValues = closedTrades.map(t => {
      const pnl = t.trade_type === 'buy' ? 
        (t.exit_price - t.entry_price) * t.lot_size : 
        (t.entry_price - t.exit_price) * t.lot_size;
      return pnl;
    });

    const bestTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
    const worstTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;

    const avgRiskReward = closedTrades.length > 0 ? 
      closedTrades.reduce((acc, t) => {
        const pnl = Math.abs(t.trade_type === 'buy' ? 
          (t.exit_price - t.entry_price) * t.lot_size : 
          (t.entry_price - t.exit_price) * t.lot_size);
        return acc + (pnl / t.lot_size);
      }, 0) / closedTrades.length : 0;

    setStats({
      totalTrades: trades.length,
      winRate,
      avgRiskReward,
      netPnL,
      totalProfit,
      totalLoss,
      bestTrade,
      worstTrade
    });

    // Generate chart data
    let runningPnL = 0;
    const chartData = closedTrades.map((trade, index) => {
      const pnl = trade.trade_type === 'buy' ? 
        (trade.exit_price - trade.entry_price) * trade.lot_size : 
        (trade.entry_price - trade.exit_price) * trade.lot_size;
      runningPnL += pnl;
      return {
        trade: index + 1,
        pnl: runningPnL,
        date: new Date(trade.created_at).toLocaleDateString()
      };
    });
    setChartData(chartData);
  }, [trades]);

  const sampleAIFeedback = {
    type: 'success' as const,
    title: 'Strong Performance This Week',
    message: 'Your EUR/USD and GBP/USD trades showed excellent risk management with consistent 2% risk allocation. Your entry timing has improved by 23% compared to last month.',
    score: 87
  };

  const StatCard = ({ title, value, icon: Icon, trend, subtitle, delay }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
    delay: number;
  }) => (
    <Card className={`glass-card stat-card transition-all duration-300 animate-reveal animate-reveal-delay-${delay}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${
            trend === 'up' ? 'bg-success/20' : 
            trend === 'down' ? 'bg-destructive/20' : 
            'bg-primary/20'
          }`}>
            <Icon className={`h-6 w-6 ${
              trend === 'up' ? 'text-success' : 
              trend === 'down' ? 'text-destructive' : 
              'text-primary'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Welcome Section */}
      <div className="animate-reveal">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's your trading performance overview and latest insights
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Trades"
          value={stats.totalTrades}
          icon={BarChart3}
          subtitle="All time"
          delay={1}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon={Target}
          trend={stats.winRate >= 50 ? 'up' : 'down'}
          subtitle="Closed trades"
          delay={2}
        />
        <StatCard
          title="Net P&L"
          value={`$${stats.netPnL.toFixed(2)}`}
          icon={DollarSign}
          trend={stats.netPnL >= 0 ? 'up' : 'down'}
          subtitle="Total profit/loss"
          delay={3}
        />
        <StatCard
          title="Best Trade"
          value={`$${stats.bestTrade.toFixed(2)}`}
          icon={Award}
          trend="up"
          subtitle="Highest profit"
          delay={4}
        />
      </div>

      {/* Performance Chart and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="glass-card animate-reveal animate-reveal-delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Performance Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="trade" 
                      stroke="#888"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#888"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(12, 12, 15, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`$${value.toFixed(2)}`, 'P&L']}
                      labelFormatter={(label) => `Trade #${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="pnl"
                      stroke="#00C896"
                      strokeWidth={2}
                      fill="url(#pnlGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No closed trades yet</p>
                    <p className="text-sm">Start trading to see your performance curve</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="space-y-6">
          <Card className="glass-card animate-reveal animate-reveal-delay-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Latest AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIFeedbackCard feedback={sampleAIFeedback} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card animate-reveal animate-reveal-delay-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="premium" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Log New Trade
              </Button>
              <Button variant="glass" className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                AI Strategy Review
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Trading Journal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card animate-reveal animate-reveal-delay-5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Profit</p>
                <p className="text-xl font-bold text-success">${stats.totalProfit.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-reveal animate-reveal-delay-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Loss</p>
                <p className="text-xl font-bold text-destructive">${stats.totalLoss.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-reveal animate-reveal-delay-7">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Avg Risk/Reward</p>
                <p className="text-xl font-bold text-primary">{stats.avgRiskReward.toFixed(2)}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}