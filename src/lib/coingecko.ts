const COINGECKO_IDS: Record<string, string> = {
  doge: 'dogecoin',
  pepe: 'pepe',
  bonk: 'bonk',
  wif: 'dogwifcoin',
  floki: 'floki',
  popcat: 'popcat',
  mog: 'mog-coin',
  giga: 'gigachad-2',
  spx6900: 'spx6900',
  fart: 'fartcoin',
  degen: 'degen-base',
  brett: 'based-brett',
  shib: 'shiba-inu',
  turbo: 'turbo',
  myro: 'myro',
  chad: 'chad-index',
  slerf: 'slerf',
  mumu: 'mumu-the-bull-3',
  bome: 'book-of-meme',
  ponke: 'ponke',
};

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

// Map our local IDs to CoinGecko IDs
function getCoinGeckoId(localId: string): string | undefined {
  return COINGECKO_IDS[localId];
}

// Chain mapping (CoinGecko doesn't give chain info, so we keep our own)
const CHAIN_MAP: Record<string, string> = {
  doge: 'ETH',
  pepe: 'ETH',
  bonk: 'SOL',
  wif: 'SOL',
  floki: 'ETH',
  popcat: 'SOL',
  mog: 'ETH',
  giga: 'SOL',
  spx6900: 'ETH',
  fart: 'SOL',
  degen: 'BASE',
  brett: 'BASE',
  shib: 'ETH',
  turbo: 'ETH',
  myro: 'SOL',
  chad: 'BASE',
  slerf: 'SOL',
  mumu: 'ETH',
  bome: 'SOL',
  ponke: 'SOL',
};

export async function fetchLiveCoins(): Promise<LiveCoin[]> {
  const ids = Object.values(COINGECKO_IDS).join(',');
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } }); // cache 60s
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const data = await res.json();

    // Reverse map: coingecko id -> local id
    const reverseMap: Record<string, string> = {};
    for (const [local, cg] of Object.entries(COINGECKO_IDS)) {
      reverseMap[cg] = local;
    }

    return data.map((coin: any) => {
      const localId = reverseMap[coin.id] || coin.id;
      return {
        id: localId,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        chain: CHAIN_MAP[localId] || 'ETH',
        price: coin.current_price ?? 0,
        change24h: coin.price_change_percentage_24h ?? 0,
        mcap: coin.market_cap ?? 0,
        volume24h: coin.total_volume ?? 0,
      };
    });
  } catch (err) {
    console.error('CoinGecko fetch failed, using fallback:', err);
    // Return empty — caller should fallback to static data
    return [];
  }
}
