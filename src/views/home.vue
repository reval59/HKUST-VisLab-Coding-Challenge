<template>
    <v-layout row wrap>
        <v-flex xs12 pa-1>
        <v-card>
            <v-card-title>
                <span class="display-1">Guide</span>
            </v-card-title>

            <v-card-text>
                <span class="title">Used Libraries</span>
                <span>
                    <ol style="font-size: 16px">
                        <li>Vue.js (with CLI)</li>
                        <li>Vuetify.js (for GUI)</li>
                        <li>d3.js</li>
                        <li>lodash.js</li>
                    </ol>
                </span>
            </v-card-text>

            <v-card-text>
                <span class="title">Remarks</span>
                <span>
                    <ol style="font-size: 16px">
                        <span class="font-weight-bold"></span>
                        <li>You can direct to this page if you click the icon on the toolbar</li>
                        <li>Every page is fully  <span class="font-weight-bold">responsive</span> and  <span class="font-weight-bold">dynamic</span></li>
                        <li>Each time page is resized, diagrams are resized as well</li>
                        <li>There is data tables for the reference. You can search any element</li>
                        <li><span class="font-weight-bold">For Level 2, </span> you can change the year range as you want</li>
                        <li><span class="font-weight-bold">For Level 3, </span> you can change the department as you want</li>
                         <li><span class="font-weight-bold">For Level 3, </span> I was not sure if the collaboration between professors from different departments should be excluded so the current version includes it</li>
                    </ol>
                </span>
            </v-card-text>

            <v-card-actions>
                <v-btn color="red" dark @click="$router.push('/level1')">GOTO Level 1</v-btn>
                <v-btn color="orange" dark @click="$router.push('/level2')">GOTO Level 2</v-btn>
                <v-btn color="green" dark @click="$router.push('/level3')">GOTO Level 3</v-btn>
            </v-card-actions>


        </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped>

</style>