---
layout: post
title: 高级算法
date: 2017-12-10 11:08:53
tags: 数据结构
---

## 动态规划
动态规划呗认为是一种与递归相反的技术。递归从顶部开始分解出多个小问题，合并成一个解决方案。动态规划从底部分解很多小问题解决掉，组成解决方案。

``` javascript

//斐波那契数列
function recurFib(n){
    if(n<2){
        return n;
    }else{
        return recurFib(n-1)+recurFib(n-2);
    }
}
console.log('斐波那契数列',recurFib(100));

//动态规划
function dynFib(n){
    var val=[];
    for(var i=0;i<=n;i++){
        val[i]=0;
    }
    if(n==0){
        return 0;
    }else if(n==1||n==2){
        return 1;
    }else{
        val[0]=0
        val[1]=1
        val[2]=1;
        for(var i=3;i<=n;i++){
            val[i]=val[i-1]+val[i-2];
        }
        return val[n];
    }
}
//console.log('动态规划',dynFib(10));

//动态规划，不用数组
function iterFib(n){
    if(n>0){
        var last=1;
        var nestLast=1;
        var result=1;
        for(var i=2;i<n;i++){
            result=last+nestLast;
            nestLast=last;
            last=result;
        }
        return result;
    }else{
        return 0;
    }
}
console.log('动态规划不用数组',iterFib(10));

```

## 贪心算法
他是一种寻找“优质解”为手段达成整体解决方案的算法。这些优质的解决方案称为局部最优解。将有希望得到正确答案的最终解决方案称为全局最优解，“贪心”会用那些看起来近乎无法找到完整解决方案的问题，次优解也是可以接受的。

``` javascript
//贪心算法
function makeChange(orginRmb,coins){
    var remainRmb=0;
    if(originRmb%50<originRmb){
        coins[3]=parseInt(originRmb%50,10);
        remainRmb=originRmb%50;
        originRmb=remainRmb;
    }
    if(originRmb%10<originRmb){
        coins[2]=parseInt(originRmb%10,10);
        remainRmb=originRmb%10;
        originRmb=remainRmb;
    }
    if(originRmb%5<originRmb){
        coins[1]=parseInt(originRmb%5,10);
        remainRmb=originRmb%5;
        originRmb=remainRmb;
    }
    coins[0]=originRmb%1;

}
var originRmb=63
var coins=[];
makeChange(originRmb,coins);
console.log(coins);
```
