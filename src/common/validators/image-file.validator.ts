// CUSTOM VALIDATOR FOR IMAGE FILES

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ImageExtFileValidation(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          const allowedExtensions = [ '.jpg', '.jpeg', '.png', '.webp' ]

          if (!Array.isArray(value)) return false;

          const extValidation = value.every(file => {
            const originalname = file?.originalname.toLowerCase()
            const arr = originalname.split('.');

            if(arr.length <= 1) return false

            const ext = '.' + arr[arr.length - 1]
            return typeof originalname === 'string' && allowedExtensions.includes(ext)
          });

          return extValidation;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of image files`;
        },
      },
    });
  };
}

export function ImageMimetypeFileValidation(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          const allowedMimetypes = [ 'image/jpg', 'image/jpeg', 'image/png', 'image/webp' ]

          if (!Array.isArray(value)) return false;

          const mimetypeValidation = value.every(file =>{
            const mimetype = file?.mimetype.toLowerCase()
            return typeof file?.originalname === 'string' && allowedMimetypes.includes(mimetype)
          });

          return mimetypeValidation
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of image files`;
        },
      },
    });
  };
}