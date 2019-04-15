<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-toolbar-title>Level 3 Challenge: Linkage between Multiple View</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>

        <v-flex xs12 pa-1>
            <v-card>
                <v-card-title>
                    <span class="title">Input Data: {{file}}</span>
                </v-card-title>

                <v-card-title>
                    <span class="title">Nodes</span>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                            v-model="searchNode"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            outline

                    ></v-text-field>
                    <v-data-table
                            :headers="nodeHeaders"
                            :items="rawData.nodes"
                            :search="searchNode"
                            item-key="uniqueID"
                    >
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.uniqueID }}</td>
                            <td class="text-xs-center">{{ props.item.fullname }}</td>
                            <td class="text-xs-center">{{ props.item.dept }}</td>
                            <td class="text-xs-center">{{ props.item.itsc }}</td>
                            <td class="text-xs-center">{{ props.item.id }}</td>


                        </template>
                    </v-data-table>
                </v-card-text>

                <v-card-title>
                    <span class="title">Edges</span>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                            v-model="searchEdge"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            outline

                    ></v-text-field>
                    <v-data-table
                            :headers="edgeHeaders"
                            :items="rawData.edges"
                            :search="searchEdge"
                    >
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.source }}</td>
                            <td class="text-xs-center">{{ props.item.target }}</td>
                            <td class="text-xs-center">{{ props.item.publications.length}}</td>

                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-card-title>
                    <span class="title">Collaboration Data for: {{file}}</span>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                            v-model="searchCollaboration"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            outline

                    ></v-text-field>
                    <v-data-table
                            :headers="refinedNodeHeaders"
                            :items="graph.nodes"
                            :search="searchCollaboration"
                    >
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.id }}</td>
                            <td class="text-xs-center">{{ props.item.name }}</td>
                            <td class="text-xs-center">{{ props.item.dept }}</td>
                            <td class="text-xs-center">{{ props.item.numOfCollaborations }}</td>
                            <td class="text-xs-center">{{ props.item.numOfCollaborators }}</td>

                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>

        <v-flex xs12 pa-1>
            <v-card>
                <v-card-title>
                    <div>
                        <h3 class="title mb-0">Multiple View</h3>
                        <v-label>Selected Department(s): {{dept}}</v-label>

                        <br><br>
                        <v-layout wrap row>
                            <v-flex xs12 d-flex>
                                <v-select
                                        :items="deptList"
                                        label="Change Department"
                                        v-model="input.dept"
                                ></v-select>
                            </v-flex>

                        </v-layout>

                    </div>
                </v-card-title>
                <v-card-text>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <diverging-color-legend></diverging-color-legend>
                            </v-flex>
                            <v-flex xs6 pa-2 ref="diagramContainer">
                                <h3 class="title" style="text-align: center">Node Link Diagram</h3>
                                <node-link-diagram
                                        :graph="subGraph"

                                        :width="diagramContainer.width"
                                        :height="diagramContainer.height"

                                        style="border: 1px solid black"
                                >

                                </node-link-diagram>
                            </v-flex>

                            <v-flex xs6 pa-2 ref="matrixContainer">
                                <h3 class="title" style="text-align: center">Adjacency Matrix</h3>
                                <adjacency-matrix :graph="subGraph"

                                                  :width="matrixContainer.width"
                                                  :height="matrixContainer.height"

                                                  style="border: 1px solid black">

                                </adjacency-matrix>
                            </v-flex>

                        </v-layout>

                    </v-card-text>
                </v-card-text>
            </v-card>

        </v-flex>


    </v-layout>

</template>

