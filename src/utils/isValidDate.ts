import toDate from './toDate';

/* функция возвращает true в случае аргумента в виде объекта Date или числа, иначе false */
function isValidDate(arg: any): boolean{
  return !isNaN(toDate(arg) as any);
}

export default isValidDate;