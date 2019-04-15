<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
            <v-toolbar color="white" light>
                <v-toolbar-title>Level 2 Challenge: Improvement of the Year/Month Heatmap</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-card-title>
                    <span class="title">Input Data: {{file}}</span>

                </v-card-title>

                <v-card-text>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            outline

                    ></v-text-field>
                    <v-data-table
                            :headers="headers"
                            :items="rawData"
                            :search="search"
                    >
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.date }}</td>
                            <td class="text-xs-center">{{ props.item.max_temperature }}</td>
                            <td class="text-xs-center">{{ props.item.min_temperature }}</td>

                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 pa-1>
            <v-card>
                <v-card-title>
                    <div>
                        <h3 class="title mb-0">Year/Month Heatmap</h3>
                        <v-label>Display Value: {{displayProperty}}</v-label>
                        <br>
                        <v-label>Year Range: {{startYear}} - {{endYear}}</v-label>


                        <v-layout row wrap>
                            <v-flex xs12 sm5 md4 pa-1>
                                <v-text-field
                                        label="Start Year"
                                        outline
                                        v-model="input.startYear"
                                        type="number"
                                        min="1900"
                                        step="1"
                                        max="2100"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm5 md4 pa-1>
                                <v-text-field
                                        label="End Year"
                                        outline
                                        v-model="input.endYear"
                                        type="number"
                                        min="1900"
                                        step="1"
                                        max="2100"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm2 md3 pa-1>
                                <v-btn @click="changeYearRange">
                                    Apply
                                </v-btn>
                            </v-flex>
                        </v-layout>

                    </div>

                </v-card-title>


                <v-card-actions>
                    <v-btn color="error" @click="changeDisplayProperty('max_temperature')">MAX Temperature</v-btn>
                    <v-btn color="primary" @click="changeDisplayProperty('min_temperature')">MIN Temperature</v-btn>
                </v-card-actions>

                <v-card-text ref="heatMapContainer2">
                    <improved-temperature-heat-map :rawData="rawData" :display-property="displayProperty"
                                                   :startYear="startYear" :endYear="endYear"
                                                   :height="container.height" :width="container.width"
                    >

                    </improved-temperature-heat-map>
                </v-card-text>
            </v-card>
        </v-flex>

    </v-layout>

</template>

<script>
    import ImprovedTemperatureHeatMap from '../components/ImprovedTemperatureHeatMap'

    export default {
        name: "level2",
        components: {ImprovedTemperatureHeatMap},
        data: () => {
            return {
                search: '',
                headers: [
                    {text: 'Date', value: 'date', align: 'center'},
                    {text: 'Max Temperature', value: 'max_temperature', align: 'center'},
                    {text: 'Min Temperature', value: 'min_temperature', align: 'center'},
                ],
                rawData: [],
                file: "data/temperature_daily.csv",
                displayProperty: 'max_temperature',
                startYear: 2008,
                endYear: 2017,
                input: {
                    startYear: 2000,
                    endYear: 2017
                },

                container: {
                    width: 0,
                    height: 0
                },


                // for resizing diagram only after resizing is finished
                resizeID: null
            }
        },

        async mounted() {
            this.rawData = await this.d3.csv(this.file)
            window.addEventListener('resize', this.onResize)
            this.initContainerSize()
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize)
        },
        methods: {
            changeDisplayProperty(val) {
                this.displayProperty = val
            },
            changeYearRange() {
                this.startYear = parseInt(this.input.startYear)
                this.endYear = parseInt(this.input.endYear)

            },
            onResize(e) {
                clearTimeout(this.resizeID);
                this.resizeID = setTimeout(this.initContainerSize, 500)

            },
            initContainerSize() {
                this.container.width = this.$refs.heatMapContainer2.clientWidth
                this.container.height = parseInt(this.container.width * 0.8)
            }

        }
    }
</script>

<style scoped>

</style>