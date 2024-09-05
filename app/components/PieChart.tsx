import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import { useState, useEffect } from "react"

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
    label: "Venta",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const colorMap = {
  "total_valor": "hsl(var(--chart-1))",
  "promedio_valor": "hsl(var(--chart-1))",
}

export default function PieChartComponent({ data }: { data: { periodo: string, total_valor: number, promedio_valor: number }[] }) {
  const [selectedGraph, setSelectedGraph] = useState('')

  useEffect(() => {
    const graphName = localStorage.getItem('selectedGraphName')
    setSelectedGraph(graphName || '')
  }, [])

  const dataKey = selectedGraph.startsWith("Promedio") ? "promedio_valor" : "total_valor"

  const formattedData = data.map(item => ({
    month: item.periodo,
    value: parseFloat(item[dataKey].toString()), 
    fill: colorMap[dataKey], // Asigna el color aquí
  }))

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="ventas" hideLabel />}
            />
            <Pie data={formattedData} dataKey="value">
              <LabelList
                dataKey="month"
                className="fill-foreground"
                stroke="none"
                fontSize={12}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}