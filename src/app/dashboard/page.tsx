"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LogOut, Home, Trophy, Settings, BarChart3, Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pt-20 pb-24">
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white">
              Welcome back, <span className="text-primary">{user?.full_name}</span>!
            </h1>
            <p className="text-gray-400 mt-2">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="rounded-2xl glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Account Status</h3>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-white">Active</p>
            <p className="text-xs text-gray-500 mt-2">Ready to trade</p>
          </div>

          <div className="rounded-2xl glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Challenges</h3>
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-xs text-gray-500 mt-2">No active challenges</p>
          </div>

          <div className="rounded-2xl glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Total Profit</h3>
              <BarChart3 className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">$0.00</p>
            <p className="text-xs text-gray-500 mt-2">From challenges</p>
          </div>

          <div className="rounded-2xl glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Win Rate</h3>
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">—</p>
            <p className="text-xs text-gray-500 mt-2">No trades yet</p>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Challenge */}
          <Link
            href="/#challenges"
            className="rounded-2xl glass-panel p-8 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white">Start a Challenge</h3>
            </div>
            <p className="text-gray-400 text-sm">Choose an account size and begin your evaluation. Pass the challenge to unlock funding.</p>
            <div className="mt-4 flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
              <span className="text-sm font-semibold">View Challenges</span>
              <span>→</span>
            </div>
          </Link>

          {/* Account Settings */}
          <Link
            href="/account"
            className="rounded-2xl glass-panel p-8 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white">Account Settings</h3>
            </div>
            <p className="text-gray-400 text-sm">Manage your profile, security settings, and trading preferences.</p>
            <div className="mt-4 flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
              <span className="text-sm font-semibold">Go to Settings</span>
              <span>→</span>
            </div>
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold text-white mb-2">Getting Started</h3>
          <p className="text-gray-400 text-sm">
            Your account is ready! Start a challenge to begin your trading evaluation. You can trade on MT4, MT5, DXTrade, or cTrader after purchasing a challenge.
          </p>
        </div>
      </div>
    </div>
  );
}
