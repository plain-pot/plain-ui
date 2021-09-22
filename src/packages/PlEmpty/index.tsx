import {designComponent, useStyles} from "plain-ui-composition";

import NO_DATA_IMG from './assets/no_data.svg'
import './empty.scss'

export const PlEmpty = designComponent({
    props: {
        height: {type: String, default: '200px'},
        fontSize: {type: String, default: '14px'},
        label: {type: String, default: '暂无数据...'},
    },
    slots: ['labelContent'],
    setup({props}) {

        const styles = useStyles(styles => {
            styles.fontSize = props.fontSize
        })
        const imgStyles = useStyles((styles) => {
            styles.height = props.height
        })

        return () => (
            <div class="pl-empty" style={styles.value}>
                <img src={NO_DATA_IMG} style={imgStyles.value}/>
                <span>{props.label}</span>
            </div>
        )
    },
})

export default PlEmpty
