import {App} from "vue";
import {VNodeChild} from "../../shims";
import {RootController} from "../root";
import Controller from './message-service-controller'
import {createComponentPlugin} from "../../utils/createComponentPlugin";
import Icon from '../icon'

export interface MessageServiceOption {
    message: string,
    time?: number,
    status?: "lite" | "dark" | "primary" | "success" | "warn" | "error" | "info",
    render: () => VNodeChild,
    onClick: () => void,
    icon?: string | null,

    close?: () => boolean,
}

export default createComponentPlugin(Controller, [
    Icon,
    {
        install: (app: App) => {
            app.config.globalProperties.$message = async function (option: MessageServiceOption) {
                const root = RootController.getRoot(this.$root)
                const controller = (await root.getController('message', Controller)) as any as typeof Controller.use.class
                const service = await controller.getService(option)
                if (!!service) {
                    console.log(service)
                }
            }
        }
    }
])
