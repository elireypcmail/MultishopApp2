"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { TrendingUp } from "lucide-react"

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
  );
}

const chartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface DataItem {
  periodo: string
  total_valor: number
  promedio_valor: number
}

export default function PieChartComponent({ data }: { data: DataItem[] }) {
  const [selectedGraph, setSelectedGraph] = React.useState('')
  const [formattedData, setFormattedData] = React.useState<{ period: string; value: number; fill: string }[]>([])
  const [legendText, setLegendText] = React.useState<string[]>([])
  const [name, setName] = React.useState('')
  const [activePeriod, setActivePeriod] = React.useState('')
  const [chartDimensions, setChartDimensions] = React.useState({ width: 0, height: 0 })
  const cardRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    console.log(data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setSelectedGraph(graphName || "")
  
    if (data.length > 0) {
      const blueShades = generateBlueShades(data.length)
      const formatted = data.map((item, index) => ({
        period: item.periodo,
        value: parseFloat(item.total_valor.toString()),
        fill: blueShades[index],
      }))
      console.log('Formatted Data:', formatted)
      
      setFormattedData(formatted)
      setActivePeriod(formatted[0].period)
      
      setLegendText(data.map(item => `${item.periodo}: ${item.promedio_valor}`))
    }

    const name = localStorage.getItem('selectedGraphName')
    setName(name || '')
  }, [data])

  React.useEffect(() => {
    const updateChartDimensions = () => {
      if (cardRef.current) {
        const { width } = cardRef.current.getBoundingClientRect()
        const height = Math.min(width, 400) // Limit height to 400px or width, whichever is smaller
        setChartDimensions({ width, height })
      }
    }

    updateChartDimensions()
    window.addEventListener('resize', updateChartDimensions)

    return () => window.removeEventListener('resize', updateChartDimensions)
  }, [])

  const activeIndex = React.useMemo(
    () => formattedData.findIndex((item) => item.period === activePeriod),
    [formattedData, activePeriod]
  )

  const handlePieClick = (data: any, index: number) => {
    setActivePeriod(data.period)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto" ref={cardRef}>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto w-full">
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
              activeIndex={activeIndex}
              activeShape={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                startAngle,
                endAngle,
                fill,
                payload,
                percent,
                value,
              }: PieSectorDataItem) => {
                const RADIAN = Math.PI / 180;
                const sin = Math.sin(-RADIAN * (midAngle ?? 0));
                const cos = Math.cos(-RADIAN * (midAngle ?? 0));
                const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
                const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
                const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
                const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
                const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                const ey = my;
                const textAnchor = cos >= 0 ? 'start' : 'end';

                return (
                  <g>
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                    />
                    <Sector
                      cx={cx}
                      cy={cy}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      innerRadius={(outerRadius ?? 0) + 6}
                      outerRadius={(outerRadius ?? 0) + 10}
                      fill={fill}
                    />
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                    <text 
                      x={ex + (cos >= 0 ? 1 : -1) * 12} 
                      y={ey} 
                      textAnchor={textAnchor} 
                      fill="#333"
                      className="text-xs"
                    >
                      {`${(value ?? 0).toFixed(2)}`}
                    </text>
                    <text 
                      x={ex + (cos >= 0 ? 1 : -1) * 12} 
                      y={ey} 
                      dy={18} 
                      textAnchor={textAnchor} 
                      fill="#999"
                      className="text-xs"
                    >
                      {`(${((percent ?? 0) * 100).toFixed(2)}%)`}
                    </text>
                  </g>
                );
              }}
              onClick={handlePieClick}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {(formattedData[activeIndex]?.value ?? 0).toFixed(2)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Promedio diario de {name} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {legendText.map((text, index) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: formattedData[index]?.fill }}
              ></span>
              {text}
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}