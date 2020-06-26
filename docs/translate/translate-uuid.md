# 两行代码生成 uuid

发现一个简单的方法，可以在不依赖第三方库的情况下，在 Javascript 应用程序中生成 UUID。

```js
function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}
```

在 Javascript 中可以用的 `URL.createObjectURL` 方法创建一个惟一的 URL，以表示传递给它的对象。为了让这个 URL 是唯一的， `URL.createObjectURL` 方法返回的 URL 会带上一段 36 位长的字符串，和 UUID 的长度一致，通过这个原理，就可以模拟 UUID 了。

下面是这个方法生成的 UUID 的一些例子:

```js
for (var i = 0; i < 10; ++i) {
  console.log(uuid());
}

// 执行结果如下
// f6ca05c0-fad5-46fc-a237-a8e930e7cb49
// 6a88664e-51e1-48c3-a85e-7bf00467e9e6
// e6050f4c-e86d-4081-9376-099bfbef2c30
// bde3da3c-b318-4498-8a03-9a773afa84bd
// ba0fda03-f806-4c2f-b6f5-1e74a299e603
// 62b2edc3-b09f-4bf9-8dbf-c4d599479a29
// e70c0609-22ad-4493-abcc-0e3445291397
// 920255b2-1838-497d-bc33-56550842b378
// 45559c64-971c-4236-9cfc-706048b60e70
// 4bc4bbb9-1e90-432b-99e8-277b40af92cd
```

> 注意: URL.createObjectURL 的目的不是生成随机 UUID。 因此，上述生成 UUID 的方法可能会导致我尚未意识到的副作用。 如果你能想到任何问题，麻烦留言回复我，谢谢。

![前端日志](https://cdn.yinhengli.com/qianduanrizhi.png)

参考链接：[Standalone UUID generator in Javascript](https://abhishekdutta.org/blog/standalone_uuid_generator_in_javascript.html)
