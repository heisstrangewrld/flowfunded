"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  LogOut, Trophy, Settings, BarChart3, Loader2, TrendingUp, TrendingDown, 
  Activity, Zap, Eye, MoreVertical, ArrowUpRight, ArrowDownRight, Target,
  Award, Calendar, AlertCircle, CheckCircle2, BookOpen, DollarSign, Award as Certificate
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/login");
          return;
        }

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          full_name: authUser.user_metadata?.full_name || "Trader",
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const mockStats = [
    {
      label: "Account Balance",
      value: "$0.00",
      change: "+0%",
      isPositive: true,
      icon: BarChart3,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active Challenges",
      value: "0",
      change: "No challenges",
      isPositive: false,
      icon: Trophy,
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      label: "Total Profit",
      value: "$0.00",
      change: "+0%",
      isPositive: true,
      icon: TrendingUp,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Win Rate",
      value: "—",
      change: "No trades",
      isPositive: false,
      icon: Target,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
  ];

  const mockPositions = [
    {
      id: 1,
      symbol: "EURUSD",
      entry: 1.0850,
      current: 1.0875,
      pnl: "+$125.00",
      status: "Open",
      risk: "1.5%",
    },
    {
      id: 2,
      symbol: "GBPUSD",
      entry: 1.2640,
      current: 1.2620,
      pnl: "-$80.00",
      status: "Open",
      risk: "0.8%",
    },
  ];

  const mockActivity = [
    { action: "Challenge started", time: "2 hours ago", icon: Zap, color: "bg-primary/20" },
    { action: "Deposit received", time: "1 day ago", icon: ArrowDownRight, color: "bg-emerald-500/20" },
    { action: "Withdrawal completed", time: "3 days ago", icon: ArrowUpRight, color: "bg-blue-500/20" },
  ];

  return (
    <div className="relative min-h-screen bg-background pt-24 pb-24">
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, <span className="text-primary font-semibold">{user?.full_name}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 transition-all duration-200 hover:bg-primary/5"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="rounded-xl glass-panel p-5 border border-white/5 hover:border-white/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{stat.label}</span>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-xs font-medium ${stat.isPositive ? "text-emerald-400" : "text-gray-500"}`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-xl glass-panel border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Performance</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-all">
                  1D
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-400 hover:border-white/20 transition-all">
                  1W
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-400 hover:border-white/20 transition-all">
                  1M
                </button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-b from-primary/5 to-transparent rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-primary/30 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No chart data yet</p>
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="rounded-xl glass-panel border border-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-6">Portfolio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-gray-300">Capital</span>
                </div>
                <span className="text-sm font-bold text-white">$0.00</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm text-gray-300">Equity</span>
                </div>
                <span className="text-sm font-bold text-white">$0.00</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm text-gray-300">Profit/Loss</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Positions & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Open Positions */}
          <div className="lg:col-span-2 rounded-xl glass-panel border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Open Positions</h2>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Entry</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Current</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">P&L</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPositions.length > 0 ? (
                    mockPositions.map((position) => (
                      <tr key={position.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{position.symbol}</td>
                        <td className="px-6 py-4 text-gray-300">{position.entry}</td>
                        <td className="px-6 py-4 text-gray-300">{position.current}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${position.pnl.includes("-") ? "text-red-400" : "text-emerald-400"}`}>
                            {position.pnl}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{position.risk}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <Activity className="h-10 w-10 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm">No open positions</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl glass-panel border border-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {mockActivity.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className={`${item.color} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/#challenges"
            className="group rounded-xl glass-panel border border-white/5 p-8 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white">Start Challenge</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Begin an evaluation challenge and prove your trading skills. Choose from account sizes up to $2M.
            </p>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
              <span>Start Now</span>
              <span>→</span>
            </div>
          </Link>

          <Link
            href="/account"
            className="group rounded-xl glass-panel border border-white/5 p-8 hover:border-secondary/50 transition-all duration-300 hover:bg-secondary/5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20 group-hover:border-secondary/50 transition-all">
                <Settings className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-white">Settings</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Manage your profile, security settings, and trading preferences.
            </p>
            <div className="flex items-center gap-2 text-secondary text-sm font-semibold group-hover:gap-3 transition-all">
              <span>Go to Settings</span>
              <span>→</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Trade */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Trade</span>
            </button>

            {/* Certificate */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-emerald-500/50 transition-all duration-300 hover:bg-emerald-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
                <Certificate className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Certificate</span>
            </button>

            {/* Leaderboard */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-blue-500/50 transition-all duration-300 hover:bg-blue-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/50 transition-all">
                <Trophy className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Leaderboard</span>
            </button>

            {/* Competition */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-yellow-500/50 transition-all duration-300 hover:bg-yellow-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 border border-yellow-500/20 group-hover:border-yellow-500/50 transition-all">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Competition</span>
            </button>

            {/* Deposit */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-green-500/50 transition-all duration-300 hover:bg-green-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 group-hover:border-green-500/50 transition-all">
                <ArrowDownRight className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Deposit</span>
            </button>

            {/* Withdraw */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-orange-500/50 transition-all duration-300 hover:bg-orange-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:border-orange-500/50 transition-all">
                <ArrowUpRight className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Withdraw</span>
            </button>

            {/* Challenges */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-pink-500/50 transition-all duration-300 hover:bg-pink-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 border border-pink-500/20 group-hover:border-pink-500/50 transition-all">
                <Target className="h-5 w-5 text-pink-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Challenges</span>
            </button>

            {/* Rules */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cyan-400/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/20 group-hover:border-cyan-400/50 transition-all">
                <AlertCircle className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Rules</span>
            </button>

            {/* Academy */}
            <button className="group rounded-lg glass-panel border border-white/5 p-4 hover:border-purple-500/50 transition-all duration-300 hover:bg-purple-500/5 flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:border-purple-500/50 transition-all">
                <BookOpen className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-white text-center">Academy</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
