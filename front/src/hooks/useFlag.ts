import { useRef, useState } from 'react';

export function useFlag(initValue: boolean = false) {
  const [flag, setFlag] = useState(initValue);

  const api = useRef({
    up: () => setFlag(true),
    down: () => setFlag(false),
    toggle: () => setFlag((fl) => !fl),
  });

  return {
    flag,
    ...api.current,
  };
}
