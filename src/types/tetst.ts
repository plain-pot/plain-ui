import {defineComponent} from "@vue/composition-api";
import {designComponent} from "@/use/designComponent";

defineComponent({
    props: {
        name: {type: String},
        age: {type: Number, default: 10},
        tag: {type: String, required: true},
    },
    setup(props) {

    },
})

designComponent(
    '',
    {
        name: {type: String},
        age: {type: Number, default: 10},
        tag: {type: String, required: true},
    },
    function (props) {

    },
    function () {

    }
)