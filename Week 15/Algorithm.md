## 爬楼梯

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

> 注意：给定 n 是一个正整数

```js

思路:
1. 斐波那契数列
2. 动态规划

第一次实现 =>
export function climbStairs(n) {
  if (n === 1 || n === 2) return n;
  return climbStairs(n - 1) +  climbStairs(n - 2);
}

问题:

超出時間限制

原因:

递归的重复计算导致了内存的溢出，要优化内存的分配

最终实现 =>
/**
 * @param {number} n
 * @return {number}
 */
export function climbStairs(n) {
  if (n === 1 || n === 2) return n;
  let result = 0,
    last = 1,
    beforeLast = 2;
  for (let i = 3; i <= n; i++) {
    result = last + beforeLast;
    beforeLast = last;
    last = result;
  }
  return result;
}
```
