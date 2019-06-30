import HttpService from './http'
import FileService from './file'
import FormDialog from '../components/plain-table/form/index'
import {PlainObjectService} from "../components/plain-table/object";
import {OvService} from "../components/ov";

export default function PlainService(Vue) {
    const $http = new HttpService(Vue)
    const $file = new FileService(Vue)
    const $formDialog = new FormDialog(Vue)
    const $object = new PlainObjectService(Vue)
    const $ov = new OvService(Vue)

    Object.assign(Vue.prototype, {
        $http,
        $file,
        $object,
        $ov,
    })
    Object.assign(Vue.prototype.$plain, {
        $formDialog,
    })
}
