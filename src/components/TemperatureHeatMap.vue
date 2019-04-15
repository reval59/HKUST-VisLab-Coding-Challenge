<template>
    <div style="overflow: scroll;"></div>
</template>


<script>

    export default {
        name: "TemperatureHeatMap",
        data: () => {
            return {
                processedData: null
            }
        },
        props: {
            rawData: {
                type: Array,
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
            width() {
                this.draw()
            },
            height() {
                this.draw()
            }
        },
        mounted() {
            this.draw()
        },
        methods: {

            validProps(){
              if(this.rawData.length>0) return true
              else return false
            },
            // draw chart using processedData
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


                // remove previous dom objects in container
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

                console.log("processedData", this.processedData)

                // dynamic labels for years
                console.log(sortedRawData[0])
                let startYear = parseInt(sortedRawData[0].date.split('-')[0])
                let endYear = parseInt(sortedRawData[sortedRawData.length - 1].date.split('-')[0])

                let years = []
                for (let i = startYear; i <= endYear; i++) {
                    years.push(i.toString())
                }

                // build X scales and axis:
                let x = d3.scaleBand()
                    .range([0, innerWidth])
                    .domain(years)
                    .padding(0.1);
                svg.append("g")
                    .call(d3.axisTop(x))

                // build X scales and axis:
                let y = d3.scaleBand()
                    .range([0, innerHeight])
                    .domain(months)
                    .padding(0.1);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // build color scale
                let colorScale = d3.scaleQuantize()
                    .domain([0, 40])
                    .range(["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c",
                        "#f9d057", "#f29e2e", "#e76818", "#d7191c"])


                // tooltip
                // remove previous tips
                d3.select(".d3-tip").remove()
                let tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
                    return "Date: " + d.date + "Max: " + d.max_temperature + " &#8451 Min: " + d.min_temperature + " &#8451"
                });

                svg.call(tip)
                svg.selectAll()
                    .data(this.processedData)
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


            }
        }

    }
</script>

