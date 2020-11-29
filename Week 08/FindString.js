function findStr (str, pattern) {
    let isMatching = false
    let i = 0
    for (let code of str) {
        if (!isMatching && code === pattern[i]) {
            isMatching = true
            i++
        } else if (isMatching && code === pattern[i]){
            if (i === pattern.length - 1) return true
            isMatching = true
            i++
        } else {
            isMatching = false
        }
    }
    return false
}

console.info('test', findStr('21343rwdsdfreguinfdifbre7dew', 'freguin'))