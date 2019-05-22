import React, { Component } from "react"
import * as d3 from "d3"

import "./App.css"

class App extends Component {
  state = {
    data: null,
  }

  async getData() {
    try {
      const response = await fetch(
        "https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01",
      )
      const json = await response.json()
      this.parseData(json)
    } catch (error) {
      console.log(error)
    }
  }

  parseData(data) {
    var arr = []
    for (let i in data.bpi) {
      arr.push({
        date: new Date(i),
        price: data.bpi[i],
      })
    }
    this.setState({
      data: arr,
    })
  }

  displayChart(data) {
    let height = 400
    let width = 600

    let maxDate = d3.max(data, d => d.date)

    let minDate = d3.min(data, d => d.date)
    let maxPrice = d3.max(data, data => data.price)

    let y = d3
      .scaleLinear()
      .domain([0, maxPrice])
      .range([height, 0])
    let x = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, width])

    let yAxe = d3.axisLeft(y)
    let xAxe = d3.axisBottom(x)

    let svg = d3
      .select("svg")
      .attr("height", "600")
      .attr("width", "800")

    let group = svg.append("g").attr("transform", "translate( 50 , 50)")
    let line = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.price))

    group.append("path").attr("d", line(data))
    group
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxe)
    group.append("g").call(yAxe)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.displayChart(this.state.data)
    }
  }
  componentDidMount() {
    this.getData()
  }

  render() {
    return (
      <div className="canvas">
        <h1> Bitcoin price chart</h1>
        <svg className="line-chart" />
      </div>
    )
  }
}

export default App
