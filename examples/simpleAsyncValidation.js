import { Validate } from '../index.js';

const name = 'Giovane';
const prop = new Validate();
prop.ofValue(name)
    .isString()
    .isLength({ min: 1, max: 7 })
    .asyncAssertOne()
    .then(() => {
        console.log('valid');
    })
    .catch(errors => {
        console.error('errors', errors.data);
    });