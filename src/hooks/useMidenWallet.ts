import { useCallback, useEffect, useState } from "react";
import { useMidenFiWallet } from "@miden-sdk/miden-wallet-adapter-react";
import {
  AllowedPrivateData,
  PrivateDataPermission,
  WalletAdapterNetwork,
  WalletReadyState,
} from "@miden-sdk/miden-wallet-adapter-base";
import { AccountId, Address } from "@miden-sdk/miden-sdk";

/**
 * Thin wrapper over the MidenFi wallet adapter for connect + canonical account id.
 *
 * The reclaim flow needs the connected account to (a) prove ownership of the
 * stuck note (its sender must equal this account) and (b) sign the consume
 * transaction that reclaims it. Asset listing is intentionally omitted — the
 * note's asset is read straight from the note itself (see `midenReclaim.ts`).
 */
export interface MidenWalletState {
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /** Raw wallet address string (may be bech32 / decorated). */
  address: string | null;
  /** Canonical account id as hex, once the SDK WASM can parse it. */
  accountIdHex: string | null;
}

/** Strip `miden:` prefix and `_BasicWallet`-style suffixes before parsing. */
function stripDecorators(raw: string): string {
  const trimmed = raw
    .replace(/\s+/g, "")
    .trim()
    .replace(/^miden:/i, "");
  const underscore = trimmed.indexOf("_");
  if (underscore > 0 && /^m/i.test(trimmed))
    return trimmed.slice(0, underscore);
  return trimmed;
}

/** Parse a Miden account id to canonical hex, or null when unrecognized. */
export function resolveAccountIdHex(raw: string | null): string | null {
  if (!raw) return null;
  const input = stripDecorators(raw);
  if (!input) return null;

  let id: AccountId | null = null;
  try {
    if (/^0x/i.test(input)) {
      id = AccountId.fromHex(input);
    } else if (/^[0-9a-fA-F]+$/.test(input) && input.length % 2 === 0) {
      id = AccountId.fromHex(`0x${input}`);
    }
  } catch {
    id = null;
  }

  if (!id) {
    try {
      id = Address.fromBech32(input).accountId();
    } catch {
      try {
        id = AccountId.fromBech32(input);
      } catch {
        id = null;
      }
    }
  }

  if (!id) return null;
  try {
    return id.toString();
  } catch {
    return null;
  }
}

export function useMidenWallet(): MidenWalletState {
  const {
    connected,
    connect: adapterConnect,
    disconnect: adapterDisconnect,
    address,
    select,
    wallet,
    wallets,
  } = useMidenFiWallet();

  const [accountIdHex, setAccountIdHex] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // AccountId parsing touches WASM and can fail on first render; retry once the
  // SDK is ready, keeping the raw id as a fallback in the meantime.
  useEffect(() => {
    const trimmed = address?.trim() ?? "";
    if (!trimmed) {
      setAccountIdHex(null);
      return;
    }

    const parsed = resolveAccountIdHex(trimmed);
    setAccountIdHex(parsed ?? (connected ? trimmed : null));
    if (parsed) return;

    let cancelled = false;
    void import("@miden-sdk/miden-sdk")
      .then(({ MidenClient }) => MidenClient.ready())
      .then(() => {
        if (cancelled) return;
        const retry = resolveAccountIdHex(trimmed);
        if (retry) setAccountIdHex(retry);
      })
      .catch(() => {
        /* keep the raw fallback when WASM never becomes available */
      });

    return () => {
      cancelled = true;
    };
  }, [address, connected]);

  const connect = useCallback(async () => {
    if (connected) return;
    setConnecting(true);
    try {
      // MidenFiSignerProvider auto-selects a single wallet on the next render,
      // but connect() throws WalletNotSelectedError if called before that lands.
      // Connect through the adapter directly when the context wallet isn't ready.
      const target = wallet ?? wallets[0] ?? null;
      if (!target) throw new Error("No Miden wallet adapter available");
      if (!wallet) select(target.adapter.name);

      if (
        target.readyState === WalletReadyState.Installed ||
        target.readyState === WalletReadyState.Loadable
      ) {
        await target.adapter.connect(
          PrivateDataPermission.UponRequest,
          WalletAdapterNetwork.Testnet,
          AllowedPrivateData.Assets,
        );
      } else {
        await adapterConnect();
      }
    } finally {
      setConnecting(false);
    }
  }, [connected, adapterConnect, wallet, wallets, select]);

  const disconnect = useCallback(async () => {
    try {
      await adapterDisconnect();
    } catch {
      /* ignore */
    }
  }, [adapterDisconnect]);

  return { connected, connecting, connect, disconnect, address, accountIdHex };
}
