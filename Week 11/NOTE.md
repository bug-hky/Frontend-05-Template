# 学习笔记

## 1.完善脑图

## 2.思考题-为什么 first-letter 可以设置 float 之类的 key，而 first-line 不行呢？

### first-letter 只对块级元素的首个文字产生影响，它设置 float 改变 display 属性不会对该块级元素造成大的影而 first-line 是针对块级元素的首行文字，设置 float 会造成整个块级元素脱离文档流，布局也需要重新计算，为了减少副作用，故不支持设置 display 较好
