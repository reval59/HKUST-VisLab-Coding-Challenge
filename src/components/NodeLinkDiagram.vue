<template>
    <div style="overflow: scroll;">
    </div>
</template>

<script>
    import { EventBus } from '../eventBus'
    export default {
        name: "NodeLinkDiagram",
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
            validProps(){
                if(Object.keys(this.graph).length == 0) return false
                else return true
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
                const graph = JSON.parse(JSON.stringify(this.graph))

                // remove previous dom objects in container
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }


                const MAX_COLLABORATIONS = lodash.maxBy(graph.nodes, 'numOfCollaborations').numOfCollaborations
                const MIN_COLLABORATIONS = lodash.minBy(graph.nodes, 'numOfCollaborations').numOfCollaborations
                const MAX_COLLABORATORS = lodash.maxBy(graph.nodes, 'numOfCollaborators').numOfCollaborators
                const MIN_COLLABORATORS = lodash.minBy(graph.nodes, 'numOfCollaborators').numOfCollaborators
                const MAX_VALUE = lodash.maxBy(graph.links, 'value').value



                // Dynamic Scale based on min max value
                let circleColorScale = d3.scaleLinear()
                    .range([0.3, 1])
                    .domain([MIN_COLLABORATIONS, MAX_COLLABORATIONS])
                let radiusScale = d3.scaleLinear()
                    .range([3, 30])
                    .domain([MIN_COLLABORATORS, MAX_COLLABORATORS])

                let lineScale = d3.scaleLinear()
                    .range([1, 3])
                    .domain([0, MAX_VALUE])

                let lineColorScale = d3.scaleLinear()
                    .range([0.5, 1])
                    .domain([0, MAX_VALUE])

                let label = {
                    'nodes': [],
                    'links': []
                }

                graph.nodes.forEach(function (d, i) {
                    label.nodes.push({node: d});
                    label.nodes.push({node: d});
                    label.links.push({
                        source: i * 2,
                        target: i * 2 + 1
                    });
                })

                let labelLayout = d3.forceSimulation(label.nodes)
                    .force("charge", d3.forceManyBody().strength(-50))
                    .force("link", d3.forceLink(label.links).distance(0).strength(2));

                let graphLayout = d3.forceSimulation(graph.nodes)
                    .force("charge", d3.forceManyBody().strength(-3000))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .force("x", d3.forceX(width / 2).strength(1))
                    .force("y", d3.forceY(height / 2).strength(1))
                    .force("link", d3.forceLink(graph.links).id(function (d) {
                        return d.id;
                    }).distance(50).strength(1))
                    .on("tick", ticked);

                let adjList = [];

                graph.links.forEach(function (d) {
                    adjList[d.source.index + "-" + d.target.index] = true;
                    adjList[d.target.index + "-" + d.source.index] = true;
                });

                function neigh(a, b) {
                    return a == b || adjList[a + "-" + b];
                }

                let svg = d3.select(this.$el).append("svg").attr("width", width).attr("height", height);
                let innerContainer = svg.append("g");

                svg.call(
                    d3.zoom()
                        .scaleExtent([.1, 4])
                        .on("zoom", function () {
                            innerContainer.attr("transform", d3.event.transform);
                        })
                );

                let link = innerContainer.append("g").attr("class", "links")
                    .selectAll("line")
                    .data(graph.links)
                    .enter()
                    .append("line")
                    .attr("stroke", (d) => {
                        return d3.interpolateGreys(lineColorScale(d.value))
                    })
                    .attr("stroke-width", (d) => {
                        return lineScale(d.value)
                    });

                let node = innerContainer.append("g").attr("class", "nodes")
                    .selectAll("g")
                    .data(graph.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", (d) => {
                        return radiusScale(d.numOfCollaborators)
                    })
                    .attr("fill", function (d) {
                        return d3.interpolateYlGnBu(circleColorScale(d.numOfCollaborations));
                    })



                node.on("mouseover", focus).on("mouseout", unFocused);

                node.call(
                    d3.drag()
                        .on("start", dragStarted)
                        .on("drag", dragged)
                        .on("end", dragEnded)
                );

                let labelNode = innerContainer.append("g").attr("class", "labelNodes")
                    .selectAll("text")
                    .data(label.nodes)
                    .enter()
                    .append("text")
                    .text(function (d, i) {
                        return i % 2 == 0 ? "" : d.node.name;
                    })
                    .style("fill", "black")
                    .style("font-family", "Arial")
                    .style("font-size", 12)
                    .style("pointer-events", "none"); // to prevent mouseover/drag capture

                node.on("mouseover", focus).on("mouseout", unFocused);

                function ticked() {

                    node.call(updateNode);
                    link.call(updateLink);

                    labelLayout.alphaTarget(0.3).restart();
                    labelNode.each(function (d, i) {
                        if (i % 2 == 0) {
                            d.x = d.node.x;
                            d.y = d.node.y;
                        } else {
                            let b = this.getBBox();

                            let diffX = d.x - d.node.x;
                            let diffY = d.y - d.node.y;

                            let dist = Math.sqrt(diffX * diffX + diffY * diffY);

                            let shiftX = b.width * (diffX - dist) / (dist * 2);
                            shiftX = Math.max(-b.width, Math.min(0, shiftX));
                            let shiftY = 16;
                            this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                        }
                    });
                    labelNode.call(updateNode);

                }

                // event triggered by matrix

                // remove previous event bindings
                EventBus.$off('mouseover-matrix')
                EventBus.$off('mouseout-matrix')

                EventBus.$on('mouseover-matrix', (val)=>{
                    // console.log(val)
                    let domNodes = node._groups[0]
                    for (let i in domNodes){
                        let currentID = domNodes[i].__data__.id
                        if(currentID==val.x.id || currentID==val.y.id){
                            let index = i
                            node.style("opacity", function (o) {
                                return neigh(index, o.index) ? 1 : 0.1;
                            });
                            labelNode.attr("display", function (o) {
                                return neigh(index, o.node.index) ? "block" : "none";
                            });
                            link.style("opacity", function (o) {
                                return o.source.index == index || o.target.index == index ? 1 : 0.1;
                            });
                        }

                    }
                })


                EventBus.$on('mouseout-matrix', (val)=>{
                    labelNode.attr("display", "block");
                    node.style("opacity", 1);
                    link.style("opacity", 1);

                })


                function fixna(x) {
                    if (isFinite(x)) return x;
                    return 0;
                }

                function focus(d) {
                    EventBus.$emit('mouseover-diagram', d)
                    let index = d3.select(d3.event.target).datum().index;
                    node.style("opacity", function (o) {
                        return neigh(index, o.index) ? 1 : 0.1;
                    });
                    labelNode.attr("display", function (o) {
                        return neigh(index, o.node.index) ? "block" : "none";
                    });
                    link.style("opacity", function (o) {
                        return o.source.index == index || o.target.index == index ? 1 : 0.1;
                    });
                }

                function unFocused(d) {
                    EventBus.$emit('mouseout-diagram', d)
                    labelNode.attr("display", "block");
                    node.style("opacity", 1);
                    link.style("opacity", 1);
                }

                function updateLink(link) {
                    link.attr("x1", function (d) {
                        return fixna(d.source.x);
                    })
                        .attr("y1", function (d) {
                            return fixna(d.source.y);
                        })
                        .attr("x2", function (d) {
                            return fixna(d.target.x);
                        })
                        .attr("y2", function (d) {
                            return fixna(d.target.y);
                        });
                }

                function updateNode(node) {
                    node.attr("transform", function (d) {
                        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
                    });
                }

                function dragStarted(d) {
                    d3.event.sourceEvent.stopPropagation();
                    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragEnded(d) {
                    if (!d3.event.active) graphLayout.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

            }
        }

    }
</script>

<style scoped>

</style>