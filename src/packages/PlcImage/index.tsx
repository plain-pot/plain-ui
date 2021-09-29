import {designComponent} from "plain-ui-composition";
import {createPlcPropOptions, PlcEmitsOptions, PlcPropsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlObjectPropsOption} from "../PlObject";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";

import PlImage from "../PlImage";
import {injectPlainTable} from "../PlTable";
import PlImageUploader from "../PlImageUploader";
import {$$image} from "../../index";

export const PlcImage = designComponent({
    props: {
        ...PlcPropsOptions,
        ...PlObjectPropsOption,
        ...createPlcPropOptions({
            align: 'center',
            noPadding: true,
        }),
        imgKeyField: {type: String},
        uploadUrl: {type: String, default: 'http://1.116.13.72:7001/saveFile'},
        urlPrefix: {type: String, default: 'http://1.116.13.72'},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {

        const table = injectPlainTable()
        const bodyRowHeight = table.props.bodyRowHeight
        const size = Math.ceil((bodyRowHeight as number) - 20)

        const uploadConfig = {
            action: props.uploadUrl,
            filename: 'file',
            data: {},
        }

        const formatUrl = (url: string | undefined | null): string | null | undefined => {
            if (!props.urlPrefix) {return }
            if (url == null) {return url}
            if (/^(https?|data:image)/.test(url)) {return url}

            const urlPrefix = props.urlPrefix[props.urlPrefix.length - 1] === '/' ? props.urlPrefix.slice(0, -1) : props.urlPrefix
            const imgUrl = url[0] === '/' ? url.slice(1) : url

            return [urlPrefix, imgUrl].join('/')
        }

        const preview = (index: number) => {
            $$image.preview((table.dataModel.value || []).map(i => formatUrl(i[props.field!])), index)
        }

        return useExternalPlc({
            props,
            slots,
            scopeSlots,
            event,
            defaultScopeSlots: {
                normal: ({row, plc, node}) => (
                    !plc.props.field ? null : <PlImage
                        previewOnClick={false}
                        src={formatUrl(row[plc.props.field])}
                        height={size}
                        width={size}
                        fit="cover"
                        onClick={() => preview(node.index)}
                    />
                ),
                edit: ({row, plc}) => !plc.props.field ? null :
                    <PlImageUploader
                        modelValue={formatUrl(row[plc.props.field])!}
                        onUpdateModelValue={val => row[plc.props.field!] = val}
                        uploadConfig={uploadConfig}
                        height={size}
                        width={size}
                        handleDelete={() => {
                            row[plc.props.field!] = null
                            row[props.imgKeyField!] = null
                        }}
                        onUploadSuccess={(resp: any) => {
                            row[props.imgKeyField!] = resp.data.id
                        }}
                    />
            }
        })
    },
})

export default PlcImage
