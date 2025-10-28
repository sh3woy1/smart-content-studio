import React, { lazy, Suspense, ComponentType } from 'react';
import { LoadingScreen } from '../components/UI/LoadingScreen';

export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(factory);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingScreen />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}