"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { calcKPIs } from "@/lib/rescue/kpi";
import { getKpiBase, DEMO_SLOT } from "@/lib/rescue/data";
import { parseStoreCsv } from "@/lib/rescue/csv";
import { calcRescuePrice } from "@/lib/rescue/pricing";
import type {
  RescueStatus,
  RescueOfferType,
  KPI,
  UserRole,
  CsvSlot,
  CsvListingStatus,
  ManualCancellationInput,
} from "@/lib/rescue/types";

const SESSION_KEY = "rescue_demo_status";
const SESSION_KEY_OFFER = "rescue_demo_offer";
const SESSION_KEY_ROLE = "rescue_demo_role";
const SESSION_KEY_HIGHLIGHT = "rescue_demo_highlight_pending";
const SESSION_KEY_CSV = "rescue_demo_csv_slots";
const SESSION_KEY_CSV_STATUS = "rescue_demo_csv_listing_status";
const SESSION_KEY_CSV_LAST_RESERVED = "rescue_demo_csv_last_reserved";
const VALID_STATUSES: RescueStatus[] = [
  "idle",
  "cancelled",
  "listed",
  "reserved",
];

type RescueContextValue = {
  hydrated: boolean;
  rescueStatus: RescueStatus;
  rescueOfferType: RescueOfferType;
  userRole: UserRole | null;
  isRoleSwitching: boolean;
  kpi: KPI;
  pendingHighlight: boolean;
  consumeHighlight: () => void;
  startCancel: () => void;
  startRescue: () => void;
  completeReservation: () => void;
  resetDemo: () => void;
  selectRole: (role: UserRole) => void;
  beginRoleSwitch: (role: UserRole) => void;
  finishRoleSwitch: () => void;
  setRescueOfferType: (type: RescueOfferType) => void;
  csvSlots: CsvSlot[];
  loadCsvSlots: (
    csvText: string,
  ) =>
    | { ok: true; count: number; slots: CsvSlot[] }
    | { ok: false; count: 0; error: string };
  csvListingStatus: Record<string, CsvListingStatus>;
  queueDemoCancellations: (slots: CsvSlot[]) => void;
  publishCsvListing: (id: string) => void;
  reserveCsvListing: (id: string) => void;
  addManualCancellation: (input: ManualCancellationInput) => void;
  lastReservedCsvId: string | null;
};

const RescueContext = createContext<RescueContextValue | null>(null);

