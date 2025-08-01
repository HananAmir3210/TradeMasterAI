import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Zap, Calendar, DollarSign, TrendingUp, TrendingDown, Image, Target, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import TradeEntryForm from "../components/TradeEntryForm";
import ProfitLossDisplay from './ProfitLossDisplay';

interface Trade {
  id: string;
  title?: string;
  trade_pair: string;
  entry_price: number;
  exit_price?: number | null;
  trade_type: 'buy' | 'sell';
  lot_size: number;
  timeframe: string;
  status: 'open' | 'closed' | 'cancelled';
  notes?: string | null;
  chart_screenshot_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface TradeRecordsTableProps {
  trades: Trade[];
  onAnalyzeTrade: (tradeId: string) => void;
  onDeleteTrade?: (tradeId: string) => void;
  onUpdateTrade?: (tradeId: string, tradeData: any) => void;
  isAnalyzing?: boolean;
  className?: string;
}

export default function TradeRecordsTable({ 
  trades, 
  onAnalyzeTrade, 
  onDeleteTrade,
  onUpdateTrade,
  isAnalyzing = false,
  className 
}: TradeRecordsTableProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed' | 'cancelled'>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [analyzingTradeId, setAnalyzingTradeId] = useState<string | null>(null);

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.trade_pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (trade.notes && trade.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || trade.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAnalyze = async (tradeId: string) => {
    setAnalyzingTradeId(tradeId);
    try {
      await onAnalyzeTrade(tradeId);
    } finally {
      setAnalyzingTradeId(null);
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
  };

  const handleUpdateTrade = async (tradeId: string, tradeData: any) => {
    if (onUpdateTrade) {
      await onUpdateTrade(tradeId, tradeData);
      setEditingTrade(null);
    }
  };

  const handleDelete = async (tradeId: string) => {
    if (onDeleteTrade) {
      await onDeleteTrade(tradeId);
    }
  };

  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price) return 0;
    const priceDiff = trade.trade_type === 'buy' ? 
      trade.exit_price - trade.entry_price : 
      trade.entry_price - trade.exit_price;
    return Math.round(priceDiff * trade.lot_size * 100) / 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-secondary/20 text-secondary';
      case 'closed': return 'bg-primary/20 text-primary';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getTotalStats = () => {
    const closedTrades = filteredTrades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
    const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    return {
      totalTrades: filteredTrades.length,
      closedTrades: closedTrades.length,
      openTrades: filteredTrades.filter(t => t.status === 'open').length,
      totalPnL,
      winRate
    };
  };

  const stats = getTotalStats();

  if (editingTrade) {
    return (
      <TradeEntryForm
        editingTrade={editingTrade}
        onTradeUpdated={handleUpdateTrade}
        onTradeAdded={() => {}} // Not used in edit mode
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="animate-reveal">
        <h2 className="text-3xl font-bold text-foreground mb-2">Trade Records</h2>
        <p className="text-muted-foreground text-lg">Review and analyze your complete trading history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-reveal animate-reveal-delay-1">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Trades</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalTrades}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Open Trades</p>
                <p className="text-2xl font-bold text-secondary">{stats.openTrades}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Closed Trades</p>
                <p className="text-2xl font-bold text-foreground">{stats.closedTrades}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-foreground">{stats.winRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total P&L</p>
                <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ${stats.totalPnL.toFixed(2)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${stats.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-reveal animate-reveal-delay-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search trades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-input border-border"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'closed', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status as any)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Trade Records Table */}
      <Card className="glass-card animate-reveal animate-reveal-delay-3">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Asset</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Entry/Exit</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Size</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">P&L</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-50" />
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            {searchTerm || filterStatus !== 'all' ? 'No trades found' : 'No trades logged yet'}
                          </h3>
                          <p className="text-muted-foreground">
                            {searchTerm || filterStatus !== 'all' 
                              ? 'Try adjusting your search or filter criteria.' 
                              : 'Start by logging your first trade to see it here.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((trade) => {
                    const pnl = calculatePnL(trade);
                    
                    return (
                      <tr key={trade.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-foreground">{trade.trade_pair}</div>
                            {(trade.title || trade.notes) && (
                              <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-1">
                                {trade.title || trade.notes?.substring(0, 50) + (trade.notes?.length > 50 ? '...' : '')}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">{trade.timeframe}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={trade.trade_type === 'buy' ? 'default' : 'secondary'} className="gap-1">
                            {trade.trade_type === 'buy' ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {trade.trade_type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-foreground font-medium">{trade.entry_price}</div>
                            <div className="text-muted-foreground">
                              {trade.exit_price ? trade.exit_price : '—'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-foreground font-medium">{trade.lot_size}</td>
                        <td className="p-4">
                          {trade.status === 'closed' ? (
                            <span className={`font-bold ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                              ${pnl.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(trade.status)}>
                            {trade.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-muted-foreground">
                            {formatDate(trade.created_at)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/dashboard/trade/${trade.id}`)}
                              className="hover:bg-primary/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(trade)}
                              className="hover:bg-secondary/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAnalyze(trade.id)}
                              disabled={analyzingTradeId === trade.id}
                              className="hover:bg-primary/20"
                            >
                              <Zap className="h-4 w-4" />
                              {analyzingTradeId === trade.id ? 'Analyzing...' : 'AI'}
                            </Button>
                            
                            {onDeleteTrade && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this trade? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(trade.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>




    </div>
  );
}