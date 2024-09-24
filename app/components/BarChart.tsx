'use client'

import { useEffect, useState, useRef } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { AlertModal } from "./AlertModal"

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

interface BarChartComponentProps {
  data: {
    results: DataItem[];
    promedioTotal: string;
  };
  dateRange: { from: string; to: string };
}

export default function BarChartComponent({ data, dateRange }: BarChartComponentProps) {
  const [formattedData, setFormattedData] = useState<{ period: string; total: number; promedio: number }[]>([])
  const [name, setName] = useState('')
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 300 })
  const [missingDataMessage, setMissingDataMessage] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('BarChartComponent: Received data:', data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setName(graphName || '')
  
    if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
      console.log('BarChartComponent: Processing data...')
      const sortedData = data.results.sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime());
      
      const formatted = sortedData.map(item => ({
        period: item.periodo,
        total: parseFloat(item.total_valor),
        promedio: parseFloat(item.promedio_valor),
      }));

      console.log('BarChartComponent: Formatted Data:', formatted)
      
      setFormattedData(formatted)

      // Check for missing data
      const allDates = getAllDatesInRange(new Date(dateRange.from), new Date(dateRange.to));
      const missingDates = allDates.filter(date => 
        !formatted.some(item => item.period === date.toISOString().split('T')[0])
      ).map(date => date.toISOString().split('T')[0]);

      if (missingDates.length > 0) {
        setMissingDataMessage(`No hay datos disponibles para las siguientes fechas: ${missingDates.join(', ')}`);
      } else {
        setMissingDataMessage(null);
      }
    } else {
      console.warn('BarChartComponent: Invalid or empty data received')
      setFormattedData([])
      setMissingDataMessage('No hay datos disponibles para el rango de fechas seleccionado.');
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
  
  console.log('BarChartComponent: Final formatted data:', formattedData)
  
  if (!data || !data.results || data.results.length === 0) {
    return <div>No hay datos disponibles para mostrar.</div>
  }

  return (
    <>
      <AlertModal message={missingDataMessage} />
      <Card ref={cardRef}>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
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
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="total"
                fill="var(--color-desktop)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Promedio diario de {name} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-2 font-semibold">
            Promedio Total: {formatNumber(parseFloat(data.promedioTotal))}
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

function getAllDatesInRange(startDate: Date, endDate: Date) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}