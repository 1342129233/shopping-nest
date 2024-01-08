### IoC 解决了什么痛点问题？
IoC (控制反转) 通过将对象的创建和依赖管理从代码中分离出来，解决了以下痛点问题：
1.解耦：IoC 可以帮助我们解耦代码，从而使代码更加灵活和容易维护。通过将依赖项注入到对象中，我们可以确保它们在不同情况下具有相同的行为
2.可测试性：无法轻松测试的代码往往难以维护和扩展。使用 IoC，我们可以轻松地进行单元测试，因为我们可以更轻松地管理依赖项。这样，我们就可以更容易地识别和修复问题，而不会影响其他部分的代码
3.更好的可读性：IoC 使得代码更加易读和易于维护。通过将业务逻辑与依赖项分离，我们可以更容易地读懂和理解代码
4.更好的模块化：使用 IoC，我们可以更加容易地分离和组合不同的代码段。这样，我们就可以更容易地管理代码库，并将其划分成更小的可重用模块

### js实现一个简单的 IOC
```JS
// 创建一个容器
const container = {
    dependencies: {},
    register: function(name, dependency) {
        this.dependencies[name] = dependency; // 将依赖项存储在容器中
    },
    resolve: function(dependencies, func) {
        const dependentArgs = dependencies.map((dependency) => { // 获取依赖项
            return this.dependencies[dependency];
        });
        return func.apply(null, dependentArgs); // 执行函数并传入依赖项
    }
};

// 注册依赖项
container.register('http', new HttpService());
container.register('logger', new Logger());

// 定义需要依赖注入的函数
function myFunction(http, logger) {
    // 使用依赖项
    http.get('example.com').then((response) => {
        logger.log(response);
    });
}

// 调用函数并注入依赖项
container.resolve(['http', 'logger'], myFunction);
```


