/*---------------------------------------rgb to hex-------------------------------------------*/

const INT_HEX_MAP = {10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'} as any;

const hexOne = function (value: number) {
    value = Math.min(Math.round(value), 255);
    const high = Math.floor(value / 16);
    const low = value % 16;
    return '' + (INT_HEX_MAP[high] || high) + (INT_HEX_MAP[low] || low);
};

/**
 * rgb -> hex
 * @author  韦胜健
 * @date    2020/4/4 8:58
 */
export const rgb2hex = function (r: number, g: number, b: number): string {
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
    return '#' + hexOne(r) + hexOne(g) + hexOne(b);
};

/*---------------------------------------rgb to hsv-------------------------------------------*/

/*是否为0.**形式的字符串*/
const isOnePointZero = function (n: string | number): boolean {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
};

/*是否为百分比字符串*/
const isPercentage = function (n: any): boolean {
    return typeof n === 'string' && n.indexOf('%') !== -1;
};

/*将[0,n]转换为[0,1]*/
const bound01 = function (value: string | number, max: number): number {
    if (isOnePointZero(value)) value = '100%';
    const processPercent = isPercentage(value);
    value = Math.min(max, Math.max(0, parseFloat(value as string)));
    // Automatically convert percentage into number
    if (processPercent) {
        value = parseInt(String(value * max), 10) / 100;
    }
    // Handle floating point rounding errors
    if ((Math.abs(value - max) < 0.000001)) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    return (value % max) / parseFloat(max as any as string);
};

/**
 * rgb -> hsv
 * @author  韦胜健
 * @date    2020/4/4 9:09
 */
export const rgb2hsv = function (r: number, g: number, b: number): { h: number, s: number, v: number } {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    let v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    const ret = {h: h * 360, s: s * 100, v: v * 100} as any
    Object.keys(ret).forEach(key => ret[key] = ret[key].toFixed(0) - 0)
    return ret;
};

/*---------------------------------------hsv -> rgb-------------------------------------------*/
/*
 *  hsv颜色值转rgb颜色值
 *  @author              martsforever
 *  @datetime           2019/2/16 22:43
 *  @param hue          色调，用角度度量，取值范围为0°～360°，从红色开始按逆时针方向计算，红色为0°，绿色为120°,蓝色为240°。它们的补色是：黄色为60°，青色为180°,品红为300°；
 *  @param saturation   饱和度，一种颜色，可以看成是某种光谱色与白色混合的结果。其中光谱色所占的比例愈大，颜色接近光谱色的程度就愈高，颜色的饱和度也就愈高。饱和度高，颜色则深而艳。光谱色的白光成分为0，饱和度达到最高。通常取值范围为0%～100%，值越大，颜色越饱和。
 *  @param value        明度，明度表示颜色明亮的程度，对于光源色，明度值与发光体的光亮度有关；对于物体色，此值和物体的透射比或反射比有关。通常取值范围为0%（黑）到100%（白）。
 */
export const hsv2rgb = function (hue: number, saturation: number, value: number): { r: number, g: number, b: number } {
    hue = bound01(hue, 360) * 6;
    saturation = bound01(saturation, 100);
    value = bound01(value, 100);

    const i = Math.floor(hue);
    const f = hue - i;
    const p = value * (1 - saturation);
    const q = value * (1 - f * saturation);
    const t = value * (1 - (1 - f) * saturation);
    const mod = i % 6;
    const r = [value, q, p, p, t, value][mod];
    const g = [t, value, value, q, p, p][mod];
    const b = [p, p, t, value, value, q][mod];

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

/*---------------------------------------other-------------------------------------------*/

const HEX_INT_MAP = {A: 10, B: 11, C: 12, D: 13, E: 14, F: 15} as any;

export const parseHexChannel = function (hex: string) {
    if (hex.length === 2) {
        return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
    }

    return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
};

/**
 * 判断是否为一个有效的颜色值
 * @author  韦胜健
 * @date    2020/4/7 11:32
 */
export function isEffectiveColorString(color: string): boolean {
    if (!color) return true
    if (color.indexOf('#') === 0 && /^#[0-9a-fA-F]{6}$/.test(color)) {
        return true
    } else if (color.indexOf('rgb') === 0 && /^rgb(\(\d{1,3}(,\d{1,3}){2}|a\(\d{1,3}(,\d{1,3}){2},(1\.?0*|0\.\d+))\)$/.test(color)) {
        return true
    }
    return false
}