---
layout: post
title: Html相关面试题
tags: intrtview
---
### 1、DOCTYPE有什么用？

文档模式：混杂模式和标准模式，主要印象css内容的呈现，在某些情况下也会影响js的执行。不同浏览器的怪异模式差别非常大
在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。
HTML5 不基于 SGML，所以不需要引用 DTD。


### 如何提供包含多种语言内容的页面？
当客户端向服务器发送 HTTP 请求时，通常会发送有关语言首选项的信息，比如使用Accept-Language请求头。如果替换语言存在，服务器可以利用该信息返回与之相匹配的 HTML 文档。返回的 HTML 文档还应在<html>标签中声明lang属性，比如<html lang="en">...</html>

在后台中，HTML 将包含i18n占位符和待以替换的内容，这些按照不同语言，以 YML 或 JSON 格式存储。然后，服务器将动态生成指定语言内容的 HTML 页面。整个过程通常需要借助后台框架实现。

