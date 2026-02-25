import { useCallback } from 'react';
import { useDietitianStore } from '@/stores';

export function useDietitian() {
  const store = useDietitianStore();

  const loadPairedDietitian = useCallback(async () => {
    await store.loadPairedDietitian();
  }, [store.loadPairedDietitian]);

  const requestPairing = useCallback(
    async (code: string) => {
      await store.requestPairing(code);
    },
    [store.requestPairing],
  );

  const unpair = useCallback(async () => {
    await store.unpair();
  }, [store.unpair]);

  const isPaired = store.pairedDietitian !== null;

  return {
    pairedDietitian: store.pairedDietitian,
    pairingCode: store.pairingCode,
    isPaired,
    loadPairedDietitian,
    setPairedDietitian: store.setPairedDietitian,
    requestPairing,
    unpair,
  };
}
