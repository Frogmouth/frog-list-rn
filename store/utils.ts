import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

let debounceTimers: { [key: string]: NodeJS.Timeout } = {};

const abortDebounce = (uuid:string) => {
  if (typeof debounceTimers[uuid] !== 'undefined') clearTimeout(debounceTimers[uuid]);
  delete debounceTimers[uuid];
}

export const debounce = (func:Function, delay:number) => {
  const uuid = uuidv4();
  return {
    exec: (...args:any) => {
      clearTimeout(debounceTimers[uuid]);

      debounceTimers[uuid] = setTimeout(() => {
        delete debounceTimers[uuid];
        func.apply(this, args);
      }, delay);
    },
    abort: () => {
      abortDebounce(uuid);
    }
  };
};