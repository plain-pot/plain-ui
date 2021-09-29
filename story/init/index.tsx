import {initialize} from '../../src/packages/initialize'
import useTableOption from "./useTableOption";
import useObjectOption from "./useObjectOption";
import {useHttp} from "./useHttp";
import {useAddressConfig} from "./useAddressConfig";
import {useOvConfig} from "./useOvConfig";

initialize(() => ({
    useTableOption,
    useObjectOption,
    useHttp,
    useAddressConfig,
    useOvConfig,
    getExceljs: () => import('exceljs'),
    // @ts-ignore
    getFileSaver: () => import('file-saver'),
}))
