import useTableOption from "./useTableOption";

const useObjectOption: typeof useTableOption = (config) => {

    if (config.enable == null) {
        config.enable = false
    }

    config.fill = undefined
    if (config.showRows == null) {
        config.showRows = Math.ceil((document.body.offsetHeight * 0.8 - 200) / 48) - 1
    }

    return useTableOption(config)
}

export default useObjectOption
