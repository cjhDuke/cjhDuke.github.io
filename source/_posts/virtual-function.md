---
title: C++ 虚函数与多态
date: 2026-07-10 22:00:00
updated: 2026-07-10 22:00:00

categories:
  - C++
  - 面向对象

tags:
  - C++
  - 虚函数
  - 多态
---

# C++ 虚函数与多态

## 什么是虚函数

在基类成员函数前添加 `virtual`：

```cpp
#include <iostream>

class Base {
public:
    virtual void show() const {
        std::cout << "Base\n";
    }

    virtual ~Base() = default;
};
```

## 动态绑定

当基类指针指向派生类对象时，虚函数会根据对象的实际类型调用。
