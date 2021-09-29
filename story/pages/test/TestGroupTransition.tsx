import './TestGroupTransition.scss'
import {designPage} from "plain-ui-composition";

export const demo1 = designPage(() => {
    return () => (
        <div class="demo-btn">
            this is button, <span>this is hello world</span>
        </div>
    )
})
