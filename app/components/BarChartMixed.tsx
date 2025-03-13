"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { TrendingUp, DollarSign } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import { Card, CardHeader, CardContent, CardFooter } from "@comp/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@comp/chart";

const chartConfig: ChartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
};

interface DataItem {
  periodo: string;
  total_valor: string;
  promedio_valor: string;
  label: string;
  kpiType: string;
  nomemp: string;
  nomempc: string;
  sincro: string;
}

interface BarChartComponentProps {
  data: DataItem[];
  dateRange: { from: string; to: string };
}

const CustomLabel = ({ x, y, width, height, value }: any) => {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const textWidth = 50;
  const insideBar = width > textWidth + 10;
  const textColor = insideBar ? "white" : isDarkMode ? "white" : "black";

  return (
    <text
      x={insideBar ? x + width / 2 : x + width + 5}
      y={y + height / 2}
      fill={textColor}
      textAnchor={insideBar ? "middle" : "start"}
      dominantBaseline="middle"
      fontSize={12}
    >
      {formatNumber(value)}
    </text>
  );
};

export default function BarChartMixedComponent({
  data,
}: BarChartComponentProps) {
  const [dateSincro, setDateSincro] = useState("");
  const [graphName, setName] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [typeCompanies, setTypeCompanies] = useState("");

  const cardRef = useRef(null);

  useEffect(() => {
    console.log("BarChartComponent: Received data:", data);

    const graphName = localStorage.getItem("selectedGraphName");
    setName(graphName || "");

    setNameCompany(data[0]?.nomemp);

    const savedTypeCompanies = localStorage.getItem("typeCompanies");
    setTypeCompanies(savedTypeCompanies || "");
  }, [data]);

  const combinedData = useMemo(() => {
    let groupedData = data.map((item) => ({
      ...item,
      companyName: item.nomempc,
      total: parseFloat(item.total_valor),
      promedio: parseFloat(item.promedio_valor),
      label: item.label,
      fill:
        item.label === "Valor Total" || item.label === "Ventas"
          ? "#3b82f6"
          : "#001a33",
    }));

    if (graphName === "Análisis de Ventas vs Compras") {
      return groupedData
    }
    
    return groupedData.sort((a, b) => b.total - a.total);
  }, [data, graphName]);

  console.log(combinedData);

  if (!data.length) return <div>No hay datos disponibles para mostrar.</div>;

  return (
    <div>
      <div>
        <Card
          ref={cardRef}
          className="w-full max-w-7xl flex flex-col justify-center items-center h-[50vh]"
        >
          {typeCompanies !== "Multiple" && (
            <div
              style={{
                textAlign: "center",
                fontSize: "17px",
                fontWeight: 500,
                marginTop: "10px",
              }}
            >
              {nameCompany}
            </div>
          )}
          <CardContent>
            <ChartContainer
              config={chartConfig}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                minHeight: "50vh",
                width: "80vw",
                overflowY: "auto",
              }}
            >
              <BarChart accessibilityLayer data={combinedData} layout="vertical">
                <CartesianGrid horizontal={true} />
                <YAxis
                  dataKey="companyName"
                  type="category"
                  color="#fff"
                  tickLine={false}
                  axisLine={false}
                />
                <XAxis dataKey="total" type="number" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="total"
                  layout="vertical"
                  fill="var(--color-desktop)"
                  radius={4}
                  width={120}
                  height={100}
                >
                  <LabelList
                    dataKey="total"
                    content={(props) => <CustomLabel {...props} />}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      {graphName == "Análisis de Ventas vs Compras" && (
        <div className="flex justify-center flex-row text-[1rem] gap-4 mt-4">
          <div className="flex items-center gap-2 font-medium leading-none">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-sm font-light">Total Ventas</span>
          </div>
          <div className="flex items-center gap-2 font-medium leading-none">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: "#001a33" }}
            />
            <span className="text-sm font-light">Total Compras</span>
          </div>
        </div>
      )}
    </div>
  );
}