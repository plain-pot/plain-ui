import {designPage, reactive} from "plain-design-composition";

import {PlcTextarea, $$file, PlButton, useOv, PlDropdown, PlDropdownMenu, PlDropdownOption, PlcImage, PlcOv, PlcInput, PlTablePro, useTableOption, Plc} from "../../../src";
import {DemoRow} from "../../components/DemoRow";
import {iOvData} from "../../../src/packages/useOv/useOv.utils";

export const demo1 = designPage(() => {

    const {$ov} = useOv()

    const state = reactive({
        imgTypes: null as null | iOvData[]
    })

    $ov.getOvByType('prod_img_type').then(val => state.imgTypes = val)

    const prodOption = useTableOption({
        // url: '/prod',
        url: 'http://1.116.13.72:7001/prod',
        showRows: 5,
        bodyRowHeight: 80,
    })

    const imgOption = useTableOption({
        url: '/upload',
        showRows: 5,
        bodyRowHeight: 80,
        parentOption: prodOption,
        parentMap: {headId: 'id'},
        enable: {update: false},
        hideButton: {
            insert: true,
            copy: true,
        },
        buttons: [
            {
                label: '新建',
                code: 'upload',
                type: 'insert',
                seq: 0,
                position: 'out',
                disabled: () => !prodOption.currentNode.value,
                render: () => (
                    <PlDropdown key="upload">
                        {{
                            reference: () => <PlButton loading={state.imgTypes == null} label="新建"/>,
                            popper: () => <PlDropdownMenu>
                                {(state.imgTypes || []).map((i, index) => (
                                    <PlDropdownOption key={index} label={i.name} onClick={() => newImageRecord(i.code)}/>
                                ))}
                            </PlDropdownMenu>
                        }}
                    </PlDropdown>
                )
            }
        ],
    })

    const newImageRecord = async (type: string) => {
        const imageFiles = await $$file.chooseImage(true)
        await new Promise<void>((resolve, reject) => {
            $$file.upload({
                action: 'http://1.116.13.72:7001/saveFiles',
                file: imageFiles,
                filename: 'file',
                data: {headId: prodOption.currentNode.value!.data.id, attr1: type},
                onSuccess: () => resolve(),
                onError: () => reject(),
            })
        })
        imgOption.pageMethods.reload()
    }

    return () => (
        <div>
            <DemoRow>
                <PlTablePro option={prodOption}>
                    <PlcImage title="产品图片" field="imgPath" imgKeyField="imgId"/>
                    <PlcInput title="产品名称" field="name" defaultSearch/>
                    <PlcOv title="产品类型" field="type" ov="prod_type"/>
                </PlTablePro>
                <PlTablePro option={imgOption}>
                    <PlcImage title="图片" field="path"/>
                    <PlcTextarea title="地址" field="path"/>
                    <PlcOv title="图片类型" field="attr1" ov="prod_img_type" defaultSearch/>
                </PlTablePro>
            </DemoRow>
        </div>
    )
})
