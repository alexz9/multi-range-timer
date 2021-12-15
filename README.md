# multi-range-timer
Multi-range timer with subscribe to events

Позволяет задать массив диапазонов работы таймера и получать события обновления оставшегося времени по каждому. 

Решает бизнес-задачу: *последовательное предоставление различных акционных предложений на сайте в рамках определенного периода с выводом оставшегося времени до окончания.* 

## Установка

The package can be installed via [npm](https://github.com/npm/cli):

```
npm install multi-range-timer --save
```
## Использование

1) Импортируем класс MultiTimer.
2) Создаем экземпляр с указанием диапазонов.
3) Подписываемся на события.
4) Запускаем таймер.

Пример на React:

```js
import React, { useEffect, useState } from "react";
import MultiTimer from "multi-range-timer";

const Banner = () => {
  const [timerFace, setTimerFace] = useState("");
  const [hasTimer, setHasTimer] = useState(false);
  
  useEffect(() => {
    const ranges = [
      {
        start: new Date(2022, 1, 1),
        end: new Date(2022, 1, 7)
      }, {
        start: new Date(2022, 1, 10),
        end: new Date(2022, 1, 13)
      }
    ];
    const timer = new MultiTimer(ranges);
    timer.subscribe(e => {     
      switch (e.type) {
        case "tick": 
          setTimerFace(`
            ${e.data.withCases.days} 
            ${e.data.withZero.hours}:${e.data.withZero.minutes}:${e.data.withZero.seconds}
          `);
          break;
        case "start":
          setHasTimer(true);
          break;       
        case "stop":       
          setHasTimer(false);
          break;
        default:
          break;
      }
    });

    timer.start();
    return () => timer.stop();
  }, [])
  
  return hasTimer ? timerFace : null;
}

```

### Параметры для конструктора

Принимает массив диапазонов - объект, у которого должно быть два обязательных свойства:

|Prop|Type|Description|
|----|----|----|
|start|Date \| Number(unixtime ms)| Старт таймера |
|end|Date \| Number(unixtime ms)| Время окончания |

- Для более удобного использования можно добавить уникальный id, но это необязательно. 
- Порядок неважен, так как массив будет отсортирован по возрастанию даты старта.
- Диапазоны отрабатывают по очереди. 
- Если между концом последнего активного и началом следующего есть зазор во времени, отработает событие «stop» со статусом «pending».

### Методы и свойства

Экземпляр класса MultiTimer содержит:

|Name|Description|
|----|----|
|start|Запускает таймер и генерирует событие «start»|
|stop|Останавливает таймер и генерирует событие «stop»|
|subscribe|В качестве параметров передать функцию обработчик событий, которая будет принимать event|
|unsubscribe|Нужно передать тот же обработчик, что был указан для subscribe|
|----|----|
|status|Статус таймера, возможны значения «worked» - работает, «stopped» - отстановлен, «pending» - остановлен, но запустится как только текущее время будет соответствовать времени старта ближайшего диапазона|
|range|Активный диапазон из переданных при инициализации конструктора, у остановленного таймера не передается|

### События

Функция обработчик принимает один аргумент event - это объект с двумя свойствами: type и data.

Type может иметь следующие значения:

|Type|Data|Description|
|----|----|----|
|start|State|Срабатывает сразу после запуска|
|stop|State|Сигнализирует об остановке таймера|
|tick|Time|Срабатывает каждый раз при обновлении времени (раз в секунду)|

State - содержит статус таймера и активный диапазон.
Time - объект, который содержит удобно представленные данные об оставшемся времени из активного диапазона.

Пример:
```js
// State
{
  status: "worked",
  range: {
    id: 2,
    start: Date,
    end: Date
  }
}

// Time
{
  seconds: 1,
  minutes: 22,
  hours: 5,
  days: 1,
  months: 0,
  withZero: {
    seconds: "01",
    minutes: "22",
    hours: "05",
    days: "01",
    months: "00"
  },
  withCases: {
    seconds: "1 секунда",
    minutes: "22 минуты",
    hours: "5 часов",
    days: "1 день",
    months: "0 месяцев"
  }
}
```

## License

The MIT License.
