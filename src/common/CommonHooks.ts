import { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { useMediaQuery, useTheme } from '@mui/material';

export function useDebounce<Value>(value: Value, wait = 250) {
  const [debouncedValue, setDebouncedValue] = useState<Value>(value);
  const changeHandlerRef = useRef<ReturnType<(typeof _)['debounce']>>();

  useEffect(() => {
    changeHandlerRef.current = _.debounce(
      (newValue) => setDebouncedValue(newValue),
      wait,
    );

    return () => changeHandlerRef.current?.cancel();
  }, [wait]);

  useEffect(() => {
    changeHandlerRef.current?.(value);
  }, [value]);

  return debouncedValue;
}

export function useHasChanged<Val>(val: Val) {
  const [prevVal, setPrevVal] = useState(val);

  if (val !== prevVal) {
    setPrevVal(val);
    return true;
  }
}

export function useIsMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile;
}
