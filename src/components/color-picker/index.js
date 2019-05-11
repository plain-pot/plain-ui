/*rgb转hex*/
const INT_HEX_MAP = {10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'};

const rgb2hex = function (r, g, b) {
    const hexOne = function (value) {
        value = Math.min(Math.round(value), 255);
        const high = Math.floor(value / 16);
        const low = value % 16;
        return '' + (INT_HEX_MAP[high] || high) + (INT_HEX_MAP[low] || low);
    };
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
    return '#' + hexOne(r) + hexOne(g) + hexOne(b);
};

/*rgb转hsv*/
const rgb2hsv = function (r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
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
    const ret = {h: h * 360, s: s * 100, v: v * 100}
    Object.keys(ret).forEach(key => ret[key] = ret[key].toFixed(0) - 0)
    return ret;
};

/*转化16进制*/
const HEX_INT_MAP = {A: 10, B: 11, C: 12, D: 13, E: 14, F: 15};

const parseHexChannel = function (hex) {
    if (hex.length === 2) {
        return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
    }

    return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
};

/*是否为0.**形式的字符串*/
const isOnePointZero = function (n) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
};

/*是否为百分比字符串*/
const isPercentage = function (n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
};

/*将[0,n]转换为[0,1]*/
const bound01 = function (value, max) {
    if (isOnePointZero(value)) value = '100%';
    const processPercent = isPercentage(value);
    value = Math.min(max, Math.max(0, parseFloat(value)));
    // Automatically convert percentage into number
    if (processPercent) {
        value = parseInt(value * max, 10) / 100;
    }
    // Handle floating point rounding errors
    if ((Math.abs(value - max) < 0.000001)) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    return (value % max) / parseFloat(max);
};

/*
 *  hsv颜色值转rgb颜色值
 *  @author              martsforever
 *  @datetime           2019/2/16 22:43
 *  @param hue          色调，用角度度量，取值范围为0°～360°，从红色开始按逆时针方向计算，红色为0°，绿色为120°,蓝色为240°。它们的补色是：黄色为60°，青色为180°,品红为300°；
 *  @param saturation   饱和度，一种颜色，可以看成是某种光谱色与白色混合的结果。其中光谱色所占的比例愈大，颜色接近光谱色的程度就愈高，颜色的饱和度也就愈高。饱和度高，颜色则深而艳。光谱色的白光成分为0，饱和度达到最高。通常取值范围为0%～100%，值越大，颜色越饱和。
 *  @param value        明度，明度表示颜色明亮的程度，对于光源色，明度值与发光体的光亮度有关；对于物体色，此值和物体的透射比或反射比有关。通常取值范围为0%（黑）到100%（白）。
 */
