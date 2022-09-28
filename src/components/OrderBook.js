import React from "react"
import { formatNumber } from "../utils"

function OrderBook({ bestBid, bestAsk }) {
  return (
    <div>
      <div className="h-4"></div>
      <div className="py-4 text-2xl">Order Book</div>
      <div className="flex justify-center overflow-x-auto">
        <table className="table w-full text-right table-compact">
          {/* <!-- head --> */}
          <thead>
            <tr>
              <th>Market Size</th>
              <th>Price (USD)</th>
              <th>My Size</th>
            </tr>
          </thead>
          {bestAsk &&
            bestAsk
              .slice(0, 15)
              .reverse()
              .map((el, idx) => (
                <tbody key={idx}>
                  {/* <!-- row 1 --> */}
                  <tr>
                    <td>{formatNumber(el[1])}</td>
                    <td className="text-accent-focus">{formatNumber(el[0])}</td>
                    <td>-</td>
                  </tr>
                </tbody>
              ))}
          <thead>
            <tr>
              <th>USD Spread</th>
              <th>{formatNumber(bestAsk[0][0] - bestBid[0][0])}</th>
              <th></th>
            </tr>
          </thead>
          {bestBid &&
            bestBid.slice(0, 15).map((el, idx) => (
              <tbody key={idx}>
                {/* <!-- row 1 --> */}
                <tr>
                  <td>{formatNumber(el[1])}</td>
                  <td className="text-success">{formatNumber(el[0])}</td>
                  <td>-</td>
                </tr>
              </tbody>
            ))}
          <thead>
            <tr>
              <th>Aggregation</th>
              <th>{formatNumber(bestAsk.slice(-1) - bestBid.slice(-1))}</th>
              <th></th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

export default OrderBook