export function RescueProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [rescueStatus, setRescueStatus] = useState<RescueStatus>("idle");
  const [rescueOfferType, setRescueOfferTypeRaw] =
    useState<RescueOfferType>("discount");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);
  const [pendingHighlight, setPendingHighlight] = useState(false);
  const [csvSlots, setCsvSlots] = useState<CsvSlot[]>([]);
  const [csvListingStatus, setCsvListingStatus] = useState<
    Record<string, CsvListingStatus>
  >({});
  const [lastReservedCsvId, setLastReservedCsvId] = useState<string | null>(null);

  useEffect(() => {
    const savedStatus = sessionStorage.getItem(SESSION_KEY);
    const savedOffer = sessionStorage.getItem(SESSION_KEY_OFFER);
    const savedRole = sessionStorage.getItem(SESSION_KEY_ROLE);
    const savedCsv = sessionStorage.getItem(SESSION_KEY_CSV);
    const savedCsvStatus = sessionStorage.getItem(SESSION_KEY_CSV_STATUS);
    const savedLastReserved = sessionStorage.getItem(SESSION_KEY_CSV_LAST_RESERVED);
    const frame = requestAnimationFrame(() => {
      setRescueStatus(
        savedStatus && VALID_STATUSES.includes(savedStatus as RescueStatus)
          ? (savedStatus as RescueStatus)
          : "idle",
      );
      setRescueOfferTypeRaw(savedOffer === "perk" ? "perk" : "discount");
      setUserRole(
        savedRole === "customer" || savedRole === "restaurant"
          ? savedRole
          : null,
      );
      setPendingHighlight(
        sessionStorage.getItem(SESSION_KEY_HIGHLIGHT) === "true",
      );
      if (savedCsv) {
        try {
          setCsvSlots(JSON.parse(savedCsv));
        } catch {
          sessionStorage.removeItem(SESSION_KEY_CSV);
        }
      }
      if (savedCsvStatus) {
        try {
          setCsvListingStatus(JSON.parse(savedCsvStatus));
        } catch {
          sessionStorage.removeItem(SESSION_KEY_CSV_STATUS);
        }
      }
      if (savedLastReserved) setLastReservedCsvId(savedLastReserved);
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const startCancel = useCallback(() => {
    setRescueStatus((prev) => {
      if (prev !== "idle") return prev;
      sessionStorage.setItem(SESSION_KEY, "cancelled");
      return "cancelled";
    });
  }, []);

  const startRescue = useCallback(() => {
    setRescueStatus((prev) => {
      if (prev !== "cancelled") return prev;
      sessionStorage.setItem(SESSION_KEY, "listed");
      return "listed";
    });
  }, []);

  const completeReservation = useCallback(() => {
    setRescueStatus((prev) => {
      if (prev !== "listed") return prev;
      sessionStorage.setItem(SESSION_KEY, "reserved");
      return "reserved";
    });
    sessionStorage.setItem(SESSION_KEY_HIGHLIGHT, "true");
    setPendingHighlight(true);
    // Clear any earlier CSV reservation pointer so this fresh DEMO_SLOT booking is
    // the one /customer/reservation-complete shows, not a stale one from earlier
    // in the session (both "reserved" flags persist until Reset Demo).
    sessionStorage.removeItem(SESSION_KEY_CSV_LAST_RESERVED);
    setLastReservedCsvId(null);
  }, []);

  const resetDemo = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY_OFFER);
    sessionStorage.removeItem(SESSION_KEY_ROLE);
    sessionStorage.removeItem(SESSION_KEY_HIGHLIGHT);
    sessionStorage.removeItem(SESSION_KEY_CSV);
    sessionStorage.removeItem(SESSION_KEY_CSV_STATUS);
    sessionStorage.removeItem(SESSION_KEY_CSV_LAST_RESERVED);
    setPendingHighlight(false);
    setRescueOfferTypeRaw("discount");
    setUserRole(null);
    setIsRoleSwitching(false);
    setRescueStatus("idle");
    setCsvSlots([]);
    setCsvListingStatus({});
    setLastReservedCsvId(null);
  }, []);

  const consumeHighlight = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY_HIGHLIGHT);
    setPendingHighlight(false);
  }, []);

  const selectRole = useCallback((role: UserRole) => {
    sessionStorage.setItem(SESSION_KEY_ROLE, role);
    setUserRole(role);
  }, []);

  const beginRoleSwitch = useCallback((role: UserRole) => {
    sessionStorage.setItem(SESSION_KEY_ROLE, role);
    setIsRoleSwitching(true);
    setUserRole(role);
  }, []);

  const finishRoleSwitch = useCallback(() => {
    setIsRoleSwitching(false);
  }, []);

  const setRescueOfferType = useCallback((type: RescueOfferType) => {
    sessionStorage.setItem(SESSION_KEY_OFFER, type);
    setRescueOfferTypeRaw(type);
  }, []);

  const loadCsvSlots = useCallback((csvText: string) => {
    const { slots, errors } = parseStoreCsv(csvText);
    if (slots.length === 0) {
      return {
        ok: false as const,
        count: 0 as const,
        error: errors[0] ?? "有効なデータが見つかりませんでした",
      };
    }
    sessionStorage.setItem(SESSION_KEY_CSV, JSON.stringify(slots));
    sessionStorage.removeItem(SESSION_KEY_CSV_STATUS);
    setCsvSlots(slots);
    setCsvListingStatus({});
    return { ok: true as const, count: slots.length, slots };
  }, []);

  // Takes an explicit slot list (rather than reading csvSlots state) so a caller that
  // just called loadCsvSlots() in the same handler queues the fresh slots, not a stale
  // pre-update closure value.
  const queueDemoCancellations = useCallback((slots: CsvSlot[]) => {
    setCsvListingStatus((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const slot of slots) {
        if (!next[slot.id]) {
          next[slot.id] = "pending";
          changed = true;
        }
      }
      if (!changed) return prev;
      sessionStorage.setItem(SESSION_KEY_CSV_STATUS, JSON.stringify(next));
      return next;
    });
  }, []);

  const publishCsvListing = useCallback((id: string) => {
    setCsvListingStatus((prev) => {
      if (prev[id] !== "pending") return prev;
      const next = { ...prev, [id]: "listed" as CsvListingStatus };
      sessionStorage.setItem(SESSION_KEY_CSV_STATUS, JSON.stringify(next));
      return next;
    });
  }, []);

  const reserveCsvListing = useCallback((id: string) => {
    setCsvListingStatus((prev) => {
      if (prev[id] !== "listed") return prev;
      const next = { ...prev, [id]: "reserved" as CsvListingStatus };
      sessionStorage.setItem(SESSION_KEY_CSV_STATUS, JSON.stringify(next));
      return next;
    });
    sessionStorage.setItem(SESSION_KEY_CSV_LAST_RESERVED, id);
    setLastReservedCsvId(id);
  }, []);

  // Restaurant's manual "quick add" form: only name + price are required, everything
  // else defaults, and pricing is auto-computed — the result still lands as a normal
  // pending card the restaurant must review and click 出品する on before it's public.
  const addManualCancellation = useCallback((input: ManualCancellationInput) => {
    const minutesUntil = input.minutesUntil ?? 60;
    const { rescuePrice, discountRate } = calcRescuePrice(input.originalPrice, minutesUntil);
    const id = `manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slot: CsvSlot = {
      id,
      restaurantName: DEMO_SLOT.restaurantName,
      category: input.category || "おまかせコース",
      description: "",
      comment: "",
      location: "",
      date: "本日",
      time: input.time || "19:00",
      guests: input.guests ?? 2,
      originalPrice: input.originalPrice,
      rescuePrice,
      discountRate,
      minutesUntil,
      offerType: "discount",
      perkDescription: "",
    };
    setCsvSlots((prev) => {
      const next = [...prev, slot];
      sessionStorage.setItem(SESSION_KEY_CSV, JSON.stringify(next));
      return next;
    });
    setCsvListingStatus((prev) => {
      const next = { ...prev, [id]: "pending" as CsvListingStatus };
      sessionStorage.setItem(SESSION_KEY_CSV_STATUS, JSON.stringify(next));
      return next;
    });
  }, []);

  const kpi = calcKPIs(getKpiBase(rescueStatus, rescueOfferType));

  return (
    <RescueContext.Provider
      value={{
        hydrated,
        rescueStatus,
        rescueOfferType,
        userRole,
        isRoleSwitching,
        kpi,
        pendingHighlight,
        consumeHighlight,
        startCancel,
        startRescue,
        completeReservation,
        resetDemo,
        selectRole,
        beginRoleSwitch,
        finishRoleSwitch,
        setRescueOfferType,
        csvSlots,
        loadCsvSlots,
        csvListingStatus,
        queueDemoCancellations,
        publishCsvListing,
        reserveCsvListing,
        addManualCancellation,
        lastReservedCsvId,
      }}
    >
      {children}
    </RescueContext.Provider>
  );
}

export function useRescue(): RescueContextValue {
  const context = useContext(RescueContext);
  if (!context) {
    throw new Error('useRescue must be used within RescueProvider');
  }
  return context;
}
