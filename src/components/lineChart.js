import React, { Component } from "react"
import * as d3 from "d3"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"

const LineChart = props => {
  const { data } = props
  // console.log(props)

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
export default LineChart
