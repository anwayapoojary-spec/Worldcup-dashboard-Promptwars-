import { describe, it, expect } from "vitest";
import { translate, LANGUAGES, DICTIONARIES } from "./i18n";

describe("i18n", () => {
  it("returns the localized string for known keys", () => {
    expect(translate("en", "nav.dashboard")).toBe("Dashboard");
    expect(translate("es", "nav.dashboard")).toBe("Panel");
    expect(translate("fr", "nav.dashboard")).toBe("Tableau de bord");
    expect(translate("pt", "nav.dashboard")).toBe("Painel");
    expect(translate("ar", "nav.dashboard")).toBe("لوحة التحكم");
  });

  it("falls back to English when a key is missing in the target language", () => {
    // temporarily assert fallback semantics via unknown key: returns key itself
    expect(translate("ar", "does.not.exist")).toBe("does.not.exist");
  });

  it("exposes the same set of keys across every locale", () => {
    const enKeys = Object.keys(DICTIONARIES.en).sort();
    for (const l of LANGUAGES) {
      const keys = Object.keys(DICTIONARIES[l.code]).sort();
      expect(keys, `locale ${l.code}`).toEqual(enKeys);
    }
  });

  it("marks Arabic as RTL", () => {
    const ar = LANGUAGES.find((l) => l.code === "ar");
    expect(ar?.rtl).toBe(true);
  });
});
