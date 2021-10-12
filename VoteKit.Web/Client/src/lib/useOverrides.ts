import * as React from "react";

type UseOverridesMetadata = {
  isDirty: () => boolean
}

export function useOverrides<T>(
  base: T,
  dependencies: any[] = null
): [T, (payload: Partial<T>) => T, UseOverridesMetadata] {
  let [overrides, setOverrides] = React.useState<Partial<T>>({});

  React.useEffect(() => {
    setOverrides({});
  }, dependencies || [base]);

  return [
    { ...base, ...overrides } as T,

    (payload) => {
      if (payload == null) {
        setOverrides({});
        return base;
      }
    
      let candidateOverrides = { ...overrides, ...payload }
      let newOverrides = {} as Partial<T>;

      for (const key in candidateOverrides) {
        if (base[key] !== candidateOverrides[key])
          newOverrides[key] = candidateOverrides[key];
      }

      setOverrides(newOverrides)
      
      return { ...base, ...newOverrides }
    },

    {isDirty: () => !!Object.keys(overrides).length}
  ];
}
