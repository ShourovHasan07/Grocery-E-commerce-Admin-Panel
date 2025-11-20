'use client';

import { useEffect, useMemo } from 'react';
import { useAbility, useAbilityLoading } from '@/contexts/AbilityContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

const ProtectedRouteURL = ({ actions = [], subject, children }) => {
  const ability = useAbility();
  const isLoading = useAbilityLoading();
  const router = useRouter();

  // Memoized permission check (Performance Boost)
  const hasPermission = useMemo(() => {
    return actions.some(action => ability.can(action, subject));
  }, [actions, subject, ability]);

  // Redirect only when permission resolved & invalid
  useEffect(() => {
    if (!isLoading && !hasPermission) {
      router.replace('/not-found');
    }
  }, [isLoading, hasPermission, router]);

  //  Full screen loading
  if (isLoading) return <Loader fullPage />;

  //  No permission = don't render children
  if (!hasPermission) return null;

  return children;
};

export default ProtectedRouteURL;
