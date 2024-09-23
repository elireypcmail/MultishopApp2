'use client'

import { useEffect, useState, useRef } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import { Card, CardContent, CardFooter } from "@comp/card"
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

const generateBlueShades = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    `hsl(210, 100%, ${Math.max(35, 50 - i * (30 / (count - 1)))}%)`
  )
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(value);
}

const isWithin15Days = (dates: string[]) => {
  if (dates.length < 2) return false;
  const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const firstDate = new Date(sortedDates[0]);
  const lastDate = new Date(sortedDates[sortedDates.length - 1]);
  const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
}

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export default function BarChartComponent({ data }: { data: { periodo: string, total_valor: number, promedio_valor: number }[] }) {
  const [selectedGraph, setSelectedGraph] = useState('')
  const [formattedData, setFormattedData] = useState<{ month: string; value: number; fill: string; promedio: number }[]>([])
  const [legendText, setLegendText] = useState<string[]>([])
  const [name, setName] = useState('')
  const [showAverage, setShowAverage] = useState(true)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 300 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('Original data:', data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setSelectedGraph(graphName || "")
  
    if (data.length > 0) {
      const sortedData = data.sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime());
      const startDate = new Date(sortedData[0].periodo);
      const endDate = new Date(sortedData[sortedData.length - 1].periodo);
      const allDates = getDatesInRange(startDate, endDate);

      const blueShades = generateBlueShades(allDates.length)
      const formatted = allDates.map((date, index) => {
        const dateString = date.toISOString().split('T')[0];
        const dataPoint = data.find(item => item.periodo === dateString);
        return {
          month: dateString,
          value: dataPoint ? parseFloat(dataPoint.total_valor.toString()) : 0,
          fill: blueShades[index],
          promedio: dataPoint ? parseFloat(dataPoint.promedio_valor.toString()) : 0,
        }
      });

      console.log('Formatted Data:', formatted)
      
      setFormattedData(formatted)
      
      const isWithin15DaysRange = isWithin15Days(data.map(item => item.periodo))
      setShowAverage(!isWithin15DaysRange)

      if (!isWithin15DaysRange) {
        setLegendText(formatted.map(item => {
          return `${item.month}: ${isNaN(item.promedio) ? 'N/A' : formatNumber(item.promedio)}`
        }))
      } else {
        setLegendText([])
      }
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
  
  return (
    <Card ref={cardRef}>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={chartDimensions.width}
            height={chartDimensions.height}
            data={formattedData}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 60,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={30}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-desktop)" radius={8}>
              <LabelList
                dataKey="value"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={10}
                formatter={(value: number) => formatNumber(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {showAverage && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Promedio diario de {name} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {/*{legendText.map((text, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: formattedData[index]?.fill }}
                ></span>
                {text}
              </div>
            ))}*/}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}