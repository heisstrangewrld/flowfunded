import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import CryptoPaymentOptions from "@/components/checkout/CryptoPaymentOptions";

const validFees: Record<string, string> = {
  "$10,000": "$99",
  "$25,000": "$199",
  "$50,000": "$299",
  "$100,000": "$499",
  "$200,000": "$899",
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requestedAccount = getSingleParam(params.account);
  const account = requestedAccount && validFees[requestedAccount] ? requestedAccount : "$50,000";
  const fee = validFees[account];

  const paymentOptions = [
    {
      id: "usdt-trc20",
      label: "USDT",
      network: "TRC20",
      address: process.env.PAYMENT_USDT_TRC20,
    },
    {
      id: "usdt-erc20",
      label: "USDT",
      network: "ERC20",
      address: process.env.PAYMENT_USDT_ERC20,
    },
    {
      id: "btc",
      label: "Bitcoin",
      network: "BTC",
      address: process.env.PAYMENT_BTC,
    },
    {
      id: "eth",
      label: "Ethereum",
      network: "ETH",
      address: process.env.PAYMENT_ETH,
    },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to challenges
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-xl glass-panel border border-white/5 p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Crypto Checkout</p>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Start your {account} challenge
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400">
                Send the refundable registration fee using one of the supported wallets. Your challenge access can be
                activated after payment confirmation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Protected", desc: "Manual payment review before account activation." },
                { icon: Clock, title: "Fast Review", desc: "Keep your transaction hash ready for support." },
                { icon: BadgeCheck, title: "Refundable", desc: "Fee refund is eligible on your first payout." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-bold text-white">After sending payment</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Save your transaction hash and contact support from the email used for your FlowFunded account. The
                automated confirmation step can be added next once the payment workflow is finalized.
              </p>
            </div>
          </section>

          <aside className="rounded-xl glass-panel border border-white/5 p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm text-gray-400">Challenge account</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{account}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Amount due</p>
                <p className="mt-1 text-2xl font-extrabold text-primary text-neon-glow">{fee}</p>
              </div>
            </div>

            <CryptoPaymentOptions options={paymentOptions} />

            <p className="mt-5 text-center text-[11px] leading-5 text-gray-500">
              Send only the selected asset on the matching network. Wrong-network payments may not be recoverable.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
