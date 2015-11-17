# JustShow

一个基于node命令行工具构建的纯静态博客系统。

A pure html blog system based on node cli.

## Install

> npm install justshow -g
> show <command>

## Commands

### init <name>

在当前目录下初始化一个网站，name仅作为网站目录名称，因此name只能包含字母数字和下划线。

### start

先用cd定位到网站目录下，然后使用show start启动网站，用于本地预览。

可以在后面使用-p参数，自定义服务端口号，例如：

```
show start -p 8823
```

如果要结束，直接使用Ctrl+C终止该命令的运行。