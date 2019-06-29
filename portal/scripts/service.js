import HttpService from './http'
import FileService from './file'
import FormDialog from '../components/plain-table/form/index'
import {PlainObjectService} from "../components/plain-table/object";

export default function PlainService(Vue) {
    const $http = new HttpService(Vue)
    const $file = new FileService(Vue)
    const $formDialog = new FormDialog(Vue)
    const $object = new PlainObjectService(Vue)

    Object.assign(Vue.prototype, {
        $http,
        $file,
        $object,
    })
    Object.assign(Vue.prototype.$plain, {
        $formDialog,
    })
}
