<template>
    <v-layout>
        <v-navigation-drawer :clipped="clipped" v-model="drawer" disable-resize-watcher app>
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat>Level 1</v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat>Level 2</v-btn>
                    </v-list-tile-action>
                </v-list-tile>

                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat>Level 3</v-btn>
                    </v-list-tile-action>
                </v-list-tile>

                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat>Level 6</v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app :clipped-left="clipped" color="blue" dark>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" ></v-toolbar-side-icon>
            <v-toolbar-title>
                <img src="img/logo.png" style="margin-bottom: 5px" alt="login.png" width="147px" height="52px">
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat>Level 1</v-btn>
                <v-btn flat>Level 2</v-btn>
                <v-btn flat>Level 3</v-btn>
                <v-btn flat>Level 6</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer app></v-footer>
    </v-layout>
</template>

<script>
    export default {
        name: "default",
        data: () => {
            return {
                drawer: true,
                clipped: false
            }
        }
    }
</script>

<style scoped>

</style>