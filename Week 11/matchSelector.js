

/**
 * 
 * 匹配任何非空白字符：\S 或  [^\s]，^用于"[]"外表示从开头匹配，用于"[]"内表示"非"，即不包括
 * 匹配任何空白字符：\s 或 [^\S]，等价于[ \f\n\r\t\v],这里小写s是匹配所有非空白,大写刚好相反
 *  \f -> 匹配一个换页
 *  \n -> 匹配一个换行符
 *  \r -> 匹配一个回车符
 *  \t -> 匹配一个制表符
 *  \v -> 匹配一个垂直制表符
 */

const NotEndSelectorReg = /[^(\.|\#|\[|\*)]/

function match (selector, element) {
    if (!selector || !element.attributes) {
        return false
    }

    let selectors = selector.split(' ').reverse()
    let curSelector = selectors[0].match(/(#|.)?[\w]+/g)

    if (selector.startsWith('#')) {
        let selectorName = ''
        for (let str in selector.replace('#', '')) {
            if (!str.match(NotEndSelectorReg)) break
            selectorName += str
        }
        let attribute = element.attributes.find(attr => attr.name === 'id')
        if (attribute && selectorName === attribute.value) {
            return true
        }
    } else if (selector.startsWith('.')) {
        let selectorName = ''
        for (let str in selector.replace('.', '')) {
            if (!str.match(NotEndSelectorReg)) break
            selectorName += str
        }
        let attribute = element.attributes.find(attr => attr.name === 'class')
        if (attribute && selectorName === attribute.value) {
            return true
        }
    } else {
        let selectorName = ''
        for (let str in selector.replace('.', '')) {
            if (!str.match(NotEndSelectorReg)) break
            selectorName += str
        }
        if (element.tagName && selectorName === element.tagName) {
            return true
        }
    }
    return false
}