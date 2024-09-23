"use client"

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

export default function LineChartComponent({ data }: { data: { periodo: string, total_valor: number, promedio_valor: number }[] }) {
  const [formattedData, setFormattedData] = useState<{ month: string; total: number; promedio: number }[]>([])
  const [legendText, setLegendText] = useState<string[]>([])
  const [name, setName] = useState('')
  const [showAverage, setShowAverage] = useState(true)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 300 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('Original data:', data)
    
    if (data.length > 0) {
      const sortedData = data.sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime());
      
      const formatted = sortedData.map(item => ({
        month: item.periodo,
        total: parseFloat(item.total_valor.toString()),
        promedio: parseFloat(item.promedio_valor.toString()),
      }));

      console.log('Formatted Data:', formatted)
      
      setFormattedData(formatted)
      
      const isWithin15DaysRange = isWithin15Days(data.map(item => item.periodo))
      setShowAverage(isWithin15DaysRange)

      setLegendText(formatted.map(item => {
        return `${item.month}: ${isNaN(item.promedio) ? 'N/A' : formatNumber(item.promedio)}`
      }))
    }

    const name = localStorage.getItem('selectedGraphName')
    setName(name || '')
  }, [data])

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
  
  console.log('Final formatted data:', formattedData)
  console.log('Show Average:', showAverage)
  
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
              type="natural"
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
      {showAverage && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Promedio diario de {name} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {legendText.map((text, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: `hsl(210, 100%, ${Math.max(35, 50 - index * (30 / (legendText.length - 1)))}%)` }}
                ></span>
                {text}
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}