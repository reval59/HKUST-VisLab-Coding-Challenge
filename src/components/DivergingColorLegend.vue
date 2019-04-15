<template>
    <div style="overflow: scroll;"></div>
</template>

<script>
    export default {
        name: "DivergingColorLegend",
        props:{
            width: {
                type: Number,
                default: () => {
                    return 300
                }
            },
            height: {
                type: Number,
                default: () => {
                    return 50
                }
            },
        },
        mounted() {
            this.draw()
        },
        methods:{
            validProps() {
               return true
            },
            draw() {
                if(!this.validProps()){
                    return
                }
                const d3 = this.d3
                const lodash = this.lodash
                const width = this.width
                const height = this.height
                const container = this.$el
                const domain = 30

                // remove previous dom objects in container
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }

                let svg = d3.select(container)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    // .attr("class","legend")

                let colorScale = d3.scaleLinear()
                    .range([0.3, 1])
                    .domain([0, domain])

                let rectSize = 12

                svg.selectAll()
                    .data(lodash.range(domain))
                    .enter()
                    .append("rect")
                    .attr("x", function (d) {
                        return rectSize*d
                    })
                    .attr("y", function (d) {
                        return rectSize*3
                    })
                    .attr("width", rectSize)
                    .attr("height",rectSize)
                    .style("fill", function (d) {
                        return d3.interpolateYlGnBu(colorScale(d))
                    })

                svg.selectAll(".legend")
                    .data(['week','strong'])
                    .enter()
                    .append('text')
                    .attr("x", (d, i)=>{
                        if(i==0) return 0
                        else return width-35
                    })
                    .attr("y", (d)=>{
                        return rectSize*2
                    })
                    .attr("style", "font-size:12px")
                    .html((d) => {
                        return d
                    })

            }
        }
    }
</script>

<style scoped>

</style>