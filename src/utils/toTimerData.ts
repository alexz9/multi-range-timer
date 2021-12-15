function getCase(prop: string, value: number) {
  const cases: any = {
    seconds: ["секунда", "секунды", "секунд"],
    minutes: ["минута", "минуты", "минут"],
    hours: ["час", "часа", "часов"],
    days: ["день", "дня", "дней"],
    months: ["месяц", "месяца", "месяцев"]
  };

  const last = value % 10;
  const doz = Math.floor((value % 100) / 10);

  if (last === 1 && doz !== 1) {
    return cases[prop][0];
  }
  if (last > 1 && last < 5 && doz !== 1) {
    return cases[prop][1];
  }
  return cases[prop][2];
}

export default function toTimerData(range: any): any {
  const now = new Date();
  const diff = range.end.getTime() - now.getTime();
  const dateDiff = new Date(diff);

  const seconds: number = dateDiff.getUTCSeconds();
  const minutes: number = dateDiff.getUTCMinutes();
  const hours: number = dateDiff.getUTCHours();
  const days: number = dateDiff.getUTCDate() - 1;
  const months: number = dateDiff.getUTCMonth();

  const withZero: { [key: string]: any } = {
    seconds,
    minutes,
    hours,
    days,
    months
  };
  const withCases = { ...withZero };

  for (let key in withZero) {
    if (withZero[key] < 10) {
      withZero[key] = `0${withZero[key]}`;
    } else {
      withZero[key] = String(withZero[key]);
    }
  }
  for (let key in withCases) {
    withCases[key] = `${withCases[key]} ${getCase(key, withCases[key])}`;
  }

  return {
    seconds,
    minutes,
    hours,
    days,
    months,
    withZero,
    withCases
  };
}