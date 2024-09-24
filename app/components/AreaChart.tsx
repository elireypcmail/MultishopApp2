'use client'

import { useEffect, useState, useRef } from "react"
import { TrendingUp } from "lucide-react"
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

const isWithin15Days = (dates: string[]) => {
  if (dates.length < 2) return true;
  const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const firstDate = new Date(sortedDates[0]);
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);
  const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
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
  };
  dateRange: { from: string; to: string };
}

export default function LineChartComponent({ data, dateRange }: LineChartComponentProps) {
  const [formattedData, setFormattedData] = useState<{ month: string; total: number; promedio: number }[]>([])
  const [legendText, setLegendText] = useState<string[]>([])
  const [name, setName] = useState('')
  const [showAverage, setShowAverage] = useState(true)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 300 })
  const [missingDataMessage, setMissingDataMessage] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('LineChartComponent: Received data:', data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setName(graphName || '')
  
    if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
      console.log('LineChartComponent: Processing data...')
      const sortedData = data.results.sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime());
      
      const allDates = getAllDatesInRange(new Date(dateRange.from), new Date(dateRange.to));
      const formatted = allDates.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const dataPoint = sortedData.find(item => item.periodo === dateString);
        return {
          month: dateString,
          total: dataPoint ? parseFloat(dataPoint.total_valor) : 0,
          promedio: dataPoint ? parseFloat(dataPoint.promedio_valor) : 0,
        };
      });

      const isWithin15DaysRange = isWithin15Days(sortedData.map(item => item.periodo))
      
      // Filter out dates without data if more than 15 days are selected
      const filteredData = isWithin15DaysRange ? formatted : formatted.filter(item => item.total > 0);

      console.log('LineChartComponent: Formatted Data:', filteredData)
      
      setFormattedData(filteredData)
      setShowAverage(!isWithin15DaysRange)

      setLegendText(filteredData.map(item => {
        return `${item.month}: ${isNaN(item.promedio) ? 'N/A' : formatNumber(item.promedio)}`
      }))

      // Check for missing data
      const missingDates = formatted.filter(item => item.total === 0).map(item => item.month);
      if (missingDates.length > 0 && !isWithin15DaysRange) {
        setMissingDataMessage(`No hay datos disponibles para las siguientes fechas: ${missingDates.join(', ')}`);
      } else {
        setMissingDataMessage(null);
      }
    } else {
      console.warn('LineChartComponent: Invalid or empty data received')
      setFormattedData([])
      setLegendText([])
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
  
  console.log('LineChartComponent: Final formatted data:', formattedData)
  console.log('LineChartComponent: Show Average:', showAverage)
  
  if (!data || !data.results || data.results.length === 0) {
    return <div>No hay datos disponibles para mostrar.</div>
  }

  return (
    <>
      <AlertModal message={missingDataMessage} />
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
                dataKey="month"
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