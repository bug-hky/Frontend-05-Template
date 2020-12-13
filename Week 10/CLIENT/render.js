const images = require('images')

function render(viewport, element) {
    if (element.style) {
        var img = images(element.style.width, element.style.height)

        if (element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0,0,0)'
            color.match(/rgb\((\d+), (\d+), (\d+)\)/)
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
            visualViewport.draw(img, element.style.left||0, element.style.top||0)
        }
    }

    if (element.children) {
        for (var child of element.children) {
            render(viewport, child)
        }
    }
}

module.exports = render

/**
 * 单元素的绘制
 * 1.需要依赖图形环境
 * 2.这里采用的npm的images包
 * 3.绘制在viewport上进行的
 * 4.与绘制相关的属性： background-color， border， background-image
 * 
 * DOM树的绘制
 * 1.需要递归调用子元素的绘制方法完成DOM树的绘制
 * 2.忽略一些不需要绘制的节点
 * 3.实际浏览器中，文字绘制较难，需要依赖字体库
 * 4.实际浏览器中还会对一些图层做compositing
 */