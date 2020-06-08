import './form.scss'
import form from './form'
import formItem from './form-item'
import {installPlugin} from "@/util/install";

export default installPlugin([
    form,
    formItem,
])