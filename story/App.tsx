import {defineComponent} from "vue";
import {DemoRowController} from "./components/DemoRowController";
import {AppMenu} from "./app/AppMenu";
import {AppNavigator} from "./app/AppNavigator";
import './app.scss'

export default defineComponent(() => {
    return () => <>
        <DemoRowController>
            <div class="app-head">
                <div>Plain Design</div>
            </div>
            <AppMenu/>
            <AppNavigator/>
        </DemoRowController>
    </>
})