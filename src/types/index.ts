export enum events {
  TICK = "tick",
  START = "start",
  STOP = "stop",
}

export type EventTypes = events.START | events.STOP | events.TICK;

export enum status {
  WORKED = "worked",
  STOPPED = "stopped",
  PENDING = "pending"
}

export type StatusTypes = status.WORKED | status.PENDING | status.STOPPED;

export type TimerState = {
  status: StatusTypes
  range?: IMutableRange
}

export type EventTick = {
  type: events.TICK
  data: TimerData
}

export type EventStart = {
  type: events.START
  data: TimerState
}

export type EventStop = {
  type: events.STOP
  data: TimerState
}

export type EventTimer = EventTick | EventStart | EventStop;

export type EventCallback = (e: EventTimer) => void;

export type TimerData = {
  seconds: number
  minutes: number
  hours: number
  days: number
  months: number
  withZero: {
    seconds: string
    minutes: string
    hours: string
    days: string
    months: string
  }
  withCases: {
    seconds: string
    minutes: string
    hours: string
    days: string
    months: string
  }
}

export interface IRange {
  id?: any
  start: Date | number
  end: Date | number
}
export interface IMutableRange {
  id?: any
  start: Date
  end: Date
}