import { Props } from './props.js';
import { Empty } from './empty.js';
import { Advance } from './advance.js'
import { Primitive } from './primitive.js';
import { AssertError } from './AssertError.js';

export class Validate {

    /**
     *
     */
    constructor() {
        this._props = [];
        this._value = null;
        this._errors = {};
        this._hasErrors = false;
        this._currentProps = null;
        this._currentGetProps = null;
    }

    /**
     * Add key and create prop
     *
     * @param key
     * @returns {Validate}
     */
    addKey(key) {
        this._currentProps = new Props(key);
        this._props.push(this._currentProps);
        return this;
    }

    /**
     * Return specific props of key
     *
     * @param key
     * @returns {Props}
     */
    getKey(key) {
        for (let prop of this._props) {
            if(prop.getKey() === key) {
                this._currentGetProps = prop;
                break;
            }
        }
        return this._currentGetProps;
    }

    /**
     * Create one prop
     *
     * @param value
     * @returns {Validate}
     */
    ofValue(value) {
        this._value = value;
        this._currentProps = new Props([value]);
        return this;
    }

    /**
     * Check if the property is set
     *
     * @returns {Validate}
     */
    required() {
        this._currentProps.pushValidator('required', Empty.MESSAGES.isUndefined, Empty.isUndefined());
        return this;
    }

    /**
     * Check if the property is empty
     *
     * @returns {Validate}
     */
    notEmpty() {
        this._currentProps.pushValidator('isEmpty', Empty.MESSAGES.isEmpty, Empty.isEmpty());
        return this;
    }

    /**
     * Check if the property is numeric
     *
     * @returns {Validate}
     */
    isNumeric() {
        this._currentProps.pushValidator('isNumeric', Primitive.MESSAGES.isNumeric, Primitive.isNumeric());
        return this;
    }

    /**
     * Check if the property is string
     *
     * @returns {Validate}
     */
    isString() {
        this._currentProps.pushValidator('isString', Primitive.MESSAGES.isString, Primitive.isString());
        return this;
    }

    /**
     * Check if the property is boolean
     *
     * @returns {Validate}
     */
    isBoolean() {
        this._currentProps.pushValidator('isBoolean', Primitive.MESSAGES.isBoolean, Primitive.isBoolean());
        return this;
    }

    /**
     * Check if the property is object
     *
     * @returns {Validate}
     */
    isObject() {
        this._currentProps.pushValidator('isObject', Primitive.MESSAGES.isObject, Primitive.isObject());
        return this;
    }

    /**
     *
     *
     * @param prop
     * @returns {Validate}
     */
    objectHasProperty(prop) {
        this._currentProps.pushValidator('objectHasProperty', Primitive.MESSAGES.objectHasProperty, Primitive.objectHasProperty(prop));
        return this;
    }

    /**
     * Check if the property is email
     *
     * @returns {Validate}
     */
    isEmail() {
        this._currentProps.pushValidator('isEmail', Advance.MESSAGES.isEmail, Advance.isEmail());
        return this;
    }

    /**
     * Check if the property is max or min length
     *
     * @param options
     * @returns {Validate}
     */
    isLength(options) {
        this._currentProps.pushValidator('isLength', Advance.MESSAGES.isLength, Advance.isLength(options));
        return this;
    }

    /**
     *
     *
     * @returns {boolean}
     */
    hasErrors() {
        return this._hasErrors;
    }

    /**
     *
     *
     * @param data
     */
    assert(data) {
        this._props.forEach(prop => {
            prop.assertValidators(data);
            if(prop.hasErrors()) {
                this._hasErrors = true;
                this._errors[prop.getKey()] = prop.getErrorsValues();
            }
        });
        if(this._hasErrors) {
            throw new AssertError({
                message: 'Assert error',
                data: this._errors
            });
        }
    }

    /**
     *
     * @param data
     * @returns {Promise<void>}
     */
    asyncAssert(data) {
        return new Promise(resolve => {
            try {
                this.assert(data);
                resolve();
            } catch(error) {
                throw new AssertError({
                    message: 'Assert error',
                    data: this._errors
                });
            }
        });
    }

    /**
     *
     */
    assertOne() {
        this._currentProps.assertValidators({ [this._value]: this._value });
        if(this._currentProps.hasErrors()) {
            this._hasErrors = true;
            this._errors[this._currentProps.getKey()] = this._currentProps.getErrorsValues();
        }
        if(this._hasErrors) {
            throw new AssertError({
                message: 'Assert error',
                data: this._errors
            });
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    asyncAssertOne() {
        return new Promise(resolve => {
            try {
                this.assertOne();
                resolve();
            } catch (error) {
                throw new AssertError({
                    message: 'Assert error',
                    data: this._errors
                });
            }
        });
    }

}