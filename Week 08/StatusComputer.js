function match (string) {
    let state = start
    for (let c of string) {
        state = state(c)
    }
    return state === end
}

function start (c) {
    if (c === 'a')
        return foundA
    else
        return start
}

function end () {
    return end
}

function foundA (c) {
    if (c === 'b')
        return foundB
    else
        // reconsume
        return start(c)
}

function foundB (c) {
    if (c === 'c')
        return foundC
    else
        return start(c)
}

function foundC (c) {
    if (c === 'd')
        return foundD
    else
        return start(c)
}

function foundD (c) {
    if (c === 'e')
        return end
    else
        return start(c)
}

console.info('liupi!!', match('ababababecabcde'))