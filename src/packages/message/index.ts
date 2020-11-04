import {ComponentPublicInstance, App} from "vue";
import {VNodeChild} from "../../shims";
import {RootController} from "../root";
import Controller from './message-service-controller'

export interface MessageServiceOption {
    message: string,
    time?: number,
    status?: "lite" | "dark" | "primary" | "success" | "warn" | "error" | "info",
    render: () => VNodeChild,
    onClick: () => void,
    icon?: string | null,
}

function create(ins: ComponentPublicInstance) {
    return async (option: MessageServiceOption) => {
        const root = RootController.getRoot(ins.$root!)
        const controller = await root.getController('message', Controller)
    }
}

export default {
    install: (app: App) => {
        app.config.globalProperties.$message = async function () {
            const root = RootController.getRoot(this.$root)
            const controller = await root.getController('message', Controller)
            console.log('controller', controller)
        }
    }
}