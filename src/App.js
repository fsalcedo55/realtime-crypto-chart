import React, { useState, useEffect, useRef } from "react"
import LineChart from "./components/LineChart"
import OrderBook from "./components/OrderBook"
import {
  formatData,
  formatCurrentArrays,
  formatNumber,
  filterCurrencies,
} from "./utils"

export default function App() {
  const [currencies, setcurrencies] = useState([])
  const [pair, setpair] = useState("")
  const [formattedArraysState, setformattedArraysState] = useState({})
  const [currentData, setCurrentData] = useState({})
  const [currentDisplayData, setCurrentDisplayData] = useState([])
  const [currentBestBidArr, setCurrentBestBidArr] = useState([])
  const [currentBestAskArr, setCurrentBestAskArr] = useState([])
  const [currentTimeArr, setCurrentTimeArr] = useState([])
  const [orderBookData, setOrderBookData] = useState({})
  const [numOfPrices, setNumOfPrices] = useState(250)
  const ws = useRef(null)
  let first = useRef(false)

  const url = "https://api.pro.coinbase.com"

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com")

    let pairs = []

    const apiCall = async () => {
      await fetch(url + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data))

      let filtered = filterCurrencies(pairs)

      setcurrencies(filtered)

      first.current = true
    }

    apiCall()
  }, [])

  useEffect(() => {
    if (!first.current) {
      return
    }

    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["level2", "ticker"],
    }
    let jsonMsg = JSON.stringify(msg)
    ws.current.send(jsonMsg)

    let formattedArrays = formatData(
      currentTimeArr,
      currentBestBidArr,
      currentBestAskArr
    )

    setformattedArraysState(formattedArrays)

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data)

      if (data.type === "snapshot") {
        setOrderBookData(data)
      }

      if (data.type !== "ticker") {
        return
      }

      if (data.product_id === pair) {
        setCurrentData(data)
      }
    }
  }, [pair])

  useEffect(() => {
    formatCurrentArrays(
      currentData,
      currentDisplayData,
      currentBestAskArr,
      currentBestBidArr,
      currentTimeArr,
      numOfPrices
    )
  }, [currentData])

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["level2", "ticker"],
    }
    let unsub = JSON.stringify(unsubMsg)

    ws.current.send(unsub)

    setpair(e.target.value)

    setCurrentDisplayData([])
    setCurrentBestAskArr([])
    setCurrentBestBidArr([])
    setCurrentTimeArr([])
    setOrderBookData({})
  }

  const handleNumOfPrices = (e) => {
    setNumOfPrices(e.target.value)
  }

  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col items-center justify-center drawer-content bg-base-100">
        {/* <!-- Page content here --> */}

        <div className="flex flex-col justify-between w-full min-h-screen p-8 overflow-auto">
          <div>
            <div className="navbar bg-base-100">
              <div className="gap-2 text-xl normal-case">
                Real Time Price Chart
              </div>
            </div>
            <div className="px-2">
              {currentData.price ? (
                <div className="flex items-center gap-28">
                  <div className="flex flex-col w-1/2">
                    <div className="text-sm">{currentData.product_id}</div>{" "}
                    <div className="text-6xl font-bold">
                      ${formatNumber(currentData.price)}
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2 min-w-max">
                    <div className="flex items-center gap-2">
                      <div className="text-sm">Granularity</div>
                      <span className="font-bold">{numOfPrices}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={numOfPrices}
                      className="range range-xs"
                      onInput={handleNumOfPrices}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  $<strong>0</strong>
                </div>
              )}
            </div>
            <div></div>
          </div>
          <div className="container">
            {currentData.price && (
              <div>
                <LineChart
                  data={formattedArraysState}
                  price={currentData.price}
                />
              </div>
            )}
          </div>
          {orderBookData.bids && (
            <OrderBook
              bestBid={orderBookData.bids}
              bestAsk={orderBookData.asks}
            />
          )}
        </div>
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open sidebar
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <ul className="p-4 overflow-y-auto menu w-80 bg-base-300 text-base-content">
          {/* <!-- Sidebar content here --> */}

          <div className="flex flex-col w-full">
            <div className="grid h-20 bg-base-300 rounded-box place-items-center">
              <div className="flex text-2xl">
                <div className="font-bold">Coin</div>
                <div className="font-extralight">Routes</div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="h-20 bg-base-300 rounded-box place-items-center">
              <li>
                <select
                  name="currency"
                  value={pair}
                  onChange={handleSelect}
                  className="w-full max-w-xs select select-primary"
                >
                  <option selected value={""}>
                    Select a currency pair
                  </option>
                  {currencies.map((cur, idx) => (
                    <option key={idx} value={cur.id}>
                      {cur.display_name}
                    </option>
                  ))}
                </select>
              </li>
            </div>
            {currentData.price && (
              <div className="shadow stats stats-vertical">
                <div className="stat">
                  <div className="flex items-center gap-2 stat-title">
                    Best Ask
                    <span className="flex w-3 h-3 rounded-full bg-accent-focus"></span>
                  </div>
                  <div className="stat-value">
                    <span className="text-lg font-extralight">$</span>
                    {formatNumber(currentBestAskArr.slice(-1))}
                  </div>
                </div>

                <div className="stat">
                  <div className="flex items-center gap-2 stat-title">
                    Best Bid
                    <span className="flex w-3 h-3 rounded-full bg-success"></span>
                  </div>
                  <div className="stat-value">
                    <span className="text-lg font-extralight">$</span>
                    {formatNumber(currentBestBidArr.slice(-1))}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">24H Low</div>
                  <div className="stat-value">
                    <span className="text-lg font-extralight">$</span>
                    {formatNumber(currentData.low_24h)}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">24H High</div>
                  <div className="stat-value">
                    <span className="text-lg font-extralight">$</span>
                    {formatNumber(currentData.high_24h)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  )
}
