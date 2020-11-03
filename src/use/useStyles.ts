import {StyleProperties} from 'src/shims';
import {computed} from 'vue';

export function useStyles(
    getter: (styles: StyleProperties) => StyleProperties | void
) {
    return computed(() => {
        const style = {}
        return getter(style) || style
    })
}