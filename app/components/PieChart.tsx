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
import { AlertModal } from "./AlertModal"

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

interface PieChartComponentProps {
  data: {
    results: DataItem[];
    promedioTotal: string;
  };
  dateRange: { from: string; to: string };
}

export default function PieChartComponent({ data, dateRange }: PieChartComponentProps) {
  const [formattedData, setFormattedData] = React.useState<{ period: string; value: number; fill: string }[]>([])
  const [legendText, setLegendText] = React.useState<string[]>([])
  const [name, setName] = React.useState('')
  const [activePeriod, setActivePeriod] = React.useState('')
  const [chartDimensions, setChartDimensions] = React.useState({ width: 0, height: 0 })
  const [missingDataMessage, setMissingDataMessage] = React.useState<string | null>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    console.log('PieChartComponent: Received data:', data)
    
    const graphName = localStorage.getItem("selectedGraphName")
    setName(graphName || "")
  
    if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
      console.log('PieChartComponent: Processing data...')
      const sortedData = data.results.sort((a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime());
      const blueShades = generateBlueShades(sortedData.length)
      
      const allDates = getAllDatesInRange(new Date(dateRange.from), new Date(dateRange.to));
      const formatted = allDates.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const dataPoint = sortedData.find(item => item.periodo === dateString);
        return {
          period: dateString,
          value: dataPoint ? parseFloat(dataPoint.total_valor) : 0,
          fill: dataPoint ? blueShades[sortedData.indexOf(dataPoint)] : 'hsl(210, 100%, 90%)', // Lighter shade for missing data
        };
      });

      const isWithin15DaysRange = isWithin15Days(sortedData.map(item => item.periodo))
      
      // Filter out dates without data if more than 15 days are selected
      const filteredData = isWithin15DaysRange ? formatted : formatted.filter(item => item.value > 0);

      console.log('PieChartComponent: Formatted Data:', filteredData)
      
      setFormattedData(filteredData)
      setActivePeriod(filteredData[0].period)
      
      setLegendText(filteredData.map(item => `${item.period}: ${formatNumber(item.value)}`))

      // Check for missing data
      const missingDates = formatted.filter(item => item.value === 0).map(item => item.period);
      if (missingDates.length > 0 && !isWithin15DaysRange) {
        setMissingDataMessage(`No hay datos disponibles para las siguientes fechas: ${missingDates.join(', ')}`);
      } else {
        setMissingDataMessage(null);
      }
    } else {
      console.warn('PieChartComponent: Invalid or empty data received')
      setFormattedData([])
      setLegendText([])
      setMissingDataMessage('No hay datos disponibles para el rango de fechas seleccionado.');
    }
  }, [data, dateRange])

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

  if (!data || !data.results || data.results.length === 0) {
    return <div>No hay datos disponibles para mostrar.</div>
  }

  return (
    <>
      <AlertModal message={missingDataMessage} />
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
                        {`${formatNumber(value ?? 0)}`}
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
                            {formatNumber(formattedData[activeIndex]?.value ?? 0)}
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