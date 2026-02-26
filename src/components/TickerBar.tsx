import { formatCurrency, formatPercent } from '@/lib/format';

interface Coin {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
}

export default function TickerBar({ coins }: { coins: Coin[] }) {
  const tickerItems = [...coins, ...coins];
  return (
    <div className="w-full overflow-hidden border-y border-white/10 bg-black/60 backdrop-blur">
      <div className="ticker-track flex w-max gap-8 px-6 py-2 text-sm">
        {tickerItems.map((coin, index) => (
          <div key={`${coin.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-semibold text-white">{coin.symbol}</span>
            <span className="text-white/70">{formatCurrency(coin.price, { maximumFractionDigits: 6 })}</span>
            <span className={coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatPercent(coin.change24h)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
