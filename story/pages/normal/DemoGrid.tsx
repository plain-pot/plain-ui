import './DemoGrid.scss'
import {designPage} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlRow} from "../../../src/packages/PlRow";
import {PlCol} from "../../../src/packages/PlCol";

export default designPage(() => {

    const xs = [4, 8, 12, 8]
    return () => (
        <div class={'demo-layout'}>
            <DemoRow title="基本用法，一共24格">
                <PlRow>
                    <PlCol span="24">
                        <div class="ct-cls">col-24</div>
                    </PlCol>
                </PlRow>
                <PlRow>
                    <PlCol span="12">
                        <div class="ct-cls">col-12</div>
                    </PlCol>
                    <PlCol span="12">
                        <div class="ct-cls">col-12</div>
                    </PlCol>
                </PlRow>
                <PlRow>
                    <PlCol span="2">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                    <PlCol span="6">
                        <div class="ct-cls">col-6</div>
                    </PlCol>
                    <PlCol span="8">
                        <div class="ct-cls">col-8</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                </PlRow>
            </DemoRow>
            <DemoRow title="列间隔gutter(单位px)">
                <PlRow gutter="16">
                    <PlCol span="24">
                        <div class="ct-cls">col-24</div>
                    </PlCol>
                </PlRow>
                <PlRow gutter="16">
                    <PlCol span="12">
                        <div class="ct-cls">col-12</div>
                    </PlCol>
                    <PlCol span="12">
                        <div class="ct-cls">col-12</div>
                    </PlCol>
                </PlRow>
                <PlRow gutter="16">
                    <PlCol span="2">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                    <PlCol span="6">
                        <div class="ct-cls">col-6</div>
                    </PlCol>
                    <PlCol span="8">
                        <div class="ct-cls">col-8</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                </PlRow>
            </DemoRow>

            <DemoRow title="flex布局的栅格">
                <PlRow type="flex" align="middle">
                    <PlCol span="2">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls" style={{height: "48px"}}>col-4</div>
                    </PlCol>
                    <PlCol span="6">
                        <div class="ct-cls" style={{height: "56px"}}>col-6</div>
                    </PlCol>
                    <PlCol span="8">
                        <div class="ct-cls" style={{height: "48px"}}>col-8</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls" style={{height: "36px"}}>col-4</div>
                    </PlCol>
                </PlRow>
                <PlRow type="flex" justify="space-between">
                    <PlCol span="2">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls" style={{height: "48px"}}>col-4</div>
                    </PlCol>
                    <PlCol span="6">
                        <div class="ct-cls" style={{height: "56px"}}>col-6</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                </PlRow>
                <PlRow type="flex" justify="start">
                    <PlCol span="2">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls" style={{height: "48px"}}>col-4</div>
                    </PlCol>
                    <PlCol span="6">
                        <div class="ct-cls" style={{height: "56px"}}>col-6</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                </PlRow>
                <PlRow type="flex" align="bottom" justify="end">
                    <PlCol span="2">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls" style={{height: "48px"}}>col-4</div>
                    </PlCol>
                    <PlCol span="6">
                        <div class="ct-cls" style={{height: "56px"}}>col-6</div>
                    </PlCol>
                    <PlCol span="4">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                </PlRow>
            </DemoRow>
            <DemoRow title="当使用flex布局时，可以使用order属性排序">
                <PlRow type="flex" align="middle" gutter="16">
                    <PlCol span="2" order="1">
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4" order="2">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                    <PlCol span="6" order="4">
                        <div class="ct-cls">col-6</div>
                    </PlCol>
                    <PlCol span="8" order="3">
                        <div class="ct-cls">col-8</div>
                    </PlCol>
                    <PlCol span="4" order="5">
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                </PlRow>
            </DemoRow>

            <DemoRow title="当使用浮动布局时，可以使用pull以及push属性排序">
                <PlRow gutter="16">
                    <PlCol span="2" push="10" xs={xs[0]}>
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4" pull="2" xs={xs[1]}>
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                    <PlCol span="6" pull="2" xs={xs[2]}>
                        <div class="ct-cls">col-6</div>
                    </PlCol>
                </PlRow>
            </DemoRow>

            <DemoRow title="响应式布局，可以用chrome把客户端变成移动端模式，当为普通模式时，分别占2,4,6格，当为移动端时，分别占4,8,12格">
                <PlRow gutter="16">
                    <PlCol span="2" xs={xs[0]}>
                        <div class="ct-cls">col-2</div>
                    </PlCol>
                    <PlCol span="4" xs={xs[1]}>
                        <div class="ct-cls">col-4</div>
                    </PlCol>
                    <PlCol span="6" xs={xs[2]}>
                        <div class="ct-cls">col-6</div>
                    </PlCol>
                </PlRow>
            </DemoRow>
        </div>
    )
})