<script>
    import NodeLinkDiagram from '../components/NodeLinkDiagram'
    import AdjacencyMatrix from '../components/AdjacencyMatrix'
    import DivergingColorLegend from '../components/DivergingColorLegend'
    import json from '../../public/data/HKUST_coauthor_graph'


    export default {
        name: "level3",
        components: {NodeLinkDiagram,AdjacencyMatrix, DivergingColorLegend},
        data: () => {
            return {
                searchNode: '',
                searchEdge: '',
                searchCollaboration: '',
                nodeHeaders: [
                    {text: 'Unique ID', value: 'uniqueID', align: 'center'},
                    {text: 'Name', value: 'fullname', align: 'center'},
                    {text: 'Dept', value: 'dept', align: 'center'},
                    {text: 'ITSC', value: 'itsc', align: 'center'},
                    {text: 'ID', value: 'id', align: 'center'},
                ],
                edgeHeaders: [
                    {text: 'Source', value: 'source', align: 'center'},
                    {text: 'Target', value: 'target', align: 'center'},
                    {text: 'Publications', value: 'publications.length', align: 'center'},
                ],
                refinedNodeHeaders: [
                    {text: 'ID', value: 'id', align: 'center'},
                    {text: 'Name', value: 'name', align: 'center'},
                    {text: 'Dept', value: 'dept', align: 'center'},
                    {text: '# of Collaborations', value: 'numOfCollaborations', align: 'center'},
                    {text: '# of Collaborators', value: 'numOfCollaborators', align: 'center'},
                ],
                file: "data/HKUST_coauthor_graph.json",
                displayOption: 'max_temperature',
                rawData: json,
                dept: 'CSE',
                deptList: [],
                input: {
                    dept: null
                },
                graph: {nodes: [], links: []},
                subGraph: {},
                diagramContainer: {
                    width: 0,
                    height: 0
                },
                matrixContainer: {
                    width: 0,
                    height: 0
                },
            }
        },
        watch: {
            'input.dept': function (val) {
                console.log(val)
                this.dept = val
                this.initSubGraph()
            }
        },
        mounted() {
            this.deptList = Object.keys(this.lodash.groupBy(this.rawData.nodes, 'dept'))
            this.initGraph()
            this.initSubGraph()
            this.initContainerSize()
            window.addEventListener('resize', this.onResize)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize)
        },
        methods: {
            initContainerSize() {
                this.diagramContainer.width = this.$refs.diagramContainer.clientWidth
                this.diagramContainer.height = parseInt(this.diagramContainer.width * 0.8)

                this.matrixContainer.width = this.$refs.matrixContainer.clientWidth
                this.matrixContainer.height = parseInt(this.matrixContainer.width * 0.8)

            },
            onResize(e) {
                clearTimeout(this.resizeID);
                this.resizeID = setTimeout(this.initContainerSize, 500)

            },
            initGraph() {
                // refine given data for drawing a graph
                const lodash = this.lodash




                // value property indicates # of publications
                let links = lodash.chain(this.rawData.edges).map(d => {
                    return {
                        "source": d.source,
                        "target": d.target,
                        "value": d.publications.length
                    }
                }).value()


                let linksBySource = lodash.groupBy(links, 'source')
                let linksByTarget = lodash.groupBy(links, 'target')

                // console.log(linksBySource, linksByTarget)
                //
                // console.log("sumby", lodash.sumBy(linksBySource['0'], 'value'))

                let nodes = lodash.chain(this.rawData.nodes).map(d => {
                    // console.log("id", d.id)
                    let numOfCollaborations = 0
                    let numOfCollaborators = 0
                    if (linksBySource.hasOwnProperty(d.id)) {
                        numOfCollaborations += lodash.sumBy(linksBySource[d.id], 'value')
                        numOfCollaborators += linksBySource[d.id].length
                    }
                    if (linksByTarget.hasOwnProperty(d.id)) {
                        numOfCollaborations += lodash.sumBy(linksByTarget[d.id], 'value')
                        numOfCollaborators += linksByTarget[d.id].length
                    }
                    // console.log(d.id, numOfCollaboration)
                    return {
                        "id": d.id,
                        "numOfCollaborations": numOfCollaborations,
                        "numOfCollaborators": numOfCollaborators,
                        "group": numOfCollaborators,
                        "name": d.fullname,
                        "dept": d.dept
                    }
                }).value()

                this.graph = {
                    nodes: nodes,
                    links: links
                }

                console.log("Graph", this.graph)
            },

            initSubGraph() {
                const lodash = this.lodash

                const graphNodes = this.graph.nodes
                const graphLinks = this.graph.links

                let nodes = lodash.groupBy(graphNodes, 'dept')[this.dept]
                let links = graphLinks.filter((d) => {
                    let sourceDept = graphNodes.find((el)=>{return el.id == d.source}).dept
                    let targetDept = graphNodes.find((el)=>{return el.id == d.target}).dept
                    if (sourceDept == this.dept && targetDept == this.dept) return true
                    else return false
                })

                let subgraph = {
                    nodes: nodes,
                    links: links
                }

                this.subGraph = subgraph
                console.log("subGraph", subgraph)
            }
        }
    }
</script>

<style scoped>

</style>