import Icon from '../icon'
import Loading from '../loading'
import Button from '../button'
import Number from '../number'

import Pagination from './pagination'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Pagination, {
    plugins: [
        Icon,
        Loading,
        Button,
        Number,
    ]
})