<template>
    <div style="overflow: scroll;"></div>
</template>


<script>

    export default {
        name: "ImprovedTemperatureHeatMap",
        data: () => {
            return {
                processedData: null,
                groupedData: null
            }
        },
        props: {

            rawData: {
                type: Array,
                required: true
            },
            startYear: {
                type: Number,
                required: true
            },
            endYear: {
                type: Number,
                required: true
            },
            displayProperty: {
                type: String,
                required: true
            },
            width: {
                type: Number,
                default: () => {
                    return 500
                }
            },
            height: {
                type: Number,
                default: () => {
                    return 500
                }
            },
            margin: {
                type: Object,
                default: () => {
                    return {top: 30, right: 30, bottom: 30, left: 60}
                }
            }
        },
        watch: {
            displayProperty() {
                this.draw()
            },
            rawData() {
                this.draw()
            },
            startYear() {
                this.draw()
            },
            endYear() {
                this.draw()
            },
            width() {
                this.draw()
            },
            height() {
                this.draw()
            }
        },
        mounted() {
            this.draw(this.displayProperty)
        },
        methods: {

            validProps() {
                if (this.rawData.length > 0 && this.startYear && this.endYear) return true
                else return false
            },

            draw() {
                if(!this.validProps()){
                    return
                }
                const d3 = this.d3
                const lodash = this.lodash
                const margin = this.margin
                const width = this.width
                const height = this.height
                const container = this.$el
                const innerWidth =  width - margin.left - margin.right
                const innerHeight = height - margin.top - margin.bottom
                const rawData = JSON.parse(JSON.stringify(this.rawData))
                const displayProperty = this.displayProperty
                const startYear = this.startYear
                const endYear = this.endYear

                /// remove previous dom objects in container
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }

                let svg = d3.select(container)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                // labels of row and columns
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

                // copy rawData and sort it in order of date
                let sortedRawData = lodash.orderBy(rawData, ['date'])

                // group by YYYY-MM then get max/min temperature
                this.processedData = lodash.chain(sortedRawData).groupBy((d) => {
                    return d.date.split('-')[0] + '-' + d.date.split('-')[1]
                }).map((val, key) => {
                    let max = Math.max.apply(Math, val.map(function (d) {
                        return d.max_temperature
                    }))
                    let min = Math.min.apply(Math, val.map(function (d) {
                        return d.min_temperature
                    }))
                    return {
                        date: key,
                        max_temperature: max,
                        min_temperature: min
                    }
                }).value()

                this.groupedData = lodash.groupBy(sortedRawData, (el) => {
                    return el.date.split('-')[0] + '-' + el.date.split('-')[1]
                })

                // dynamic labels for years
                let years = []
                for (let i = startYear; i <= endYear; i++) {
                    years.push(i.toString())
                }

                // build X scales and axis:
                let x = d3.scaleBand()
                    .range([0, innerWidth - 50])
                    .domain(years)
                    .padding(0.1);
                svg.append("g")
                    .call(d3.axisTop(x))

                // build Y scales and axis:
                let y = d3.scaleBand()
                    .range([0, innerHeight])
                    .domain(months)
                    .padding(0.1);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // build color scale
                let colors = ["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c",
                    "#f9d057", "#f29e2e", "#e76818", "#d7191c"]
                let temperatureRange = [0, 40]
                let colorScale = d3.scaleQuantize()
                    .domain(temperatureRange)
                    .range(colors)


                // tooltip
                // remove previous tips
                d3.select(".d3-tip").remove();

                let tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
                    return "Date: " + d.date + "Max: " + d.max_temperature + " &#8451 Min: " + d.min_temperature + " &#8451"
                });



                // use processedData in the specified year range
                // draw rect
                let dataToDraw = lodash.filter(this.processedData, (el) => {
                    if (parseInt(el.date.split('-')[0]) <= this.endYear && parseInt(el.date.split('-')[0]) >= this.startYear) return true
                    else return false
                })
                let vm = this
                svg.call(tip)
                svg.selectAll()
                    .data(dataToDraw)
                    .enter()
                    .append("rect")
                    .attr("x", function (d) {
                        return x(d.date.split('-')[0])
                    })
                    .attr("y", function (d) {
                        return y(months[parseInt(d.date.split('-')[1]) - 1])
                    })
                    .attr("width", x.bandwidth())
                    .attr("height", y.bandwidth())
                    .style("fill", function (d) {
                        return colorScale(d[displayProperty])
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)

                // legend
                let legendSquareLength = 15


                // add dummy data to the first element
                let tempRange = temperatureRange.slice()
                tempRange.unshift(null)

                let colorRange = colors.slice()
                colorRange.unshift(null)

                svg.append("g")
                    .attr("class", "legend")
                svg.selectAll(".legend")
                    .data(colorRange)
                    .enter()
                    .append("rect")
                    .attr("x", innerWidth - legendSquareLength - margin.right)
                    .attr("y", (d, i) => {
                        return (i - 1) * legendSquareLength
                    })
                    .attr("width", legendSquareLength)
                    .attr("height", legendSquareLength)
                    .style("fill", (d, i) => {
                        return colorRange[i]
                    })
                svg.selectAll(".legend")
                    .data(tempRange)
                    .enter()
                    .append('text')
                    .attr("x", innerWidth - margin.right + 3)
                    .attr("y", (d, i) => {
                        return (i - 1) * legendSquareLength * colors.length + 3
                    })
                    .attr("style", "font-size:10px")
                    .html((d, i) => {
                        return d + " &#8451"
                    })


                // nested line graph:
                let x2 = d3.scaleBand()
                    .range([0, x.bandwidth()])
                    .padding(0.1)

                let y2 = d3.scaleBand()
                    .range([0, y.bandwidth()])
                    .domain(lodash.range(40))
                    .padding(0.1)

                let maxTempLine = d3.line()
                    .x(function (d, i) {
                        x2.domain(vm.lodash.range(d.numOfDays))
                        return x2(i)
                    })
                    .y(function (d) {
                        return y2(d.max_temperature)
                    })

                let minTempLine = d3.line()
                    .x(function (d, i) {
                        x2.domain(vm.lodash.range(d.numOfDays))
                        return x2(i)
                    })
                    .y(function (d) {
                        return y2(d.min_temperature)
                    })

                svg.selectAll()
                    .data(dataToDraw)
                    .enter()
                    .append("g")
                    .attr("transform", (d, i) => {
                        let coordinate = {
                            x: x(d.date.split('-')[0]),
                            y: y(months[parseInt(d.date.split('-')[1]) - 1]) + y.bandwidth()
                        }
                        return "translate(" + coordinate.x + "," + coordinate.y + ") "
                    })
                    .append("g")
                    .append("path")
                    .attr("transform", "scale(1,-1)")
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("stroke-width", "2px")
                    .attr('d', (d) => {
                        let data = lodash.chain(this.groupedData[d.date]).map(el => {
                            el.numOfDays = this.groupedData[d.date].length
                            return el
                        }).value()
                        return maxTempLine(data)
                    })


                svg.selectAll()
                    .data(dataToDraw)
                    .enter()
                    .append("g")
                    .attr("transform", (d, i) => {
                        let coordinate = {
                            x: x(d.date.split('-')[0]),
                            y: y(months[parseInt(d.date.split('-')[1]) - 1]) + y.bandwidth()
                        }
                        return "translate(" + coordinate.x + "," + coordinate.y + ") "
                    })
                    .append("g")
                    .append("path")
                    .attr("transform", "scale(1,-1)")
                    .attr("fill", "none")
                    .attr("stroke", "#99b3ff")
                    .attr("stroke-width", "2px")
                    .attr('d', (d) => {
                        let data = lodash.chain(this.groupedData[d.date]).map(el => {
                            el.numOfDays = this.groupedData[d.date].length
                            return el
                        }).value()
                        return minTempLine(data)
                    })

            }
        }

    }
</script>

