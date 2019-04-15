<template>
    <v-layout>
        <v-navigation-drawer :clipped="clipped" v-model="drawer" disable-resize-watcher app>
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat @click="$router.push('/level1')">Level 1</v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat @click="$router.push('/level2')">Level 2</v-btn>
                    </v-list-tile-action>
                </v-list-tile>

                <v-list-tile>
                    <v-list-tile-action>
                        <v-btn flat @click="$router.push('/level3')">Level 3</v-btn>
                    </v-list-tile-action>
                </v-list-tile>

            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed :clipped-left="clipped" color="blue" dark>
            <v-toolbar-title>
                <img @click="$router.push('/')" src="favicon.png" style="margin-top: 5px; cursor: grab" alt="favicon.png" height="40px" width="40px">
            </v-toolbar-title>
            <v-toolbar-title>

                HKUST VisLab Coding Challenge
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat @click="$router.push('/level1')">Level 1</v-btn>
                <v-btn flat @click="$router.push('/level2')">Level 2</v-btn>
                <v-btn flat @click="$router.push('/level3')">Level 3</v-btn>
            </v-toolbar-items>
            <v-toolbar-side-icon
                    @click.stop="drawer = !drawer"
                    class="hidden-md-and-up"
            >
            </v-toolbar-side-icon>
        </v-toolbar>
        <v-content>

                <v-container fluid fill-height>
                    <v-layout justify-center>
                        <router-view></router-view>
                    </v-layout>
                </v-container>

        </v-content>
        <v-footer app dark color="blue">
            <span class="caption mx-3">&copy; 2019, Noah Kim - City University of Hong Kong</span>
        </v-footer>
    </v-layout>
</template>

<script>
    export default {
        name: "default",
        data: () => {
            return {
                drawer: false,
                clipped: false
            }
        }
    }
</script>

<style scoped>
    .v-content {
        padding-top:56px !important;
    }
</style>