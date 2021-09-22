import {hsv2rgb, parseHexChannel, rgb2hex, rgb2hsv} from "./ColorUtils";

export enum ColorFormat {
    hex = 'hex',
    rgb = 'rgb'
}

export class Color {

    red = 0                                             // 红
    green = 0                                           // 绿
    blue = 0                                            // 蓝

    hue = 0                                             // 色相
    saturation = 0                                      // 饱和度
    val = 0                                             // 明亮度

    alpha = 0                                           // 透明度
    hex = ''                                            // 十六进制值
    enableAlpha = false                                 // 是否启用透明度
    format: ColorFormat = ColorFormat.hex               // 格式

    _value?: string;                                    // 当前值，hex或者rgb字符串

    /*当前rgb颜色值，如果启用透明度，则为rgba*/
    get rgbColor(): string | undefined {
        if (!this.red && !this.green && !this.blue) {
            return undefined
        }
        return `rgb${this.enableAlpha ? 'a' : ''}(${this.red},${this.green},${this.blue}${this.enableAlpha ? ',' + (this.alpha / 100).toFixed(2) : ''})`
    }

    /*当前颜色，可能是rgb，也可能是hex*/
    get currentColor(): string | undefined {
        /*如果是带透明度的，强制使用rgb格式*/
        return this.enableAlpha || this.format === 'rgb' ? this.rgbColor : this.hex
    }

    /*当前颜色值*/
    get color(): string | undefined {
        if (this._value == null) return undefined
        return this.currentColor
    }

    constructor(value: string, enableAlpha: boolean, format: ColorFormat) {
        if (format != null) {
            this.format = format
        }
        if (enableAlpha != null) {
            this.enableAlpha = enableAlpha
        }

        this.updateByString(value, true, enableAlpha)
    }

    /**
     * 根据值更新color信息
     * @author  韦胜健
     * @date    2020/4/4 21:57
     */
    public setValue(value: string): void {
        this.updateByString(value, false)
    }

    /**
     * 根据新值更新当前color信息
     * @author  韦胜健
     * @date    2020/4/4 12:10
     */
    public updateByString(value: string, needInitializedEnableAlpha = false, enableAlpha?: boolean): void {
        this._value = value
        if (value == null) {
            this.hue = 0
            this.saturation = 0
            this.val = 100
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
    setRgb(r: number, g: number, b: number): void {
        this.red = r
        this.green = g
        this.blue = b

        /*设置hsv*/
        const {h, s, v} = rgb2hsv(r, g, b)
        this.hue = h
        this.saturation = s
        this.val = v

        /*设置hex*/
        this.hex = rgb2hex(r, g, b)

        this._value = this.currentColor
    }

    /*
     *  根据当前rgb更新颜色
     *  @author     martsforever
     *  @datetime   2019/2/17 19:51
     */
    updateByRgb(): void {
        this.setRgb(this.red, this.green, this.blue)
    }

    /*
     *  通过十六进制色改变当前颜色
     *  @author     martsforever
     *  @datetime   2019/2/17 19:13
     */
    setHex(hex: string): void {
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
        this.val = v

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
    setHsv(hue: number, saturation: number, val: number) {
        this.hue = hue
        this.saturation = saturation
        this.val = val

        /*设置rgb*/
        const {r, g, b} = hsv2rgb(hue, saturation, val)
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
        this.setHsv(this.hue, this.saturation, this.val)
    }

    updateByAlpha() {
        this._value = this.currentColor
    }
}