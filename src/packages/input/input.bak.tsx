/*
import {designComponent} from "../../use/designComponent";
import {useRefs} from "../../use/useRefs";

const DatePicker = designComponent({
    emits: {
        onBlur: (e: Event, el: HTMLDivElement) => true,
        onUpdateModel: (data?: string | string[]) => true,
        onUpdateStart: (start?: string) => true,
        onUpdateEnd: (end?: string) => true,
    },
    setup({event}) {

        /!*5、这里演示注入类型以及引用类型*!/
        const clearValue = () => {}
        const loading = (flag: boolean) => {}

        return {
            refer: {
                clearValue,
                loading,
            },
            render: () => null,
        }
    },
})
/!*演示引用类型*!/
const Page = designComponent({
    setup() {

        // 第一种方式获取引用
        const datepickerRef = DatePicker.use.ref("datepicker")
        /!*检查通过*!/
        console.log(datepickerRef.value!.clearValue())
        /!*检查不通过，loading函数缺少必填参数flag*!/
        console.log(datepickerRef.value!.loading())

        // 第二种方式获取引用
        const {refs} = useRefs({
            datepicker: DatePicker,
            contentEl: HTMLDivElement,
        })
        refs.datepicker!.loading(true)
        console.log(refs.contentEl.getBoundingClientRect())

        return {
            render: () => null,
        }
    },
})
/!*演示注入类型*!/
const DatePickerChild = designComponent({
    setup() {
        const parent = DatePicker.use.inject()
        /!*检查通过*!/
        console.log(parent.clearValue())
        /!*检查不通过，loading函数缺少必填参数flag*!/
        console.log(parent.loading())

        return {
            render: () => null,
        }
    },
})*/
