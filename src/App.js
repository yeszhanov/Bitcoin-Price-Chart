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
        value: data.bpi[i],
      })
    }
    this.setState({
      data: arr,
    })
  }

  displayChart(data) {
    console.log(data)
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
        <svg className="line-chart" />
      </div>
    )
  }
}

export default App
