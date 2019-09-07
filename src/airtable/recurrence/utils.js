import { calcJobRecurrence } from './recurrence';

export {
  jobRecurrences,
  isRecurrent,
  isFlat,
  createChildrenUniqueDistinctTitles,
  convertToDistinctTitle,
  hasRecurringAscendency
};

const jobRecurrences = {
  ephemeral: '🧿',
  process: '⚙️',
  task: '👩‍🏭',
  flat: '⏱️',
  copy: '📃'
};

function createChildrenUniqueDistinctTitles(job, snapshot) {
  const distinctTitles = snapshot
    .getChildJobs(job)
    .map(child => convertToDistinctTitle(child.title.trim(), '*'));
  const uniqueTitles = Array.from(new Set(distinctTitles));
  return uniqueTitles;
}

function convertToDistinctTitle(title, substr) {
  const pos = title.indexOf(substr);
  return pos == -1 ? title : title.substring(0, pos);
}

function hasRecurringAscendency(job, snapshot) {
  const ascendency = snapshot.getAscendency(job);
  let hasRecurring = false;
  ascendency.forEach(a => {
    hasRecurring = hasRecurring || a.frequency;
  });
  return hasRecurring;
}

function isRecurrent(job, snapshot) {
  const recurrents = [jobRecurrences.process, jobRecurrences.flat];
  return recurrents.includes(calcJobRecurrence(job, snapshot));
}

function isFlat(job, snapshot) {
  return calcJobRecurrence(job, snapshot) === jobRecurrences.flat;
}