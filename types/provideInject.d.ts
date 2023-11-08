import type { InjectionKey, Ref } from 'vue';

export interface ThreadFilterValue {
  filter: Ref<string>;
}

export const threadFilterKey = Symbol() as InjectionKey<ThreadFilterValue>;
