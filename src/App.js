import React, { Component } from "react"
import * as d3 from "d3"
// import LineChart from "./components/lineChart"
import barChart from "./components/barChart"
import pieChart from "./components/pieChart"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"

import "./App.css"

class App extends Component {
  state = {
    data: null,
    startDate: new Date("2019-05-15"),
    endDate: new Date(),
    isDateChanged: false,
  }

  async getData() {
    const { startDate, endDate } = this.state
    let startTime = moment(startDate).format("YYYY-MM-DD")
    let endTime = moment(endDate).format("YYYY-MM-DD")
    try {
      const response = await fetch(
        `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startTime}&end=${endTime}`,
      )
      const json = await response.json()
      this.parseData(json)
    } catch (error) {
      console.log(error)
    }
  }
  handleChange(date, type) {
    if (type === "startDate") {
      this.setState({
        startDate: date,
      })
    } else {
      this.setState({
        endDate: date,
      })
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

  // displayBarChart(data) {
  //   const svg = d3
  //     .select(".canvas")
  //     .append("svg")
  //     .attr("height", 600)
  //     .attr("width", 600)

  //   const margin = { top: 20, right: 20, bottom: 100, left: 100 }

  //   const graphWidth = 600 - margin.left - margin.right
  //   const graphHeight = 600 - margin.top - margin.bottom

  //   const graph = svg
  //     .append("g")
  //     .attr("width", graphWidth)
  //     .attr("height", graphHeight)
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`)
  //   const xAxisGroup = graph
  //     .append("g")
  //     .attr("transform", `translate(0,${graphHeight})`)
  //   const yAxisGroup = graph.append("g")
  //   const max = d3.max(data, d => d.price)
  //   const y = d3
  //     .scaleLinear()
  //     .domain([0, max])
  //     .range([graphHeight, 0])

  //   const x = d3
  //     .scaleBand()
  //     .domain(data.map(item => item.date))
  //     .range([0, 500])
  //     .paddingInner(0.2)
  //     .paddingOuter(0.2)
  //   const rects = graph.selectAll("rect").data(data)
  //   rects
  //     .enter()
  //     .append("rect")
  //     .attr("width", x.bandwidth)
  //     .attr("height", d => graphHeight - y(d.price))
  //     .attr("fill", "orange")
  //     .attr("x", d => x(d.date))
  //     .attr("y", d => y(d.price))
  //   const xAxis = d3.axisBottom(x)
  //   const yAxis = d3.axisLeft(y).tickFormat(d => "$ " + d)
  //   xAxisGroup.call(xAxis)
  //   yAxisGroup.call(yAxis)

  //   xAxisGroup
  //     .selectAll("text")
  //     .attr("transform", "rotate(90)")
  //     .attr("text-anchor", "start")
  // }

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
      .attr("fill", "none")
    svg.selectAll("*").remove()

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
    if (prevState.isDateChanged !== this.state.isDateChanged) {
      this.getData()
      this.setState({
        isDateChanged: false,
      })
    }
  }
  componentDidMount() {
    this.getData()
    barChart()
    pieChart()
  }

  render() {
    console.log(this.state.data)

    return (
      <div className="canvas">
        <h1> Bitcoin price chart</h1>
        <div className="select-date">
          <DatePicker
            className="date-input"
            selected={this.state.startDate}
            onChange={(date, startDate) => this.handleChange(date, "startDate")}
          />
          <DatePicker
            className="date-input"
            selected={this.state.endDate}
            onChange={(date, endDate) => this.handleChange(date, "endDate")}
          />
          <button onClick={() => this.setState({ isDateChanged: true })}>
            Enter
          </button>
        </div>
        <svg className="line-chart" />
      </div>
    )
  }
}

export default App
