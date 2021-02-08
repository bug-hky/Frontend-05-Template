function getStyle (element) {
    if (!element.style)
        element.style = {}
    for (let prop in element.computedStyle) {
        let p = element.computedStyle.value
        element.style[prop] = element.computedStyle[prop].value

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }

    return element.style
}

function layout (element) {
    if (!element.computedStyle)
        return

    var elementStyle = getStyle(element)

    if (elementStyle.display !== 'flex')
        return

    var items = element.children.filter(e => e.type === 'element')

    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0)
    })

    var style = elementStyle

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }       
    })

    if (!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row'
    if (!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch'
    if (!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start'
    if (!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap'
    if (!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch'

    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase
    if (style.flexDirection === 'row') {
        mainSize = 'width'
        mainStart = 'left'
        mainEnd = 'right'
        mainSign = +1
        mainBase = 0
        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1
        mainBase = style.width
        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }
    if (style.flexDirection === 'column') {
        mainSize = 'height'
        mainStart = 'top'
        mainEnd = 'bottom'
        mainSign = +1
        mainBase = 0
        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }
    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1
        mainBase = style.height
        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }

    // 交叉轴只受wrap-reverse的影响
    if (style.flexWrap === 'wrap-reverse') {
        var tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
    } else {
        crossBase = 0
        crossSign = +1
    }

    var isAutoMainSize = false
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0
        for (var i = 0; i< items.length; i++) {
            var item = items[i]
            var itemStyle = getStyle(item)
            if (itemStyle[mainSize] !== null && itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] += itemStyle[mainSize]
            }
        }
        isAutoMainSize = true
    }

    var flexLine = []
    var flexLines = [flexLine]

    var mainSpace = elementStyle[mainSize]
    var crossSpace = 0

    for (var i = 0; i < items.length; i++) {
        var item = items[i]
        var itemStyle = getStyle(item)

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0
        }

        if (itemStyle.flex) {
            flexLine.push(item)
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize]
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace])
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }
            if (mainSpace < itemStyle[main]) {
                flexLine.mainSpace = mainSpace
                flexLine.crossSpace = crossSpace
                flexLine = [item]
                flexLines.push(flexLine)
                // reset mainSpace crossSpace
                mainSpace = style[mainSize]
                crossSpace = 0
            } else {
                flexLine.push(item)
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace])
            }
            mainSpace -= itemStyle[mainSize]
        }
    }
    // 主轴方向的计算主要是分配mainSpace
    flexLine.mainSpace = mainSpace

    console.info(items)
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace
    } else {
        flexLine.crossSpace = crossSpace
    }

    if (mainSpace < 0) {
        // 等比压缩
        var scale = style[mainSize] / (style[mainSize] - mainSpace)
        var currentMain = mainBase
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var itemStyle = getStyle(item)

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0
            }

            itemStyle[mainSize] = mainSize * scale

            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd]
        }
    } else {
        flexLines.forEach(function (items) {
            var mainSpace = mainSpace
            var flexTotal = 0
            for (var i = 0; i < items.length; i++) {
                var item = items[i]
                var itemStyle = getStyle(item)

                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex
                    continue
                }
            }

            if (flexTotal > 0) {
                var currentMain = mainBase
                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    var itemStyle = getStyle(item)
                     if (itemStyle.flex) {
                         itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                     }
                     itemStyle[mainStart] = currentMain
                     itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                     currentMain = itemStyle[mainEnd]
                }
            } else {
                if (style.justifyContent === 'flex-start') {
                    var currentMain = mainBase
                    var step = 0
                }
                if (style.justifyContent === 'flex-end') {
                    var currentMain = mainSpace * mainSign + mainBase
                    var step = 0
                }
                if (style.justifyContent === 'center') {
                    var currentMain = mainSpace / 2 * mainSign + mainBase
                    var step = 0
                }
                if (style.justifyContent === 'space-between') {
                    var step = mainSpace / (items.length - 1) + mainBase
                    var currentMain = mainBase
                }
                if (style.justifyContent === 'space-around') {
                    var step = mainSpace / items.length + mainBase
                    var currentMain = step / 2 + mainBase
                }
                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    var itemStyle = getStyle(item)
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd] + step
                }
            }
        })
    }

    // 交叉轴方向的计算
    var crossSpace
    if (!style[crossSpace]) {
        crossSpace = 0
        elementStyle[crossSize] = 0
        for (var i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSize
        }
    } else {
        crossSpace = style[crossSize]
        for (var i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize]
    } else {
        crossBase = 0
    }

    var lineSize = style[crossSize] / flexLines.length
    var step
    if (style.alignContent === 'flex-start') {
        crossBase += 0
        step = 0
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace
        step = 0
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2
        step = 0
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0
        step = crossSpace / (flexLines.length - 1)
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / flexLines.length
        crossBase += crossSign * step / 2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0
        step = 0
    }
    flexLines.forEach(function (items) {
        var lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var itemStyle = getStyle(item)

            var align = itemStyle.alignSelf || style.alignItems

            if (item === null) {
                itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
                itemStyle[crossStart] = itemStyle[crossEnd] + crossSign * itemStyle[crossSize]
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize] / 2)
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize)
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step)
    })
}

module.exports = layout

/**
 * 一. 准备工作
 * 1.处理掉flexDirection 和 wrap相关的属性
 * 2.把具体的height，width等属性抽象成了main，cross相关的属性
 * 
 * 二. 收集元素进行
 * 1.根据主轴尺寸，把元素进行分行
 * 2.若设置了no-wrap，强行分配进第一行
 * 
 * 三. 计算主轴方向
 * 1.找出所有Flex元素
 * 2.把主轴方向的剩余尺寸按比例分配给这些元素
 * 3.若剩余空间为负数，所有flex元素为0，等比压缩剩余元素
 * 
 * 四. 计算交叉轴方向
 * 1.根据每一行中最大元素尺寸计算行高
 * 2.根据行高flex-align 和 item-align，确定元素具体位置
 * 
 * 
 */