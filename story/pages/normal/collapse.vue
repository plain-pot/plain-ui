<template>
    <div class="demo-collapse">
        <demo-row title="CollapseTransition">
            <pl-checkbox label="is show" v-model="isShow"/>
            <pl-collapse-transition>
                <div class="demo-collapse-block" v-if="isShow">
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                </div>
            </pl-collapse-transition>
        </demo-row>
        <demo-row title="Collapse">
            <pl-collapse title="折叠标题">
                <div style="font-size: 12px">
                    <ul>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                    </ul>
                </div>
            </pl-collapse>
        </demo-row>
        <demo-row title="Collapse:自定义标题">
            <pl-collapse>
                <template #title>
                    <span>折叠标题 </span>
                    <pl-icon icon="el-icon-info" v-tooltip="'提示'"/>
                </template>
                <div style="font-size: 12px">
                    <ul>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                    </ul>
                </div>
            </pl-collapse>
        </demo-row>


        <demo-row title="CollapseGroup:基本用法">
            <pl-collapse-group>
                <pl-collapse title="折叠标题1">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
                <pl-collapse title="折叠标题2">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
                <pl-collapse title="折叠标题3">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
            </pl-collapse-group>
        </demo-row>

        <demo-row title="CollapseGroup:限制打开的个数">
            <pl-collapse-group v-model="openVals">
                <pl-collapse val="1" title="折叠标题1">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
                <pl-collapse val="2" title="折叠标题2">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
                <pl-collapse val="3" title="折叠标题3">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
            </pl-collapse-group>
            <br>
            <pl-collapse-group v-model="openVals" disabled>
                <pl-collapse val="1" title="折叠标题1">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
                <pl-collapse val="2" title="折叠标题2">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
                <pl-collapse val="3" title="折叠标题3">
                    <div style="font-size: 12px">
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </pl-collapse>
            </pl-collapse-group>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "collapse",
        data() {
            return {
                isShow: true,
                openVals: [],
            }
        },
    }
</script>

<style lang="scss">
    .demo-collapse-block {
        width: 100%;
    }
</style>