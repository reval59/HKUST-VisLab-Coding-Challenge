<template>
    <div style="overflow: scroll;">
    </div>
</template>

<script>
    import { EventBus } from '../eventBus'
    export default {
        name: "AdjacencyMatrix",
        data: () => {
            return {
                adjacencyMap: new Map(),
                adjacencyMatrix: []
            }
        },
        props: {
            graph: {
                type: Object,
                required: true,

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
            graph() {
                this.draw()
            },
            height() {
                this.draw()
            },
            width() {
                this.draw()
            }
        },
        mounted() {
            this.draw()
        },
        methods: {
            validProps() {
                if (Object.keys(this.graph).length == 0) return false
                else return true
            },
            // draw chart using processedData
            draw() {
                if (!this.validProps()) {
                    return
                }
                const d3 = this.d3
                const lodash = this.lodash
                const margin = this.margin
                const width = this.width
                const height = this.height
                const container = this.$el
                const innerWidth = width - margin.left - margin.right
                const innerHeight = height - margin.top - margin.bottom

                // remove previous dom objects in container
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }



                const graph = JSON.parse(JSON.stringify(this.graph))


                // sort node by name
                graph.nodes = lodash.sortBy(graph.nodes, 'name')

                for (let i in graph.links) {
                    let d = graph.links[i]
                    let key = this.getKeyFromEdge(d)

                    if (this.adjacencyMap.has(key)) {
                        this.adjacencyMap.set(key, this.adjacencyMap.get(key) + d.value)
                    } else {
                        this.adjacencyMap.set(key, d.value)
                    }
                }



                // generate adjacent Matrix

                let maxValue = 0 // for defining domain
                for (let i in graph.nodes) {
                    this.adjacencyMatrix[i] = []
                    for (let j in graph.nodes) {
                        this.adjacencyMatrix[i][j] = {
                            x: graph.nodes[i],
                            y: graph.nodes[j],
                            i: i,
                            j: j
                        }

                        let key = this.getKeyFromNodes(this.adjacencyMatrix[i][j].x, this.adjacencyMatrix[i][j].y)
                        // console.log(key)
                        let value = 0
                        if (this.adjacencyMap.has(key)) value = this.adjacencyMap.get(key)

                        if (value > maxValue) maxValue = value
                        this.adjacencyMatrix[i][j].value = value
                    }
                }



                // append the svg object
                let svg = d3.select(this.$el)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top * 2 + ")");


                let professors = Object.keys(lodash.groupBy(graph.nodes, 'name'))



                // build X scales and axis:
                let x = d3.scaleBand()
                    .range([0, innerWidth])
                    .domain(professors)
                    .padding(0.1);
                svg.append("g")
                    .attr("class", "axis")

                    .attr('transform', 'rotate(-90)')

                    .call(d3.axisRight(x))
                    .attr("font-size", "7")

                // build Y scales and axis:
                let y = d3.scaleBand()
                    .range([0, innerHeight])
                    .domain(professors)
                    .padding(0.1);
                svg.append("g")
                    .attr("class", "axis")


                    .call(d3.axisLeft(y))
                    .attr("font-size", "7")

                let colorScale = d3.scaleLinear()
                    .range([0.3, 1])
                    .domain([0, maxValue])

                let flattenedMatrix = lodash.flatten(this.adjacencyMatrix)

                let rect = svg.selectAll()
                    .data(flattenedMatrix)
                    .enter()
                    .append("rect")
                    .attr("x", function (d) {

                        return x(d.x.name)
                    })
                    .attr("y", function (d) {

                        return y(d.y.name)
                    })
                    .attr("width", x.bandwidth())
                    .attr("height", y.bandwidth())
                    .style("fill", function (d) {
                        if(d.value==0) return "#e6e6e6"
                        return d3.interpolateYlGnBu(colorScale(d.value))
                    })
                    .on('mouseover',focus).on("mouseout", unFocused);

                function focus(d){
                    EventBus.$emit('mouseover-matrix',d)
                    d3.select(d3.event.target).style("opacity","0.5")
                }
                function unFocused(d){

                    d3.selectAll("rect").style("opacity","1")
                }

                // event triggered by node link diagram

                // remove previous event bindings
                EventBus.$off('mouseover-diagram')
                EventBus.$off('mouseout-diagram')

                EventBus.$on('mouseover-diagram', (val)=>{

                    svg.selectAll('rect')
                        .style("opacity", function (d) {
                            if(d.x.name == val.name || d.y.name==val.name) return 0.5
                            else return 1
                        })
                })

                EventBus.$on('mouseout-diagram', (val)=>{
                    svg.selectAll('rect')
                        .style("opacity", function (d) {
                            return 1
                        })
                })

                //console.log(professors)
                // console.log("matrix", graph)
                // console.log(this.adjacencyMap)
                // console.log(this.adjacencyMatrix)
                // console.log(flattenedMatrix)

            },

            getKeyFromEdge(edge) {
                let d = edge
                return (d.source < d.target) ? d.source + '-' + d.target : d.target + '-' + d.source
            },

            getKeyFromNodes(n1, n2) {
                return (n1.id < n2.id) ? n1.id + '-' + n2.id : n2.id + '-' + n1.id
            },
        }
    }
</script>

<style scoped>

</style>