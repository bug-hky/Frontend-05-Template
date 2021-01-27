## 最大子序和

给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

```js

思路:
1. 动态规划
2. 分治

第一次实现 =>
/**
 * @param {number[]} nums
 * @return {number}
 */
export function maxSubArray (nums) {
    let maxSum = nums[0], pre = 0
    nums.forEach((num) => {
        pre = Math.max(pre + num, num)
        maxSum = Math.max(maxSum, pre)
    })
    return maxSum
}

时间复杂度为O(n)

分治实现 =>
/**
 * @param {number[]} nums
 * @return {number}
 */
export function maxSubArray (nums) {

}
```
