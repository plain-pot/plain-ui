import Row from "./row";
import Col from "./col";
import {App} from 'vue';
import {installPlugin} from "../../utils/installPlugin";

export default {
    Row,
    Col,
    install: (app: App) => {
        installPlugin(app, Row)
        installPlugin(app, Col)
    }
}