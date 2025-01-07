"use client"

import { Label, Pie, PieChart }                 from "recharts"
import { TrendingUp, DollarSign }               from "lucide-react"
import { useState, useEffect, useMemo, useRef } from "react"

import {
  Card,
  CardContent,
  CardFooter,
} from "@comp/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@comp/chart"

const generateBlueShades = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    `hsl(210, 100%, ${Math.max(10, 50 - i * (40 / (count - 1)))}%)`
  )
}

const chartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(value);
}

interface DataItem {
  periodo: string;
  total_valor: string;
  promedio_valor: string;
}

interface PieChartComponentProps {
  data: DataItem[];
  dateRange: { from: string; to: string };
  dateTypeRange: string;
}

export default function PieChartComponent({ data, dateRange, dateTypeRange }: PieChartComponentProps) {
  const [name, setName]                       = useState('')
  const [activePeriod, setActivePeriod]       = useState('')
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('PieChartComponent: Received data:', data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setName(graphName || "")
  }, [data])

  useEffect(() => {
    const updateChartDimensions = () => {
      if (cardRef.current) {
        const { width } = cardRef.current.getBoundingClientRect()
        const height    = Math.min(width, 400) 
        setChartDimensions({ width, height })
      }
    }

    updateChartDimensions()
    window.addEventListener('resize', updateChartDimensions)

    return () => window.removeEventListener('resize', updateChartDimensions)
  }, [])

  const formattedData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      console.log('PieChartComponent: Processing data...')
      const sortedData = [...data].sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime())
      const blueShades = generateBlueShades(sortedData.length)
      
      const formatted = sortedData.map((item, index) => ({
        period: item.periodo,
        value:  parseFloat(item.total_valor),
        fill:   blueShades[index],
      }))

      console.log('PieChartComponent: Formatted Data:', formatted)
      
      return formatted.filter(item => item.value > 0)
    }
    console.warn('PieChartComponent: Invalid or empty data received')
    return []
  }, [data])

  useEffect(() => {
    setActivePeriod(formattedData[0]?.period || '')
  }, [formattedData])

  const activeIndex = useMemo(
    () => formattedData.findIndex((item) => item.period === activePeriod),
    [formattedData, activePeriod]
  )

  const handlePieClick = (data: any, index: number) => {
    setActivePeriod(data.period)
  }

  const totalValue    = useMemo(() => formattedData.reduce((sum, item) => sum + item.value, 0), [formattedData])
  const promedioTotal = useMemo(() => formattedData.length > 0 ? totalValue / formattedData.length : 0, [formattedData, totalValue])

  if (!data || data.length === 0) return <div>No hay datos disponibles para mostrar.</div>

  const activeData = formattedData[activeIndex]
  const percentage = activeData ? (activeData.value / totalValue) * 100 : 0

  return (
    <Card className="w-full z-50" ref={cardRef}>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto w-full z-50">
          <PieChart width={chartDimensions.width} height={chartDimensions.height}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="period"
              cx="50%"
              cy="50%"
              innerRadius={chartDimensions.width * 0.15}
              outerRadius={chartDimensions.width * 0.3}
              strokeWidth={5}
              onClick={handlePieClick}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const cy = viewBox.cy ?? 0; 
                    return (
                      <g>
                        <text
                          x={viewBox.cx ?? 0}
                          y={cy - 21}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-[13px]"
                        >
                          {percentage.toFixed(2)}%
                        </text>
                        <text
                          x={viewBox.cx ?? 0}
                          y={cy + 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-xl font-bold"
                        >
                          {formatNumber(activeData?.value ?? 0)}
                        </text>
                        <text
                          x={viewBox.cx ?? 0}
                          y={cy + 25}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-[13px]"
                        >
                          Total
                        </text>
                      </g>
                    )
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" /> Promedio {dateTypeRange}: {formatNumber(promedioTotal)} 
        </div>
        <div className="flex items-center gap-2 font-medium leading-none">
          <DollarSign className="h-4 w-4" /> Total General: {formatNumber(totalValue)}
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {new Date(dateRange.from).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - {new Date(dateRange.to).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </div>
      </CardFooter>
    </Card>
  )
}