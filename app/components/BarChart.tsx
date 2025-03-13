"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@comp/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@comp/chart";

const chartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const generateBlueShades = (count: number) => {
  return Array.from(
    { length: count },
    (_, i) => `hsl(210, 100%, ${Math.max(10, 50 - i * (40 / (count - 1)))}%)`
  );
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
  kpiType: string;
  nomemp: string;
}

interface BarChartComponentProps {
  data: DataItem[];
  dateRange: { from: string; to: string };
}

export default function BarChartComponent({
  data,
  dateRange,
}: BarChartComponentProps) {
  const [name, setName] = useState("")
  const [kpiType, setkpiType] = useState("")
  const [company, setCompany] = useState("")
  const [valueVentas, setValueVentas] = useState(0)
  const [valueCompras, setValueCompras] = useState(0)
  const [typeCompanies, setTypeCompanies] = useState("")
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 300,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("PieChartComponent: Received data:", data);

    let kpiType = data[0]?.kpiType;

    if (kpiType) {
      setValueVentas(parseFloat(data[0]?.total_valor));
      setValueCompras(parseFloat(data[1]?.total_valor));
      setkpiType(kpiType || "");
    }

    const graphName = localStorage.getItem("selectedGraphName");
    setName(graphName || "");

    setCompany(data[0]?.nomemp);

    const savedTypeCompanies = localStorage.getItem("typeCompanies");
    setTypeCompanies(savedTypeCompanies || "");
  }, [data]);

  useEffect(() => {
    const updateChartDimensions = () => {
      if (cardRef.current) {
        const { width } = cardRef.current.getBoundingClientRect();
        setChartDimensions({ width, height: 300 });
      }
    };

    updateChartDimensions();
    window.addEventListener("resize", updateChartDimensions);

    return () => window.removeEventListener("resize", updateChartDimensions);
  }, []);

  const formattedData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      console.log("BarChartComponent: Processing data...");
      const sortedData = [...data].sort(
        (a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime()
      );
      const blueShades = generateBlueShades(sortedData.length);

      const formatted = sortedData.map((item, index) => ({
        period: item.periodo,
        total: parseFloat(item.total_valor),
        promedio: parseFloat(item.promedio_valor),
        fill: blueShades[index],
      }));

      console.log("BarChartComponent: Formatted Data:", formatted);
      return formatted;
    }
    console.warn("BarChartComponent: Invalid or empty data received");
    return [];
  }, [data]);

  console.log("BarChartComponent: Final formatted data:", formattedData);

  const totalGeneral = useMemo(() => {
    return formattedData.reduce((sum, item) => sum + item.total, 0);
  }, [formattedData]);

  const promedioTotal = useMemo(() => {
    return formattedData.length > 0 ? totalGeneral / formattedData.length : 0;
  }, [formattedData, totalGeneral]);

  if (!data || data.length === 0)
    return <div>No hay datos disponibles para mostrar.</div>;

  return (
    <Card ref={cardRef}>
      {typeCompanies !== "Multiple" && (
        <div
          style={{
            textAlign: "center",
            fontSize: "17px",
            fontWeight: 500,
            marginTop: "10px",
          }}
        >
          {company}
        </div>
      )}
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
              angle={-35}
              textAnchor="middle"
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill="var(--color-desktop)"
              radius={[8, 8, 8, 8]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {kpiType == "ventasVScompras" ? (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: "#0080ff" }}
              />
              Total Ventas : {formatNumber(valueVentas)}
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: "#001a33" }}
              />
              Total Compras : {formatNumber(valueCompras)}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4" /> Promedio diario:{" "}
              {formatNumber(promedioTotal)}
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              <DollarSign className="h-4 w-4" /> Total general:{" "}
              {formatNumber(totalGeneral)}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {new Date(dateRange.from).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(dateRange.to).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
