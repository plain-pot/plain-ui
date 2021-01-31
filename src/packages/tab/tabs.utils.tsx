import {PlTabComponent} from "./tab";

export enum TabHeadType {
    text = 'text',
    card = 'card',
}

export enum TabHeadPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
}

export type TabData = { item: PlTabComponent, index: number, active: boolean }