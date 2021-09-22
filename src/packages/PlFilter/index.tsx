import {designComponent, PropType} from "plain-ui-composition";

import {FilterConfig, iFilterTargetOption} from "./FilterConfig";
import PlSelect from "../PlSelect";
import PlSelectOption from "../PlSelectOption";
import PlInputGroup from "../PlInputGroup";
import PlButton from "../PlButton";
import './filter.scss'

export const PlFilter = designComponent({
    inheritPropsType: PlInputGroup,
    props: {
        fto: {type: Object as PropType<iFilterTargetOption>},
        hideSearchButton: {type: Boolean}
    },
    slots: ['prepend', 'append'],
    emits: {
        onConfirm: () => true,
        onHandlerNameChange: (handlerName: string) => true,
    },
    setup: ({props, slots, event: {emit}}) => {

        const onHandlerNameChange = (handlerName: string) => {
            if (!props.fto) {return}
            props.fto.option.value = null
            emit.onHandlerNameChange(handlerName)
        }

        return () => {
            if (!props.fto) {return null}
            return (
                <PlInputGroup class="pl-filter">
                    {slots.prepend()}
                    <PlSelect
                        v-model={props.fto.option.handlerName}
                        inputProps={{width: 80, clearIcon: false}}
                        filterable={false}
                        onChange={onHandlerNameChange as any}
                        class="pl-filter-ele"
                    >
                        {Object.values(props.fto.filter.handlers).map((handler, index) => <PlSelectOption key={index} label={handler.handlerName} val={handler.handlerName}/>)}
                    </PlSelect>
                    <Fragment key={props.fto.option.filterName + props.fto.option.handlerName}>
                        {FilterConfig.getHandler(props.fto.option.filterName, props.fto.option.handlerName)?.render(props.fto, emit.onConfirm)}
                        {!props.hideSearchButton && <PlButton label="搜索" onClick={emit.onConfirm} class="pl-filter-ele"/>}
                    </Fragment>
                    {slots.append()}
                </PlInputGroup>
            )
        }
    },
})

export default PlFilter
