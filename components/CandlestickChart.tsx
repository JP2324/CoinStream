'use client'
import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/constant'
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { fetcher } from '@/lib/coingecko.actions'
import { convertOHLCData } from '@/lib/utils'

// Cache to store fetched data for each period (prevents repeated API calls)
const ohlcCache = new Map<string, OHLCData[]>()

const CandlestickChart = ({
    children,
    data,
    coinId,
    height = 360,
    initialPeriod = 'daily'
}: CandlestickChartProps) => {

    const chartContainerRef = useRef<HTMLDivElement | null>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    const [loading, setLoading] = useState(false)
    const [period, setPeriod] = useState(initialPeriod)
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? [])
    const [isPending, startTransition] = useTransition()

    // Cache initial data
    useEffect(() => {
        if (data && data.length > 0) {
            const cacheKey = `${coinId}-${initialPeriod}`
            ohlcCache.set(cacheKey, data)
        }
    }, [coinId, initialPeriod, data])

    const fetchOHLCData = async (selectedPeriod: Period) => {
        const cacheKey = `${coinId}-${selectedPeriod}`

        // Check cache first
        const cachedData = ohlcCache.get(cacheKey)
        if (cachedData) {
            setOhlcData(cachedData)
            return
        }

        try {
            setLoading(true)
            const config = PERIOD_CONFIG[selectedPeriod]
            const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days: config.days,
                interval: config.interval,
                precision: 'full'
            })

            if (newData && newData.length > 0) {
                ohlcCache.set(cacheKey, newData) // Store in cache
                setOhlcData(newData)
            }

        } catch (error) {
            console.error('Error in fetching ohlc data', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return

        startTransition(async () => {
            setPeriod(newPeriod)
            await fetchOHLCData(newPeriod)
        });
    }


    useEffect(() => {
        const container = chartContainerRef.current
        if (!container) return

        const showTime = ['daily', 'weekly', 'monthly'].includes(period)
        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth,
        });
        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig())

        // Convert ms to seconds for initial data
        const convertedData = ohlcData.map((item) =>
            [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData
        );
        series.setData(convertOHLCData(convertedData))
        chart.timeScale().fitContent()

        chartRef.current = chart
        candleSeriesRef.current = series

        const observer = new ResizeObserver((entries) => {
            if (!entries.length) return
            chart.applyOptions({
                width: entries[0].contentRect.width
            })
        })
        observer.observe(container) // Start observing OUTSIDE the callback

        // Cleanup function at useEffect level (NOT inside ResizeObserver)
        return () => {
            observer.disconnect()
            chart.remove()
            candleSeriesRef.current = null
            chartRef.current = null
        }
    }, [height])

    useEffect(() => {
        if (!candleSeriesRef.current) return
        const convertedToSeconds = ohlcData.map((item) =>
            [Math.floor(item[0] / 1000),
            item[1],
            item[2],
            item[3],
            item[4]] as OHLCData,
        );
        const converted = convertOHLCData(convertedToSeconds)
        candleSeriesRef.current.setData(converted)
        chartRef.current?.timeScale().fitContent()
    }, [ohlcData, period])


    return (
        <div id='candlestick-chart'>
            <div className='chart-header'>
                <div className='flex-1'>{children}</div>
                <div className='button-group'>
                    <span className='text-sm mx-2 font-medium text-purple-100/50'>Period:</span>
                    {
                        PERIOD_BUTTONS.map(({ value, label }) => (
                            <button key={value} className={
                                value === period ? 'config-button config-button-active' : 'config-button'
                            } onClick={() => { handlePeriodChange(value) }}
                                disabled={loading}>{label}</button>
                        ))
                    }
                </div>

            </div>

            <div ref={chartContainerRef} className='chart' style={{ height }}
            />

        </div>
    )
}

export default CandlestickChart