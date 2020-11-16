export function getElement(ref: any): HTMLElement | null {

    if (!ref) {
        return null
    }

    if (!!ref.$el) {
        return getElement(ref.$el)
    }

    if (ref.nodeType !== 3) {
        return ref
    }

    return !!ref.data ? ref : ref.nextElementSibling

}