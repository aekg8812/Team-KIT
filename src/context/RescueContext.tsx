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
import { getKpiBase } from "@/lib/rescue/data";
import type {
  RescueStatus,
  RescueOfferType,
  KPI,
  UserRole,
} from "@/lib/rescue/types";

const SESSION_KEY = "rescue_demo_status";
const SESSION_KEY_OFFER = "rescue_demo_offer";
const SESSION_KEY_ROLE = "rescue_demo_role";
const SESSION_KEY_HIGHLIGHT = "rescue_demo_highlight_pending";
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

  useEffect(() => {
    const savedStatus = sessionStorage.getItem(SESSION_KEY);
    const savedOffer = sessionStorage.getItem(SESSION_KEY_OFFER);
    const savedRole = sessionStorage.getItem(SESSION_KEY_ROLE);
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
  }, []);

  const resetDemo = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY_OFFER);
    sessionStorage.removeItem(SESSION_KEY_ROLE);
    sessionStorage.removeItem(SESSION_KEY_HIGHLIGHT);
    setPendingHighlight(false);
    setRescueOfferTypeRaw("discount");
    setUserRole(null);
    setIsRoleSwitching(false);
    setRescueStatus("idle");
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
