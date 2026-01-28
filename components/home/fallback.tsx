import React from 'react'
import DataTable from '../DataTable'
import { cn } from '@/lib/utils'

export const CoinOverviewFallback = () => {
    return (
        <div id='coin-overview-fallback'>
            <div className='header'>
                <div className='header-image skeleton' />
                <div className='info'>
                    <div className='header-line-sm skeleton' />
                    <div className='header-line-lg skeleton' />
                </div>
            </div>
            <div className='chart'>
                <div className='chart-skeleton skeleton' />
            </div>
        </div>
    )
}

export const TrendingCoinsFallback = () => {
    const columns: DataTableColumn<any>[] = [
        {
            header: 'Name',
            cellClassName: 'name-cell',
            cell: () => (
                <div className='name-link'>
                    <div className='name-image skeleton' />
                    <div className='name-line skeleton' />
                </div>
            ),
        },
        {
            header: '24h Change',
            cellClassName: 'change-cell',
            cell: () => (
                <div className='price-change'>
                    <div className='change-icon skeleton' />
                    <div className='change-line skeleton' />
                </div>
            ),
        },
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: () => <div className='price-line skeleton' />
        }
    ]

    const dummyData = Array(5).fill({})

    return (
        <div id='trending-coins-fallback'>
            <h4>Trending Coins</h4>
            <div className='trending-coins-table'>
                <DataTable
                    data={dummyData}
                    columns={columns}
                    rowKey={(_, index) => index}
                    tableClassName='trending-coins-table'
                    headerCellClassName="py-3!"
                    bodyCellClassName='py-2!'
                />
            </div>
        </div>
    )
}
