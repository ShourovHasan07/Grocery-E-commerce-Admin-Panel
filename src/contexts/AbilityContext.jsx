'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { createContextualCan } from '@casl/react';
import { useSession } from 'next-auth/react';

import { createMongoAbility } from '@casl/ability';

import { defineAbilitiesFor } from '@/configs/acl';

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

export function AbilityProvider({ children }) {
  const { data: session, status } = useSession();
  const [ability, setAbility] = useState(() => createMongoAbility([]));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      
return;
    }

    if (status === 'authenticated' && session) {
      const userAbility = defineAbilitiesFor(session);

      setAbility(userAbility);
      setIsLoading(false);
    } else if (status === 'unauthenticated') {
      const guestAbility = createMongoAbility([]);

      setAbility(guestAbility);
      setIsLoading(false);
    }
  }, [session, status]);

  return (
    <AbilityContext.Provider value={{ ability, isLoading }}>
      {children}
    </AbilityContext.Provider>
  );
}

export const useAbility = () => {
  const context = useContext(AbilityContext);

  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider');
  }

  
return context.ability;
};

export const useAbilityLoading = () => {
  const context = useContext(AbilityContext);

  if (!context) {
    throw new Error('useAbilityLoading must be used within AbilityProvider');
  }

  
return context.isLoading;
};
