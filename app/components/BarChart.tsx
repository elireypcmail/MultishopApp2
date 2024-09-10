import { useEffect, useState } from "react"
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

export default function BarChartComponent({ data } : { data: { periodo: string, total_valor: number, promedio_valor: number }[] }) {
  const [selectedGraph, setSelectedGraph] = useState('')
  const [formattedData, setFormattedData] = useState<{ month: string; value: number }[]>([])
  
  useEffect(() => {
    console.log(data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setSelectedGraph(graphName || "")
  
    if (data.length > 0) {
      const dataKey = (graphName || "").startsWith("Promedio") ? "promedio_valor" : "total_valor"
      const formatted = data.map((item) => ({
        month: item.periodo,
        value: parseFloat(item[dataKey].toString()),
      }))
      console.log('Formatted Data:', formatted)
      console.log(dataKey)
      
      setFormattedData(formatted)
      console.log(formatted[0].value)
      
    }
  }, [data])  
  
  /* const formattedData = data.map(item => ({
    month: item.periodo,
    value: parseFloat(item[dataKey].toString()), 
  })) */

  console.log(formattedData)
  console.log(data)
  
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={formattedData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}