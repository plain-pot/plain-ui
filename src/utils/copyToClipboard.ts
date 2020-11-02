export function copyToClipboard(text: string, success?: Function, error?: Function): void {

    const textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.opacity = '0';
    textArea.style.zIndex = '-1000';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) !!success && success()
        else !!error && error("复制到剪切板失败！");
    } catch (err) {
        !!error && error(err);
    }

    document.body.removeChild(textArea);
}