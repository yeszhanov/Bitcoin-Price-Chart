import React, { Component } from "react"
import * as d3 from "d3"

import data from "../data"

const BarChart = () => {
  const svg = d3
    .select(".canvas")
    .append("svg")
    .attr("height", 600)
    .attr("width", 600)

  const margin = { top: 20, right: 20, bottom: 100, left: 100 }

  const graphWidth = 600 - margin.left - margin.right
  const graphHeight = 600 - margin.top - margin.bottom

  const graph = svg
    .append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  const xAxisGroup = graph
    .append("g")
    .attr("transform", `translate(0,${graphHeight})`)
  const yAxisGroup = graph.append("g")
  const max = d3.max(data, d => d.price)
  const y = d3
    .scaleLinear()
    .domain([0, max])
    .range([graphHeight, 0])

  const x = d3
    .scaleBand()
    .domain(data.map(item => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2)
  const rects = graph.selectAll("rect").data(data)
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth)
    .attr("height", d => graphHeight - y(d.price))
    .attr("fill", "orange")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.price))
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y).tickFormat(d => "$ " + d)
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(90)")
    .attr("text-anchor", "start")
}
export default BarChart