const hsv2rgb = function (hue, saturation, value) {
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

class Color {
    red;                    //红
    green;                  //绿
    blue;                   //蓝
    hue;                    //色相
    saturation;             //饱和度
    value;                  //明度
    alpha;                  //透明度
    hex;                    //十六进制颜色值
    enableAlpha;            //是否启用透明度设置
    format = 'hex';         //结果格式化方式，hex为16进制格式，rgb为rgb格式
    _value;

    get color() {
        if (this._value == null) return null
        return this.currentColor
    }

    get currentColor() {
        /*如果是带透明度的，强制使用rgb格式*/
        return this.enableAlpha || this.format === 'rgb' ? this.rgbColor : this.hex
    }

    get rgbColor() {
        return `rgb${this.enableAlpha ? 'a' : ''}(${this.red},${this.green},${this.blue}${this.enableAlpha ? ',' + (this.alpha / 100).toFixed(2) : ''})`
    }

    constructor(value, enableAlpha, format) {
        format != null && (this.format = format)
        /*如果开发者指定启用|禁用透明度，则使用开发者的设置，否则根据初始化的值自动判断是否需要透明度*/
        if (enableAlpha != null) this.enableAlpha = enableAlpha
        this.updateByString(value, true, enableAlpha)
    }

    updateByString(value, needInitializedEnableAlpha = false, enableAlpha) {

        this._value = value

        if (value == null) {
            this.hue = 0
            this.saturation = 0
            this.value = 100
            this.alpha = 100
            return
        }

        /*如果输入值是rgb格式*/
        if (value.indexOf('rgb') !== -1) {
            const parts = value.replace(/rgba|rgb|\(|\)/gm, '').split(/\s|,/g).filter((val) => val !== '').map((val, index) => index > 2 ? parseFloat(val) : parseInt(val, 10));
            if (parts.length === 4) {
                this.alpha = Math.floor(parseFloat(`${parts[3]}`) * 100);
                needInitializedEnableAlpha && (enableAlpha == null) && (this.enableAlpha = true)
            } else if (parts.length === 3) {
                this.alpha = 100;
                needInitializedEnableAlpha && (enableAlpha == null) && (this.enableAlpha = false)
            }
            if (parts.length >= 3) {
                this.setRgb(parts[0], parts[1], parts[2])
            }
            return
        }

        /*如果是16进制格式*/
        if (value.indexOf('#') !== -1) {
            const hex = value.replace('#', '').trim();
            if (hex.length === 8) {
                this.alpha = Math.floor(parseHexChannel(hex.substring(6)) / 255 * 100);
                needInitializedEnableAlpha && (enableAlpha == null) && (this.enableAlpha = true)
            } else if (hex.length === 3 || hex.length === 6) {
                this.alpha = 100;
                needInitializedEnableAlpha && (enableAlpha == null) && (this.enableAlpha = false)
            }
            this.setHex(value)
        }
    }

    /*
     *  通过rgb设置当前颜色
     *  @author     martsforever
     *  @datetime   2019/2/17 19:49
     */
    setRgb(r, g, b) {
        this.red = r
        this.green = g
        this.blue = b

        /*设置hsv*/
        const {h, s, v} = rgb2hsv(r, g, b)
        this.hue = h
        this.saturation = s
        this.value = v

        /*设置hex*/
        this.hex = rgb2hex(r, g, b)

        this._value = this.currentColor
    }

    /*
     *  根据当前rgb更新颜色
     *  @author     martsforever
     *  @datetime   2019/2/17 19:51
     */
    updateByRgb() {
        this.setRgb(this.red, this.green, this.blue)
    }

    /*
     *  通过十六进制色改变当前颜色
     *  @author     martsforever
     *  @datetime   2019/2/17 19:13
     */
    setHex(hex) {
        this.hex = hex

        /*设置rgb*/
        hex = hex.replace('#', '').trim();
        if (hex.length === 3) {
            this.red = parseHexChannel(hex[0] + hex[0]);
            this.green = parseHexChannel(hex[1] + hex[1]);
            this.blue = parseHexChannel(hex[2] + hex[2]);
        } else if (hex.length === 6 || hex.length === 8) {
            this.red = parseHexChannel(hex.substring(0, 2));
            this.green = parseHexChannel(hex.substring(2, 4));
            this.blue = parseHexChannel(hex.substring(4, 6));
        }
        if (hex.length === 8) {
            this.alpha = Math.floor(parseHexChannel(hex.substring(6)) / 255 * 100);
        } else if (hex.length === 3 || hex.length === 6) {
            this.alpha = 100;
        }

        /*设置hsv*/
        const {h, s, v} = rgb2hsv(this.red, this.green, this.blue)
        this.hue = h
        this.saturation = s
        this.value = v

        this._value = this.currentColor
    }

    /*
     *  根据当前hex更新rgb以及hsv
     *  @author     martsforever
     *  @datetime   2019/2/17 19:23
     */
    updateByHex() {
        this.setHex(this.hex)
    }

    /*
     *  通过设置Hsv改变当前颜色
     *  @author     martsforever
     *  @datetime   2019/2/17 19:14
     */
    setHsv(hue, saturation, value) {
        this.hue = hue
        this.saturation = saturation
        this.value = value

        /*设置rgb*/
        const {r, g, b} = hsv2rgb(hue, saturation, value)
        this.red = r
        this.green = g
        this.blue = b

        /*设置hex*/
        this.hex = rgb2hex(r, g, b)

        this._value = this.currentColor
    }

    /*
     *  根据hsv更新当前rgbyijihex
     *  @author     martsforever
     *  @datetime   2019/2/17 19:23
     */
    updateByHsv() {
        this.setHsv(this.hue, this.saturation, this.value)
    }

    updateByAlpha() {
        this._value = this.currentColor
    }
}

export {
    hsv2rgb,
    Color,
}