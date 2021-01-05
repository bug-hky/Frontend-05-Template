# 学习笔记

## 1.归类并完善脑图

根据课程进度逐步把脑图进一步完善

## 2.对象与组件

### 对象

- Properties 属性(javascript 里面的属性与方法是一体的)
- Methods 方法
- Inherit 继承关系 (javascript 默认采用的是原型继承)

### 组件

- Properties(属性)
- Methods
- Inherit
- Attribute(特性)
- Config & State(Config 构造函数中传入的初始化配置, State 是随着用户的行为发生变化的内部状态)
- Event(事件机制)
- Lifecycle
- Children(树形结构的必要性)

![avatar](./Components.png)
JSX 可以被理解为通过 attribute 来影响组件

#### Attribute vs Property

1. Attribute 强调描述性，Property 强调从属关系

2. 写法与特殊场景

Attribute:

```
<myComponent attribute="v" />
myComponnet.getAttribute("a")
myComponnet.setAttribute("a", "value")
```

Property:

```
myComponnet.a = "value"
```

早年的 js 里 calss 是关键字，HTML 的 attribute 在 class 问题上做了妥协，attribute 仍然叫做 class，而 property 变成了 calssName，两者之间是完全的互相反射关系，HTML 仍然不支持 class 这个名字

3. 有时 Attribute 是字符串，Property 是字符串语义化之后的对象，例如 style

4. 有时 Property 是经过 resolve 后的 URL，Attribute 是纯字符串

```
<a href="//m.taobao.com"></a>

var a = document.getElementByTagName('a')
a.href // 'http://m.taobao.com'
a.getAttribute('href') // '//m.taobao.com'
```

5. input 的 value

```
<input value="cute" />

var input = document.getElementByTagName('input') // 若property没有设置，则结果是attribute
input.value // cute
input.getAttribute('value') // cute
input.value = 'hello' // 若value属性已经设置，则attribute不变，property变化，元素上实际的效果是property优先
input.value // hello
input.getAttribute('value') // cute
```

input 的 value，Attribute 是相当于一个默认值

#### 如何设计组件状态

| markuo set | JS set | JS Change | User Input Change | -         |
| ---------- | ------ | --------- | ----------------- | --------- |
| x          | ok     | ok        | 一般不会改变      | property  |
| x          | ok     | ok        | 一般不会改变      | attribute |
| x          | x      | x         | ok                | state     |
| x          | ok     | x         | x                 | config    |

#### Lifecycle

```flow
st=>start:created
op1=>operation: mounted
op2=>operation: JS change/set
op3=>operation: User Input
e=>end: destroyed

```

created 和 destroyed 这两个生命周期一定有

#### Children

有两种类型的 Children:

- Content 型 Children(有几个 Child 就显示出来几个 Child，所写即所见)
- Template 型 Children(充当了一个模板的作用，最终的组件数目是根据数据生成的)
