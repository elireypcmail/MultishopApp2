"use client";

import { Label, Pie, PieChart } from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";

import { Card, CardContent, CardFooter } from "@comp/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@comp/chart";

// Paleta ajustada: El azul principal es más vibrante, los demás son oscuros para contraste
const generateBlueShades = (count: number) => {
  const customPalette = [
    "#3b82f6", // Azul principal (más claro/vivo)
    "#1e3a8a", // Azul real oscuro
    "#001a33", // Navy profundo
    "#312e81", // Indigo oscuro
    "#0f172a", // Slate casi negro
    "#1e293b", // Slate grisáceo oscuro
  ];

  return Array.from(
    { length: count },
    (_, i) => customPalette[i % customPalette.length]
  );
};

const chartConfig = {
  desktop: {
    label: "TOTAL",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
};

const parseDateRange = (dateStr: string) => {
  if (!dateStr) return { from: "", to: "" };
  const dates = dateStr.split(" - ").map((date) => date.trim());
  if (dates.length === 2) {
    return { from: dates[0], to: dates[1] };
  }
  return { from: dateStr, to: dateStr }; 
};

interface DataItem {
  periodo: string;
  total_valor: string;
  promedio_valor: string;
  label?: string;
  kpiType?: string;
  nomemp?: string;
  nomempc?: string;
  sincro?: string;
}

interface PieChartMixedComponentProps {
  data: DataItem[];
  dateRange: { from: string; to: string };
  dateTypeRange?: string;
}

export default function PieChartMixedComponent({
  data,
  dateRange,
  dateTypeRange,
}: PieChartMixedComponentProps) {
  const [name, setName] = useState("");
  const [activeCompany, setActiveCompany] = useState("");
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graphName = localStorage.getItem("selectedGraphName");
    setName(graphName || "");
  }, [data]);

  useEffect(() => {
    const updateChartDimensions = () => {
      if (cardRef.current) {
        const { width } = cardRef.current.getBoundingClientRect();
        // Ajustamos la altura para mantener la proporción con el gráfico más grande
        const height = Math.min(width, 480); 
        setChartDimensions({ width, height });
      }
    };

    updateChartDimensions();
    window.addEventListener("resize", updateChartDimensions);
    return () => window.removeEventListener("resize", updateChartDimensions);
  }, []);

  const formattedData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      let groupedData = data.map((item) => ({
        ...item,
        companyName: item.nomempc || item.nomemp || "SIN NOMBRE",
        value: parseFloat(item.total_valor) || 0,
        label: item.label,
      }));

      groupedData.sort((a, b) => b.value - a.value);
      const shades = generateBlueShades(groupedData.length);

      return groupedData.map((item, index) => {
        let finalColor;
        if (name === "Análisis de Ventas vs Compras") {
          finalColor = (item.label === "Ventas" || item.label === "Valor Total") 
            ? "#3b82f6" 
            : "#001a33";
        } else {
          // Asignación estricta por paleta para diferenciar empresas
          finalColor = shades[index];
        }

        return { ...item, fill: finalColor };
      }).filter((item) => item.value > 0);
    }
    return [];
  }, [data, name]);

  useEffect(() => {
    setActiveCompany(formattedData[0]?.companyName || "");
  }, [formattedData]);

  const activeIndex = useMemo(
    () => formattedData.findIndex((item) => item.companyName === activeCompany),
    [formattedData, activeCompany]
  );

  const handlePieClick = (data: any) => {
    if (data && data.companyName) {
      setActiveCompany(data.companyName);
    }
  };

  const totalValue = useMemo(
    () => formattedData.reduce((sum, item) => sum + item.value, 0),
    [formattedData]
  );
  
  const promedioTotal = useMemo(
    () => (formattedData.length > 0 ? totalValue / formattedData.length : 0),
    [formattedData, totalValue]
  );

  if (!data || data.length === 0)
    return <div className="p-4 text-center">NO HAY DATOS DISPONIBLES.</div>;

  const activeData = formattedData[activeIndex] || formattedData[0];
  const percentage = activeData && totalValue > 0 ? (activeData.value / totalValue) * 100 : 0;

  const parsedDateRange = dateRange?.from ? parseDateRange(dateRange.from) : { from: "", to: "" };
  const parsedDateRangeTo = dateRange?.to ? parseDateRange(dateRange.to) : { from: "", to: "" };

  return (
    <Card className="w-full z-50 border-none shadow-none" ref={cardRef}>
      <CardContent className="p-0 flex justify-center items-center">
        <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square max-h-[480px]">
          <PieChart
            width={chartDimensions.width}
            height={chartDimensions.height}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="companyName"
              cx="50%"
              cy="50%"
              // Radios aumentados para un gráfico mucho más grande
              innerRadius={chartDimensions.width * 0.22} 
              outerRadius={chartDimensions.width * 0.40} 
              strokeWidth={4}
              onClick={(_, index) => handlePieClick(formattedData[index])}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const cy = viewBox.cy ?? 0;
                    return (
                      <g>
                        <text
                          x={viewBox.cx ?? 0}
                          y={cy - 25}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-[14px]"
                        >
                          {name !== "Análisis de Ventas vs Compras" && (
                            <>{percentage.toFixed(2)}%</>
                          )}
                        </text>
                        <text
                          x={viewBox.cx ?? 0}
                          y={cy + 8}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-2xl font-bold"
                        >
                          ${formatNumber(activeData?.value ?? 0)}
                        </text>
                        <text
                          x={viewBox.cx ?? 0}
                          y={cy + 40}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-[12px] font-semibold uppercase"
                        >
                          {activeData?.companyName.length > 20 
                            ? `${activeData?.companyName.substring(0, 17)}...` 
                            : activeData?.companyName || "TOTAL"}
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm uppercase pt-6">
        {name === "Análisis de Ventas vs Compras" ? (
          <div className="flex justify-center flex-row text-[1rem] gap-6">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-4 h-4 rounded-full bg-[#3b82f6]" />
              <span className="text-[13px] font-light">TOTAL VENTAS</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <div className="w-4 h-4 rounded-full bg-[#001a33]" />
              <span className="text-[13px] font-light">TOTAL COMPRAS</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4" /> PROMEDIO {dateTypeRange}:{" "}
              ${formatNumber(promedioTotal)}
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              <DollarSign className="h-4 w-4" /> TOTAL GENERAL:{" "}
              ${formatNumber(totalValue)}
            </div>
          </div>
        )}

        {parsedDateRange.from && (
          <div className="flex items-center gap-2 leading-none text-muted-foreground text-[12px] mt-4">
            {new Date(parsedDateRange.from).toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}{" "}
            -{" "}
            {new Date(parsedDateRangeTo.to || parsedDateRange.from).toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}