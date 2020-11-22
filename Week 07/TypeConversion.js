export function StringToNumber (string) {
    if (string.startsWith('0x')) {
        return parseInt(string.subString(2), 16)
    }
    if (string.startsWith('0b')) {
        return parseInt(string.subString(2), 2)
    }
    if (string.startsWith('0')) {
        return parseInt(string.subString(1), 8)
    }
    return parseInt(string, 10)
}

export function NumberToString (number, radix) {
    return (number).toString(radix)
}