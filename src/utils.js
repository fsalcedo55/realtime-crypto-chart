export const filterCurrencies = (pairs) => {
  const newArr = []
  let filtered = pairs.forEach((pair) => {
    if (pair.id === "ETH-USD") {
      newArr.push(pair)
    }
    if (pair.id === "BTC-USD") {
      newArr.push(pair)
    }
    if (pair.id === "LTC-USD") {
      newArr.push(pair)
    }
    if (pair.id === "BCH-USD") {
      newArr.push(pair)
    }
  })

  filtered = newArr.sort((a, b) => {
    if (a.base_currency < b.base_currency) {
      return -1
    }
    if (a.base_currency > b.base_currency) {
      return 1
    }
    return 0
  })

  return filtered
}

export const formatCurrentArrays = (
  currData,
  currDisplayData,
  currBestAskArr,
  currBestBidArr,
  currTimeArr,
  numOfPrices
) => {
  if (currDisplayData.length < numOfPrices) {
    currDisplayData.push(currData)
    currBestAskArr.push(currDisplayData[currDisplayData.length - 1]?.best_ask)
    currBestBidArr.push(currDisplayData[currDisplayData.length - 1]?.best_bid)
    currTimeArr.push(
      new Date(
        Date.parse(currDisplayData[currDisplayData.length - 1]?.time)
      ).toLocaleTimeString("en-US")
    )
  } else if (currDisplayData.length > numOfPrices) {
    currDisplayData.shift()
    currBestAskArr.shift(currDisplayData[currDisplayData.length - 1]?.best_ask)
    currBestBidArr.shift(currDisplayData[currDisplayData.length - 1]?.best_bid)
    currTimeArr.shift(currDisplayData[currDisplayData.length - 1]?.time)
  } else {
    currDisplayData.shift()
    currBestAskArr.shift(currDisplayData[currDisplayData.length - 1]?.best_ask)
    currBestBidArr.shift(currDisplayData[currDisplayData.length - 1]?.best_bid)
    currTimeArr.shift(currDisplayData[currDisplayData.length - 1]?.time)
    currDisplayData.push(currData)
    currBestAskArr.push(currDisplayData[currDisplayData.length - 1]?.best_ask)
    currBestBidArr.push(currDisplayData[currDisplayData.length - 1]?.best_bid)
    currTimeArr.push(
      new Date(
        Date.parse(currDisplayData[currDisplayData.length - 1]?.time)
      ).toLocaleTimeString("en-US")
    )
  }
}

export const formatData = (time, bestBid, bestAsk) => {
  let finalData = {
    labels: time,
    datasets: [
      {
        label: "Best Bid",
        data: bestBid,
        backgroundColor: "rgb(41,212,188)",
        borderColor: "rgb(41,212,188)",
        fill: false,
      },
      {
        label: "Best Ask",
        data: bestAsk,
        backgroundColor: "rgb(239,45,146)",
        borderColor: "rgb(239,45,146)",
        fill: false,
      },
    ],
  }

  return finalData
}

export const formatNumber = (number) => {
  let numberConvert = +number
  let formattedNumber = numberConvert.toLocaleString("en-US")

  return formattedNumber
}
