import React, { useEffect, useRef } from "react"
import { createChart } from "lightweight-charts"
import { startOfWeek, startOfMonth, format } from "date-fns"

const MyChart = ({ data, granularity }) => {
  const chartContainerRef = useRef()

  useEffect(() => {
    if (data) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        rightPriceScale: {
          visible: true, 
        },
        timeScale: {
          visible: true, 
        },
      })

      const barSeries = chart.addHistogramSeries({
        color: data.datasets[0].borderColor,
        lineWidth: 2,
        priceFormat: {
          type: 'volume',
        },
      })

      let groupedData
      if (granularity === "day") {
        groupedData = data.labels.map((label, index) => {
          return {
            time: label,
            value: data.datasets[0].data[index],
            color: 'rgba(75, 192, 192, 0.6)',
          }
        })
      } else if (granularity === "week") {
        const weekData = {}
        data.labels.forEach((label, index) => {
          const weekStart = format(startOfWeek(new Date(label)), 'yyyy-MM-dd')
          if (!weekData[weekStart]) {
            weekData[weekStart] = []
          }
          weekData[weekStart].push(data.datasets[0].data[index])
        })
        groupedData = Object.keys(weekData).map((weekStart) => {
          return {
            time: weekStart,
            value: weekData[weekStart].reduce((a, b) => a + b, 0),
            color: 'rgba(75, 192, 192, 0.6)',
          }
        })
      } else if (granularity === "month") {
        const monthData = {}
        data.labels.forEach((label, index) => {
          const monthStart = format(startOfMonth(new Date(label)), 'yyyy-MM-dd')
          if (!monthData[monthStart]) {
            monthData[monthStart] = []
          }
          monthData[monthStart].push(data.datasets[0].data[index])
        })
        groupedData = Object.keys(monthData).map((monthStart) => {
          return {
            time: monthStart,
            value: monthData[monthStart].reduce((a, b) => a + b, 0),
            color: 'rgba(75, 192, 192, 0.6)',
          }
        })
      }

      groupedData.sort((a, b) => new Date(a.time) - new Date(b.time))

      barSeries.setData(groupedData)

      chart.applyOptions({
        watermark: {
          visible: true,
          text: data.datasets[0].label,
          fontSize: 18,
          horzAlign: "center",
          vertAlign: "top",
        },
      })

      return () => chart.remove()
    }
  }, [data, granularity])

  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
}

export default MyChart