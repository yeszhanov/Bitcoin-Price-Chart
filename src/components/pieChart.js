import React, { Component } from "react"
import * as d3 from "d3"
// import { layout } from "d3"
import datas from "../data"

const PieChart = () => {
  const svg = d3
    .select(".canvas")
    .append("svg")
    .attr("height", 600)
    .attr("width", 600)
    .style("background", "grey")
  let colors = d3.scaleOrdinal(d3.schemeDark2)
  let data = d3.pie().value(d => d.price)(datas)
  let segment = d3
    .arc()
    .innerRadius(0)
    .outerRadius(200)
    .padAngle(0.05)
    .padRadius(50)
  let sections = svg
    .append("g")
    .attr("transform", "translate(250,250)")
    .selectAll("path")
    .data(data)
  sections
    .enter()
    .append("path")
    .attr("d", segment)
    .attr("fill", d => colors(d.data.price))
  let content = d3
    .select("g")
    .selectAll("text")
    .data(data)
  content
    .enter()
    .append("text")
    .each(function(d) {
      let center = segment.centroid(d)
      d3.select(this)
        .attr("x", center[0])
        .attr("y", center[1])
        .text(d.data.price)
    })
  console.log(content)
}
export default PieChart
