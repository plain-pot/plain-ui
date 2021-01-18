import {designComponent} from "../../../use/designComponent";
import {plainDate} from "../plainDate";
import {DatePublicProps} from "../date.utils";

export const PlDatePanelYear = designComponent({
    name: 'pl-date-panel-year',
    props: {
        ...DatePublicProps,

    },
    setup({props}) {

        // const d = plainDate(new Date(), {displayFormat: 'YYYY年MM月DD日 HH时mm分ss秒', valueFormat: 'YYYY-MM-DD HH:mm:ss'});
        console.log(plainDate.DayJs(new Date('2020-12-31')).format('YYYY年 ww周'))

        return {
            render: () => (
                <div>
                    pl date panel year
                </div>
            )
        }
    },
})