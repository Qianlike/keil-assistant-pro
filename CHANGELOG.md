# Change Log

All notable changes to the "keil-assistant-pro" extension will be documented in this file.

## [v0.0.7]
- 新增 Auto Detect 命令及图标
- 实现自动扫描工作区中 .uvproj 项目文件
- 更新 README 文档说明新功能

## [v0.0.6]
- Keil MDK includePath匹配后安装的Compiler
- Keil C51 includePath增加C51/INC的子目录
- (已知问题):某些意外情况use default compiler verisonxxx会导致project xml中的pArmCC/pCCUsed与实际使用的compiler不一致。可以通过选择指定版本来解决。(目前已知set dafault arm compiler version可能会导致这种情况)

## [v0.0.5]
- 增加一个`Open with keil`的右键菜单

## [v0.0.4]
- 修复多次注册snippet的bug

## [v0.0.3]
- 修复打开文件夹或者工作区时加载keil project的功能
- 更新说明文件

## [v0.0.2]
- 增加两个C51的snippet用来防止interrupt x报错

## [v0.0.1]
Forked from:
https://github.com/github0null/keil-assistant

See original changelog for previous history.

- 添加uvprojx时可以选择项目根目录相对于projx的位置
