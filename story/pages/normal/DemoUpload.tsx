import {computed, designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlUpload, UploadFile} from "../../../src/packages/PlUpload";
import $$file, {FileServiceSingleFile} from "../../../src/packages/$$file";
import $$notice from "../../../src/packages/$$notice";
import PlDropdown from "../../../src/packages/PlDropdown";
import PlButton from "../../../src/packages/PlButton";
import PlIcon from "../../../src/packages/PlIcon";
import PlDropdownMenu from "../../../src/packages/PlDropdownMenu";
import PlDropdownOption from "../../../src/packages/PlDropdownOption";
import {plainDate} from "../../../src/utils/plainDate";
import {toArray} from "plain-utils/utils/toArray";

export default designPage(() => {

    const state = reactive({
        isSaveFile: false,
        val: {
            // singleValue: {id: '001', name: 'logo.jpg',},
            singleValue: undefined,
            0: [
                {id: '001', name: 'logo.jpg',},
                {id: '002', name: 'home.jpg',},
                {id: '003', name: 'sketch.png',},
            ],
            1: [
                {id: '000', name: '已完成.jpg',},
                {id: '001', name: '上传成功.jpg', status: 'success'},
                {id: '002', name: '准备就绪.jpg', status: 'ready'},
                {id: '003', name: '上传失败.jpg', status: 'error'},
                {id: '004', name: '正在上传.jpg', status: 'uploading', percent: 78},
                {id: '005', name: '已删除.jpg', status: 'remove'},
            ],
        } as any,
        uploadData: {
            level: '123',
            orgCode: '001-123',
            attr1: plainDate.today('YYYY-MM-DD HH:mm:ss', '').getDisplay(),
        },
        uploadHeaders: {
            Authorization: '2781368215742187',
        },
        handleRemove: (file: UploadFile) => {
            console.log('remove file', file)
        },
        handlePreview(file: UploadFile) {
            $$notice.info(file.name)
        },
        chooseFileValidator(file: FileServiceSingleFile) {
            const {name, calcSize} = file
            const filename = name.slice(0, name.lastIndexOf('.'))
            if (filename.length > 3) {
                $$notice.warn(`文件【${name}】校验不通过，文件名最大三个字符。`, {time: 5000})
                return false
            }
            if (calcSize > 0.1) {
                $$notice.warn(`文件【${name}】校验不通过，文件大小超出 0.1 M`, {time: 5000})
                return false
            }
        },
        customUpload: {
            val: [],
            businessType: null as null | string,
            handleRemove: () => {
                console.log('调用接口删除后端文件')
            },
            handleUpload: async (files: UploadFile | UploadFile[]) => {
                await Promise.all(toArray(files).map(file => $$file.upload({
                    action: urls.value.single,
                    filename: 'file',
                    file: file.file!,
                    data: file.file!.data,
                })))
            },
            validator: (file: FileServiceSingleFile) => {
                const {businessType} = state.customUpload
                if (!businessType) {
                    $$notice.error('请先选择业务类型！')
                    return false
                }
                file.data = {businessType, attr1: businessType}
                return true
            },
        },
    })

    const urls = computed(() => {
        return state.isSaveFile ? {
            single: 'http://1.116.13.72:7001/saveFile',
            multiple: 'http://1.116.13.72:7001/saveFiles',
        } : {
            single: 'http://1.116.13.72:7001/uploadFile',
            multiple: 'http://1.116.13.72:7001/uploadFiles',
        }
    })

    return () => (
        <div>
            <DemoRow title={'单文件上传'}>
                <PlUpload
                    multiple={false}
                    data={state.uploadData}
                    headers={state.uploadHeaders}
                    v-model={state.val.singleValue}
                    action={urls.value.single}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                    onUploadSuccess={(param) => {
                        console.log(param)
                    }}
                />
            </DemoRow>
            <DemoRow title={'多文件上传'}>
                <PlUpload
                    v-model={state.val[0]}
                    data={state.uploadData}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                    onUploadSuccess={(param) => {
                        console.log(param)
                    }}
                />
            </DemoRow>
            <DemoRow title={'文件预览'}>
                <PlUpload
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                    handlePreview={state.handlePreview}
                />
            </DemoRow>
            <DemoRow title={'选择特定类型的文件'}>
                <h4>内置的accept：excel（另一个是image）</h4>
                <PlUpload
                    accept={'excel'}
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
                <h4>自定义accept，选择png文件</h4>
                <PlUpload
                    accept={'image/png'}
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
            </DemoRow>
            <DemoRow title={'选择文件的时候，校验文件'}>
                <h4>点击选择文件</h4>
                <PlUpload
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    validator={state.chooseFileValidator}
                />
            </DemoRow>
            <DemoRow title={'文件状态'}>
                <PlUpload
                    v-model={state.val[1]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
            </DemoRow>
            <DemoRow title={'拖拽上传'}>
                <PlUpload
                    v-model={state.val[0]}
                    draggable
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
            </DemoRow>
            <DemoRow title={'手动上传'}>
                <h4>单文件上传</h4>
                <PlUpload
                    autoUpload={false}
                    multiple={false}
                    data={state.uploadData}
                    headers={state.uploadHeaders}
                    v-model={state.val.singleValue}
                    action={urls.value.single}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
                <h4>多文件上传</h4>
                <PlUpload
                    autoUpload={false}
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
            </DemoRow>
            <DemoRow title={'禁用上传'}>
                <h4>单文件上传</h4>
                <PlUpload
                    disabled
                    multiple={false}
                    data={state.uploadData}
                    headers={state.uploadHeaders}
                    v-model={state.val.singleValue}
                    action={urls.value.single}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
                <h4>多文件上传</h4>
                <PlUpload
                    disabled
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
                <h4>多文件上传</h4>
                <PlUpload
                    disabled
                    draggable
                    v-model={state.val[0]}
                    action={urls.value.multiple}
                    filename={'file'}
                    handleRemove={state.handleRemove}
                />
            </DemoRow>
            <DemoRow title={'自定义上传：将多个文件分开上传，并且每一个文件需要选择一个类型'}>
                <h4>多文件上传</h4>
                <PlUpload
                    autoUpload={false}
                    v-model={state.customUpload.val}
                    action={urls.value.multiple}
                    filename="file"
                    handleUpload={state.customUpload.handleUpload}
                    handleRemove={state.customUpload.handleRemove}
                    validator={state.customUpload.validator}
                    v-slots={{
                        default: ({index, item}) => (
                            <span>{index + 1}、{item.name}--[[{item.file!.data.businessType}]]</span>
                        ),
                        /*todo demo upload*/
                        button: () => (
                            <PlDropdown v-slots={{
                                default: () => <PlButton>
                                    <span>业务类型：{state.customUpload.businessType || '无'}</span>
                                    <PlIcon icon={'el-icon-arrow-down'}/>
                                </PlButton>,
                                popper: () => (
                                    <PlDropdownMenu>
                                        <PlDropdownOption label={'搜索'} onClick={() => state.customUpload.businessType = '搜索'} icon={'el-icon-search'}/>
                                        <PlDropdownOption label={'排序'} onClick={() => state.customUpload.businessType = '排序'} icon={'el-icon-sort'}/>
                                        <PlDropdownOption label={'删除'} onClick={() => state.customUpload.businessType = '删除'} icon={'el-icon-folder-delete'}/>
                                    </PlDropdownMenu>
                                )
                            }}/>
                        )
                    }}
                />
            </DemoRow>
        </div>
    )
})
