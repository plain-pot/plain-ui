import TagInput from './tag-input'
import Tag from '../tag'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(TagInput, {
    plugins: [
        Tag
    ]
})