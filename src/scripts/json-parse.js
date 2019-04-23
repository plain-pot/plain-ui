export const parseJson = (json, caretToDebug) => {
    const debug = typeof caretToDebug === 'number';

    const isLetter = char => char.match(/[A-Za-z]/);
    const isNumber = char => char.match(/[0-9]/);
    const isWhitespace = char => char.match(/\s/);
    const isNewline = char => char.match(/\n/);

    const lex = ({state, head, char, insert, remove, removePreviousComma, replace, push, pop}) => {
        switch (state) {
            case 'start':
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '{') {
                    push('obj');
                    return 'obj_awaiting_key';
                }
                break;

            case 'obj_awaiting_key':
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '}') {
                    removePreviousComma();
                    pop();
                    return 'obj_complete';
                }
                if (char === '"') return 'obj_key_str';
                if (char === '\'') {
                    replace('"');
                    return 'obj_key_str_incorrect_quotes';
                }
                if (isLetter(char) || isNumber(char) || char === '-') {
                    insert('"');
                    return 'obj_key_str_missing_quotes';
                }
                break;

            case 'obj_key_str_missing_quotes':
                if (char === ':') {
                    insert('"');
                    return 'obj_awaiting_value';
                }
                break;

            case 'obj_key_str_incorrect_quotes':
                if (char === '\'') {
                    replace('"');
                    return 'obj_awaiting_colon';
                }
                break;

            case 'obj_key_str':
                if (char === '"') return 'obj_awaiting_colon';
                break;

            case 'obj_awaiting_colon':
                if (char === ':') return 'obj_awaiting_value';
                break;

            case 'obj_awaiting_value':
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '\'') {
                    replace('"');
                    return 'obj_value_str_incorrect_quotes';
                }
                if (char === '{') {
                    push('obj');
                    return 'obj_awaiting_key';
                }
                if (char === '[') {
                    push('arr');
                    return 'arr_stable';
                }
                if (char === '"') return 'obj_value_str';
                if (isNumber(char)) return 'obj_value_num';
                if (char === '-') return 'obj_value_num';
                if (char === 't') return 'obj_value_true_t';
                if (char === 'f') return 'obj_value_false_f';
                if (char === 'n') return 'obj_value_null_n';
                break;

            case 'obj_value_true_t':
                if (char === 'r') return 'obj_value_true_r';
                break;
            case 'obj_value_true_r':
                if (char === 'u') return 'obj_value_true_u';
                break;
            case 'obj_value_true_u':
                if (char === 'e') return 'obj_stable';
                break;

            case 'obj_value_false_f':
                if (char === 'a') return 'obj_value_false_a';
                break;
            case 'obj_value_false_a':
                if (char === 'l') return 'obj_value_false_l';
                break;
            case 'obj_value_false_l':
                if (char === 's') return 'obj_value_false_s';
                break;
            case 'obj_value_false_s':
                if (char === 'e') return 'obj_stable';
                break;

            case 'obj_value_null_n':
                if (char === 'u') return 'obj_value_null_u';
                break;
            case 'obj_value_null_u':
                if (char === 'l') return 'obj_value_null_l';
                break;
            case 'obj_value_null_l':
                if (char === 'l') return 'obj_stable';
                break;

            case 'obj_value_str':
                if (char === '"') return 'obj_stable';
                break;

            case 'obj_value_str_incorrect_quotes':
                if (char === '\'') {
                    replace('"');
                    return 'obj_stable';
                }
                break;

            case 'obj_value_num':
                if (isNewline(char)) {
                    replace(',');
                    return 'obj_awaiting_key';
                }
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '}') {
                    pop();
                    return 'obj_complete';
                }
                if (char === ',') return 'obj_awaiting_key';
                break;

            case 'obj_stable':
                if (isNewline(char)) {
                    replace(',');
                    return 'obj_awaiting_key';
                }
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '}') {
                    pop();
                    return 'obj_complete';
                }
                if (char === ',') return 'obj_awaiting_key';
                break;

            case 'obj_complete':
                if (char === ']') {
                    pop();
                    return 'arr_complete';
                }
                if (isNewline(char)) {
                    replace(',');
                    if (head === 'obj') {
                        return 'obj_awaiting_key';
                    } else {
                        return 'arr_awaiting_value';
                    }
                }
                if (char === ',') {
                    if (head === 'obj') {
                        return 'obj_awaiting_key';
                    } else {
                        return 'arr_awaiting_value';
                    }
                }
                break;

            case 'arr_stable':
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '\'') {
                    replace('"');
                    return 'arr_value_str_incorrect_quotes';
                }
                if (char === '{') {
                    push('obj');
                    return 'obj_awaiting_key';
                }
                if (char === '[') {
                    push('arr');
                    return 'arr_stable';
                }
                if (char === ']') {
                    pop();
                    return 'arr_complete';
                }
                if (char === '"') return 'arr_value_str';
                if (isNumber(char)) return 'arr_value_num';
                if (char === '-') return 'arr_value_num';
                if (char === 't') return 'arr_value_true_t';
                if (char === 'f') return 'arr_value_false_f';
                if (char === 'n') return 'arr_value_null_n';
                break;

            case 'arr_awaiting_value':
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === '\'') {
                    replace('"');
                    return 'arr_value_str_incorrect_quotes';
                }
                if (char === '{') {
                    push('obj');
                    return 'obj_awaiting_key';
                }
                if (char === '[') {
                    push('arr');
                    return 'arr_stable';
                }
                if (char === ']') {
                    removePreviousComma();
                    pop();
                    return 'arr_complete';
                }
                if (char === '"') return 'arr_value_str';
                if (isNumber(char)) return 'arr_value_num';
                if (char === '-') return 'arr_value_num';
                if (char === 't') return 'arr_value_true_t';
                if (char === 'f') return 'arr_value_false_f';
                if (char === 'n') return 'arr_value_null_n';
                break;

            case 'arr_complete':
                if (char === '}') {
                    pop();
                    return 'obj_complete';
                }
                if (isNewline(char)) {
                    replace(',');
                    if (head === 'obj') {
                        return 'obj_awaiting_key';
                    } else {
                        return 'arr_awaiting_value';
                    }
                }
                if (char === ',') {
                    if (head === 'obj') {
                        return 'obj_awaiting_key';
                    } else {
                        return 'arr_awaiting_value';
                    }
                }
                break;

            case 'arr_value_str':
                if (char === '"') return 'arr_stable';
                break;

            case 'arr_value_str_incorrect_quotes':
                if (char === '\'') {
                    replace('"');
                    return 'arr_stable';
                }
                break;

            case 'arr_value_num':
                if (isNewline(char)) {
                    replace(',');
                    return 'arr_awaiting_value';
                }
                if (isWhitespace(char)) {
                    remove();
                }
                if (char === ']') {
                    pop();
                    return 'arr_complete';
                }
                if (char === ',') return 'arr_awaiting_value';
                break;

            case 'arr_value_true_t':
                if (char === 'r') return 'arr_value_true_r';
                break;
            case 'arr_value_true_r':
                if (char === 'u') return 'arr_value_true_u';
                break;
            case 'arr_value_true_u':
                if (char === 'e') return 'arr_stable';
                break;

            case 'arr_value_false_f':
                if (char === 'a') return 'arr_value_false_a';
                break;
            case 'arr_value_false_a':
                if (char === 'l') return 'arr_value_false_l';
                break;
            case 'arr_value_false_l':
                if (char === 's') return 'arr_value_false_s';
                break;
            case 'arr_value_false_s':
                if (char === 'e') return 'arr_stable';
                break;

            case 'arr_value_null_n':
                if (char === 'u') return 'arr_value_null_u';
                break;
            case 'arr_value_null_u':
                if (char === 'l') return 'arr_value_null_l';
                break;
            case 'arr_value_null_l':
                if (char === 'l') return 'arr_stable';
                break;

            default:
                break;
        }

        return state;
    };

    try {
        if (debug) {
            throw Error(); // force manual parse for debugging
        }
        const obj = JSON.parse(json);
        return obj;
    } catch (e) {
        let state = 'start';
        const stack = [];
        let mutableJson = json;

        if (debug) console.log('');

        let i, j;
        for (i = 0, j = 0; i < mutableJson.length; i++, j++) {

            const char = mutableJson[i];
            if (debug) {
                console.log({
                    state,
                    char,
                    i,
                    j,
                    head: stack[stack.length - 1],
                    stack: JSON.stringify(stack),
                });
                console.log({mutableJson});
            }

            if (j === caretToDebug) {
                return [i, state];
            }

            state = lex({
                state,
                head: stack[stack.length - 1],
                char,
                insert: (charToInsert) => {
                    mutableJson =
                        mutableJson.slice(0, i) +
                        charToInsert +
                        mutableJson.slice(i);
                },
                remove: () => {
                    mutableJson =
                        mutableJson.slice(0, i) +
                        mutableJson.slice(i + 1);
                    i--;
                },
                removePreviousComma: () => {
                    if (mutableJson[i - 1] === ',') {
                        mutableJson =
                            mutableJson.slice(0, i - 1) +
                            mutableJson.slice(i);
                        i--;
                    }
                },
                replace: (charToInsert) => {
                    mutableJson =
                        mutableJson.slice(0, i) +
                        charToInsert +
                        mutableJson.slice(i + 1);
                },
                push: (context) => {
                    stack.push(context);
                },
                pop: () => {
                    stack.pop();
                },
            });
        }

        if (debug) {
            console.log('FINAL STATE: ' + state);
            console.log('FINAL JSON: ' + mutableJson);
            return ['end', state];
        }

        if (state === 'obj_complete') {
            try {
                const obj = JSON.parse(mutableJson);
                return obj;
            } catch (e) {
                // console.log('Error after final state', e);
                throw Error('Could not correct JSON');
            }
        } else {
            throw Error('Incorrect final state: ' + state);
        }
    }
};
