import {defineComponent} from "vue";
import {DemoRowController} from "./components/DemoRowController";
import {AppMenu} from "./app/AppMenu";
import {AppNavigator} from "./app/AppNavigator";
import './app.scss'
import {PlRoot} from "../src/packages/PlRoot";

export default defineComponent(() => {
    return () => <>
        <PlRoot>
            <DemoRowController>
                <div class="app-head">
                    <div>Plain Design</div>
                </div>
                <AppMenu/>
                <AppNavigator/>
            </DemoRowController>
        </PlRoot>
    </>
})