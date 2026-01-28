import React from 'react'
import { fetcher } from '@/lib/coingecko.actions'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import DataTable from '../DataTable'


const TrendingCoin = async () => {
    const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
        '/search/trending', undefined, 300);


    const columns: DataTableColumn<TrendingCoin>[] = [
        {
            header: 'Name',
            cellClassName: 'name-cell',
            cell: (coin) => {
                const item = coin.item
                return (
                    <Link href={`/coins/${item.id}`}>
                        <Image src={item.large} alt={item.name} width={36} height={36}></Image>
                        <p>{item.name}</p>
                    </Link>
                )
            },
        },
        {
            header: '24h Change',
            cellClassName: 'change-cell',
            cell: (coin) => {
                const item = coin.item
                const isTrendingUp = item.data.price_change_percentage_24h.usd > 0

                return (
                    <div className={cn('price-change', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
                        {isTrendingUp ? (
                            <TrendingUp width={16} height={16} />
                        ) : (
                            <TrendingDown width={16} height={16} />
                        )}
                        {item.data.price_change_percentage_24h.usd.toFixed(2)}%
                    </div>
                )
            },
        },
        {
            header: 'Price', cellClassName: 'price-cell',
            cell: (coin) =>
                coin.item.data.price
        }]
    return (
        <div id='trending-coin'>
            <h4>Trending Coins</h4>
            <div id='trending-coin'>
            <DataTable
                data={trendingCoins.coins.slice(0,6) || []}
                columns={columns}
                rowKey={(coin) => coin.item.id}
                tableClassName='trending-coins-table' 
                headerCellClassName = "py-3!"
                bodyCellClassName='py-2!'
                />
            </div>
        </div>
    )
}

export default TrendingCoin