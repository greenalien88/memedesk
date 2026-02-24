export interface LiveCoin {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  price: number;
  change24h: number;
  mcap: number;
  volume24h: number;
}

// Known chain mappings for popular memecoins (fallback: detect from CoinGecko platforms or default to MULTI)
const KNOWN_CHAINS: Record<string, string> = {
  dogecoin: 'MULTI',
  pepe: 'ETH',
  'shiba-inu': 'ETH',
  bonk: 'SOL',
  dogwifcoin: 'SOL',
  floki: 'MULTI',
  popcat: 'SOL',
  'mog-coin': 'ETH',
  'gigachad-2': 'SOL',
  spx6900: 'ETH',
  fartcoin: 'SOL',
  'degen-base': 'BASE',
  'based-brett': 'BASE',
  turbo: 'ETH',
  myro: 'SOL',
  slerf: 'SOL',
  'book-of-meme': 'SOL',
  ponke: 'SOL',
  'trump-official': 'SOL',
  'ai16z': 'SOL',
  'goatseus-maximus': 'SOL',
  pengu: 'SOL',
  neiro: 'ETH',
  'moo-deng': 'SOL',
  'peanut-the-squirrel': 'SOL',
};

/**
 * Fetch top memecoins from CoinGecko's meme-token category.
 * Returns up to `limit` coins sorted by market_cap_desc.
 */
export async function fetchLiveCoins(limit = 30): Promise<LiveCoin[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=${limit}&sparkline=false&price_change_percentage=24h`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const data = await res.json();

    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      chain: KNOWN_CHAINS[coin.id] || 'MULTI',
      price: coin.current_price ?? 0,
      change24h: coin.price_change_percentage_24h ?? 0,
      mcap: coin.market_cap ?? 0,
      volume24h: coin.total_volume ?? 0,
    }));
  } catch (err) {
    console.error('CoinGecko fetch failed, using fallback:', err);
    return [];
  }
}
