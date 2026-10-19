/* eslint-disable @typescript-eslint/no-unused-vars */
// Task 02: Mini functional–utility library
// All helpers are declared but not implemented.

export function mapArray<T, R>(
  source: readonly T[], 
  mapper: (item: T, index: number) => R
): R[] {
  if(source == null) throw new Error('source mustnt be  null of undefined');

  const result: R[] = [];
  let index = 0;
  for(const item of source){
    result.push(mapper(item, index));
    index++;
  }
  return result;
}



export function filterArray<T>(
  source: readonly T[], 
  predicate: (item: T, index: number) => boolean
): T[] {
  if(source == null)throw new Error('source mustnt be  null of undefined');

  const res: T[] = [];
  let index = 0;
  for(const item of source){
    if(predicate(item, index)){
      res.push(item)
    };
    index++;
  }
  return res;
}

/*
const words = ['apple', 'cat', 'banana', 'dog', 'elephant'];
const result = filterArray(words, (item) => {
    return item.length === 3;
});
*/



export function reduceArray<T, R>(
  source: readonly T[], 
  reducer: (acc: R, item: T, index: number) => R, initial: R
): R {
  if(source == null)throw new Error('source cant be null or undefined');

  let acc: R = initial;
  let index = 0;
  for(const item of source){
    acc = reducer(acc, item, index);
    index++;
  }
  return acc;
}

/*const nums = [1,2,3,4,5,6,7,8];
const res = reduceArray(nums, (acc, item) => {
  return acc + item;
}, 0);

console.log(res) */



export function partition<T>(
  source: readonly T[], 
  predicate: (item: T) => boolean
): [T[], T[]] {
  if(source == null)throw new Error('partition: not implemented');

  const res: [T[], T[]] = [[], []];
  for(const item of source){
    if(predicate(item)){
      res[0].push(item);
    } else{
      res[1].push(item)
    }
  }
  return res;
}

/*
const nums = [1,2,3,4,5,6,7,8,9];
const res = partition(nums, (item) => {
  item % 3 === 0  
});

console.log(res)
*/


export function groupBy<T, K extends PropertyKey>(
  source: readonly T[], 
  keySelector: (item: T) => K
): Record<K, T[]> {
  if(source == null)throw new Error('groupBy: not implemented');

  const acc = {} as Record<K, T[]>;
  for(const item of source){
    const key = (keySelector(item));

    if(!acc[key]){
      acc[key] = [];
    }
    acc[key].push(item)
  }
  return acc;
}

/*const res = groupBy([
  { id: 1, tag: 'home' },
  { id: 2, tag: 'work' },
  { id: 3, tag: 'home' }
], t => t.tag);
console.log(res)
*/
