'use client'

import { useEffect, useState, useRef } from "react"
import { TrendingUp, DollarSign } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

interface LineChartComponentProps {
  data: {
    results: DataItem[];
    promedioTotal: string;
    totalGeneral: string;
  };
  dateRange: { from: string; to: string };
}

export default function LineChartComponent({ data, dateRange }: LineChartComponentProps) {
  const [formattedData, setFormattedData] = useState<{ period: string; total: number; promedio: number }[]>([])
  const [name, setName] = useState('')
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 300 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('LineChartComponent: Received data:', data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setName(graphName || '')
  
    if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
      console.log('LineChartComponent: Processing data...')
      const sortedData = data.results.sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime());
      
      const formatted = sortedData.map(item => ({
        period: item.periodo,
        total: parseFloat(item.total_valor),
        promedio: parseFloat(item.promedio_valor),
      }));

      console.log('LineChartComponent: Formatted Data:', formatted)
      
      setFormattedData(formatted)
    } else {
      console.warn('LineChartComponent: Invalid or empty data received')
      setFormattedData([])
    }
  }, [data, dateRange])

  useEffect(() => {
    const updateChartDimensions = () => {
      if (cardRef.current) {
        const { width } = cardRef.current.getBoundingClientRect()
        setChartDimensions({ width, height: 300 })
      }
    }

    updateChartDimensions()
    window.addEventListener('resize', updateChartDimensions)

    return () => window.removeEventListener('resize', updateChartDimensions)
  }, [])
  
  console.log('LineChartComponent: Final formatted data:', formattedData)
  
  if (!data || !data.results || data.results.length === 0) {
    return <div>No hay datos disponibles para mostrar.</div>
  }

  return (
    <Card ref={cardRef}>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            width={chartDimensions.width}
            height={chartDimensions.height}
            data={formattedData}
            margin={{
              left: 0,
              right: 0,
              top: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={30}
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" /> Promedio diario: {formatNumber(parseFloat(data.promedioTotal))} 
        </div>
        <div className="flex items-center gap-2 font-medium leading-none">
          <DollarSign className="h-4 w-4" /> Total general: {formatNumber(parseFloat(data.totalGeneral))}
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {new Date(dateRange.from).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - {new Date(dateRange.to).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </div>
      </CardFooter>
    </Card>
  )
}