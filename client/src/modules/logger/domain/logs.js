import Vue from 'vue';
import HotCollection from '@joaomelo/hot-collection';
import moment from 'moment';
import { authSubject } from '__cli/core/auth';

const logsStore = {
  logsCollection: null,
  logs: [],
  userId: null
};
Vue.observable(logsStore);

authSubject.subscribe(({ user, status }) => {
  const logsCollection = (status === 'SIGNIN') ? createLogsCollection() : null;
  if (logsCollection) {
    logsCollection.subscribe(logs => {
      const filteredAndSortedLogs = logs
        .filter(log => log.userId === logsStore.userId)
        .sort((a, b) => b.when - a.when);
      logsStore.logs = filteredAndSortedLogs;
    });
  }

  logsStore.logsCollection = logsCollection;
  logsStore.userId = (status === 'SIGNIN') ? user.uid : null;
});

function createLogsCollection () {
  const logsCollection = new HotCollection('logs', {
    adapter: 'in-memory',
    converters: {
      fromDocToItem (doc) {
        const item = {
          ...doc,
          when: new Date(doc.when),
          prettyWhen: moment(doc.when).format('YY-MMM-DD HH:mm:ss')
        };
        return item;
      }
    }
  });
  return logsCollection;
}

function logThis (msg) {
  const item = {
    when: new Date(),
    userId: logsStore.userId,
    msg
  };
  return logsStore.logsCollection.add(item);
}

export { logsStore, logThis };
