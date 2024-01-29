import { validate, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// 自定义装饰器，验证一个数字是否在1到10之间
function IsBetweenOneAndTen(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isBetweenOneAndTen',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: (value: any, args: ValidationArguments) => {
                    return value >= 1 && value <= 10;
                }
            }
        });
    };
}

// 使用
// class MyClass {
//     @IsBetweenOneAndTen({ message: 'The number must be between 1 and 10' })
//     myNumber: number;
// }

// const myInstance = new MyClass();
// myInstance.myNumber = 11;

// validate(myInstance, { validateCustomDecorators: true }).then(errors => {
//     console.log(errors);
// });