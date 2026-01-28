import React, { Suspense } from 'react'
import Image from 'next/image'
import DataTable from '@/components/DataTable'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Divide, TrendingDown, TrendingUp } from 'lucide-react'
import { fetcher } from '@/lib/coingecko.actions'
import CoinOverview from '@/components/home/CoinOverview'
import TrendingCoin from '@/components/home/TrendingCoin'
import { CoinOverviewFallback, TrendingCoinsFallback } from '@/components/home/fallback'



/*
const trendingCoins: TrendingCoin[] = [
  {
    item: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      market_cap_rank: 1,
      thumb: "/logo_coinstream_2.png",
      large: "/logo_coinstream_2.png",
      data: {
        price: 96543.21,
        price_change_percentage_24h: {
          usd: 2.34,
        },
      },
    },
  },
  {
    item: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      market_cap_rank: 2,
      thumb: "/coinPulse.png",
      large: "/coinPulse.png",
      data: {
        price: 3456.78,
        price_change_percentage_24h: {
          usd: -1.23,
        },
      },
    },
  },
  {
    item: {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      market_cap_rank: 5,
      thumb: "/logo.svg",
      large: "/logo.svg",
      data: {
        price: 123.45,
        price_change_percentage_24h: {
          usd: 5.67,
        },
      },
    },
  },
]
  */

const page = async () => {


  return (<main className='main-container'>
    <section className='home-grid'>
      <Suspense fallback={<CoinOverviewFallback />}>
        <CoinOverview />
      </Suspense>

      <Suspense fallback={<TrendingCoinsFallback />}>
        <TrendingCoin />
      </Suspense>
    </section>

    <section className='w-full mt-7 space-y-4'>
      <p>Categories</p>
    </section>
  </main>
  )
}


export default page