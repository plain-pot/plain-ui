const MessageService = (msg: string) => {
    alert(msg)
}

export const $$message = Object.assign(MessageService, {
    primary: MessageService,
    success: MessageService,
    warn: MessageService,
    error: MessageService,
    info: MessageService,
})

export default $$message