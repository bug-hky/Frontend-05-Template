## 买入卖出股票的最佳时机

给定一个数组，它的第  i 个元素是一支给定股票第 i 天的价格。

如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。

> 注意：你不能在买入股票前卖出股票

```js

思路:
1. 暴力解法
2. 动态规划

第一次实现 =>
/**
 * @param {number[]} prices
 * @return {number}
 * 暴力解法时在数据量过大的时候会超出时间限制
 */
export function maxProfit(prices) {
  if (!prices || !prices.length) return 0;
  let maxPrice = 0
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[j] - prices[i] > maxPrices) {
        maxPrice = prices[j] - prices[i]
      }
    }
  }
  return maxPrice
}

问题:

超出時間限制

原因:

二重循环，时间复杂度为O(n^2)，空间复杂度：O(1)

最终实现 - 减少时间复杂度 =>
/**
 * @param {number[]} prices
 * @return {number}
 */
export function maxProfit(prices) {
  if (!prices || !prices.length) return 0;
  let maxPrice = 0, min = Infinity
  for (let i = 0; i < prices.length; i++) {
    if (min > price[i]) {
      min = price[i]
    } else if (maxPrices < price[i] - min) {
      maxPrice = price[i] - min
    }
  }
  return maxPrice
}
```
