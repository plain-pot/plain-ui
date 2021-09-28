import {PropType} from "plain-design-composition";
import {PlTabComponent} from "../PlTab";

export enum TabHeadType {
    text = 'text',
    card = 'card',
    shadow = 'shadow',
}

export enum TabHeadPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
}

export const TabCommonProps = {
    headType: {type: String as PropType<keyof typeof TabHeadType>, default: TabHeadType.text},                      // 页签样式
    headPosition: {type: String as PropType<keyof typeof TabHeadPosition>, default: TabHeadPosition.top},           // 页签位置
}

export type TabData = { item: PlTabComponent, index: number, active: boolean }
