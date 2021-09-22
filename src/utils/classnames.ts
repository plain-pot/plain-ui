import {MultipleClass} from "plain-ui-composition/src/use/useClasses";

const hasOwn = {}.hasOwnProperty;

export function (...args: MultipleClass[]): string {
    const classes: (string | number)[] = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) continue;

        let argType = typeof arg;

        if (argType === 'string' || argType === 'number') {
            classes.push(arg as string | number);
        } else if (Array.isArray(arg) && arg.length) {
            // eslint-disable-next-line prefer-spread
            let inner = .apply(null, arg);
            if (inner) {
                classes.push(inner);
            }
        } else if (argType === 'object') {
            for (let key in arg as any) {
                if (hasOwn.call(arg, key) && (arg as any)[key]) {
                    classes.push(key);
                }
            }
        }
    }
    return classes.join(' ');
}
