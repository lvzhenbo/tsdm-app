import type { InjectionKey, Ref } from 'vue';

export interface ThreadFilterValue {
  filter: Ref<string>;
}

export interface AutoSignInValue {
  autoSignIn: Ref<boolean>;
}

export const threadFilterKey = Symbol() as InjectionKey<ThreadFilterValue>;
export const autoSignInKey = Symbol() as InjectionKey<AutoSignInValue>;
