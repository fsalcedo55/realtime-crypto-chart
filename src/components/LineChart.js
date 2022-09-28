import React from "react"
import { Line } from "react-chartjs-2"
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

function LineChart({ price, data }) {
  const opts = {
    tooltips: {
      intersect: false,
      mode: "index",
    },
    responsive: true,
    maintainAspectRatio: false,
    transitions: false,
  }
  if (price === "0.00") {
    return <h2>please select a currency pair</h2>
  }
  return (
    <div>
      <div className="lg:h-[34rem] h-96">
        <Line data={data} options={opts} />
      </div>
    </div>
  )
}

export default LineChart
