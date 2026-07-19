import { describe, it, expect, beforeEach } from "vitest";
import { act, render, renderHook } from "@testing-library/react";
import { PrefsProvider, usePrefs, ROLE_NAV } from "./prefs";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <PrefsProvider>{children}</PrefsProvider>;
}

describe("PrefsProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "";
  });

  it("provides sensible defaults", () => {
    const { result } = renderHook(() => usePrefs(), { wrapper });
    expect(result.current.role).toBe("organizer");
    expect(result.current.lang).toBe("en");
    expect(result.current.a11y).toEqual({
      highContrast: false,
      largeText: false,
      reduceMotion: false,
    });
  });

  it("updates role, language, and a11y toggles", () => {
    const { result } = renderHook(() => usePrefs(), { wrapper });
    act(() => result.current.setRole("security"));
    act(() => result.current.setLang("ar"));
    act(() => result.current.setA11y({ highContrast: true }));
    expect(result.current.role).toBe("security");
    expect(result.current.lang).toBe("ar");
    expect(result.current.isRTL).toBe(true);
    expect(result.current.a11y.highContrast).toBe(true);
  });

  it("translates via the active language", () => {
    const { result } = renderHook(() => usePrefs(), { wrapper });
    act(() => result.current.setLang("es"));
    expect(result.current.t("nav.settings")).toBe("Ajustes");
  });

  it("applies dir=rtl on the html element for Arabic", () => {
    const { result } = renderHook(() => usePrefs(), { wrapper });
    act(() => result.current.setLang("ar"));
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(document.documentElement.getAttribute("lang")).toBe("ar");
  });

  it("throws when usePrefs is called outside its provider", () => {
    // suppress React error output for the expected throw
    const spy = () => renderHook(() => usePrefs());
    expect(spy).toThrow(/PrefsProvider/);
  });

  it("gates navigation per role", () => {
    expect(ROLE_NAV.fan).toContain("/emergency");
    expect(ROLE_NAV.fan).not.toContain("/operations");
    expect(ROLE_NAV.admin.length).toBeGreaterThan(ROLE_NAV.fan.length);
  });
});

describe("PrefsProvider render", () => {
  it("renders children", () => {
    const { getByText } = render(
      <PrefsProvider>
        <span>hello</span>
      </PrefsProvider>,
    );
    expect(getByText("hello")).toBeInTheDocument();
  });
});
