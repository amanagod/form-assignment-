import { MOBILITY } from './schema';

/** 'bedbound' -> 'Bedbound', 'home_visit' -> 'Home visit'. */
const toLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/^./, (first) => first.toUpperCase());

export const MOBILITY_OPTIONS = MOBILITY.map((value) => ({ value, label: toLabel(value) }));
