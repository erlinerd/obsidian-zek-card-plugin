import { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S
) => {
    const store = _store as unknown as WithSelectors<typeof _store>;
    store.use = {} as Record<string, () => unknown>;
    const keys = Object.keys(store.getState());
    for (const k of keys) {
        store.use[k] = () => store((s) => (s as Record<string, unknown>)[k]);
    }

	return store;
};
