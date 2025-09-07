import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContext {
  requestId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const injectRequestId = (log: any) => {
  const store = asyncLocalStorage.getStore();
  if (store?.requestId) log.requestId = store.requestId;
  return log;
};
