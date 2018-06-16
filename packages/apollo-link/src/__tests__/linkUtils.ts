import { validateOperation, fromPromise, makePromise } from '../linkUtils';
import { Observable, of } from 'rxjs';

describe('Link utilities:', () => {
  describe('validateOperation', () => {
    it('should throw when invalid field in operation', () => {
      expect(() => validateOperation(<any>{ qwerty: '' })).toThrow();
    });

    it('should not throw when valid fields in operation', () => {
      expect(() =>
        validateOperation({
          query: '1234',
          context: {},
          variables: {},
        }),
      ).not.toThrow();
    });
  });

  describe('makePromise', () => {
    const data = {
      data: {
        hello: 'world',
      },
    };
    const error = new Error('I always error');

    it('return next call as Promise resolution', () => {
      return makePromise(of(data)).then(result => expect(data).toEqual(result));
    });

    it('return error call as Promise rejection', () => {
      return makePromise(new Observable(observer => observer.error(error)))
        .then(expect.fail)
        .catch(actualError => expect(error).toEqual(actualError));
    });
  });
  describe('fromPromise', () => {
    const data = {
      data: {
        hello: 'world',
      },
    };
    const error = new Error('I always error');

    it('return next call as Promise resolution', () => {
      const observable = fromPromise(Promise.resolve(data));
      return makePromise(observable).then(result =>
        expect(data).toEqual(result),
      );
    });

    it('return Promise rejection as error call', () => {
      const observable = fromPromise(Promise.reject(error));
      return makePromise(observable)
        .then(expect.fail)
        .catch(actualError => expect(error).toEqual(actualError));
    });
  });
});
