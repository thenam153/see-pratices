<template>
    <div >
        <div>
            <TopNav v-if="appConfig != null" :app-config="appConfig"/>
        </div>
        <div class="app-area">
            <div id="left-layout" style="width: 400px;">
                <Control v-if="appConfig != null" :app-config="appConfig"/>
            </div>
            <div id="right-layout">
                <div id="layout-area" >
                </div>  
            </div>
            <div style="width: 304px;">
                AppProperties
                <AppProperties v-if="appConfig != null && appConfig.currentFocus != null" :shape="appConfig.currentFocus"></AppProperties>
            </div>
        </div>
    </div>
</template>

<script>
import { Control, TopNav } from '../index'
import { AppConfig } from '../../models/app-config'
import AppProperties from '../app/AppProperties'

export default {
    name: 'MainLayout',
    components: {
        Control,
        TopNav,
        AppProperties
    },
    data() {
        return {
            stage: null,
            mainConfigs: {
                width: 1000,
                height: 1000
            },
            appConfig: null,
            defaultConfig: {
                        attrs: {
                            width: 1440,
                            height: 1080,
                            color: "rgb(255, 255, 255)"
                        },
                        children: {
                            attrs: {
                                backgroundLayer: {
                                    attrs: {
                                        name: "Background",
                                        bgRect: {
                                            draggable: false
                                        },
                                        children: []
                                    }
                                }
                            },
                            children: [],
                            className: "LayerList"
                        },
                        className: "AppConfig"
                        }
        }
    },
    mounted() {
        this.appConfig = new AppConfig({projectInfo: JSON.stringify(this.defaultConfig)});
        this.appConfig.initStage("layout-area");
    },
    methods: {
        getIdContainer: function() {
            return 'layout-area'
        } 
    }
}
</script>

<style scoped>
    .app-area {
        display: flex;
        height: 100%;
    }
    .app-area #left-layout {
        flex-grow: 1;
        height: 100%;
    }
    .app-area #right-layout {
        flex-grow: 7;
        height: 100%;
    }
    #layout-area {
            height: calc(100% - 40px);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAJElEQVQYV2NkYGDwZWBgOMvAwGAMoxkZGBikkAVAEiBBClQCAC9jCyH2BRU4AAAAAElFTkSuQmCC) repeat;
    }
</style>