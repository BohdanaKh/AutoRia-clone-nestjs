// import { createPropertyDecorator } from '@nestjs/swagger/dist/decorators/helpers';
// import { SetMetadata } from '@nestjs/common';
// import * as Filter from "bad-words";
// import * as constants from 'constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { registerDecorator } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Filter = require('bad-words');

export default function IsNotProfanity(property: string) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isNotProfanity',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: '$not allowed word',
      },
      validator: {
        validate(value: any) {
          const filter = new Filter();
          if (!filter.isProfane(value)) {
            return value;
          }
        },
      },
    });
  };
}
