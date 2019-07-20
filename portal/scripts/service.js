import HttpService from './http'
import FileService from 'src/components/file/index'
import FormDialog from '../components/plain-table/form/index'
import {PlainObjectService} from "../components/plain-table/object";
import {OvService} from "../components/ov";
import {AddressService} from "../components/address";
import {BatchModify} from "../components/plain-table/batch-modify";

export default function PlainService(Vue) {
    const $http = new HttpService(Vue)
    const $file = new FileService(Vue)
    const $formDialog = new FormDialog(Vue)
    const $object = new PlainObjectService(Vue)
    const $ov = new OvService(Vue)
    const $address = new AddressService(Vue)
    const $batchModify = new BatchModify(Vue)

    Object.assign(Vue.prototype, {
        $http,
        $file,
        $object,
        $ov,
        $address,
    })
    Object.assign(Vue.prototype.$plain, {
        $formDialog,
        $batchModify,
    })
}
