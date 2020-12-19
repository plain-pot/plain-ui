import {Plc} from "../../core/plc.type";
import {TablePlcFixedType} from "../../../core/table.utils";

export function processPlcFixed(flatPlcList: Plc[]) {
    const collect = (() => {
        const left = [] as Plc[]
        const right = [] as Plc[]
        flatPlcList.forEach(plc => {
            switch (plc.props.fixed) {
                case TablePlcFixedType.left:
                    left.push(plc)
                    break
                case TablePlcFixedType.right:
                    right.push(plc)
                    break
            }
        })
        return {
            left,
            right,
        }
    })();
    const width = {
        left: 0,
        right: 0,
    };
    Object.keys(collect).forEach((item) => {
        const key = item as 'left' | 'right'
        let list = collect[key]!
        if (key === 'right') {list = list.reverse()}

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            width[key] += element.props.width
            if (i === 0) {
                element.fixedPosition[key] = 0
            } else {
                const {props: {width: prevWidth}, fixedPosition: {[key]: prevValue}} = list[i - 1]!
                element.fixedPosition[key] = Number(prevWidth) + prevValue
            }
        }
    })
}