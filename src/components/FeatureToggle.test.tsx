// // @vitest-environment jsdom
// import { describe, expect, it } from "vitest";
// import { createRoot } from "react-dom/client";
// import { act } from "react";
// import { FeatureToggle } from "./FeatureToggle";
// import { FeatureToggleContext } from "../context/FeatureToggleContext";
// import { useFeatureToggle } from "../hooks/UseFeatureToggle";

// (
//   globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
// ).IS_REACT_ACT_ENVIRONMENT = true;

// describe("FeatureToggle", () => {
//   it("renders children when feature is enabled", () => {
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     act(() => {
//       createRoot(container).render(
//         <FeatureToggleContext.Provider
//           value={{ enabledFeatures: ["beta-feature"] }}
//         >
//           <FeatureToggle feature="beta-feature">
//             <span data-testid="content">Feature Active</span>
//           </FeatureToggle>
//         </FeatureToggleContext.Provider>,
//       );
//     });

//     expect(
//       container.querySelector('[data-testid="content"]')?.textContent,
//     ).toBe("Feature Active");
//   });

//   it("renders nothing when feature is not enabled and no fallback provided", () => {
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     act(() => {
//       createRoot(container).render(
//         <FeatureToggleContext.Provider value={{ enabledFeatures: [] }}>
//           <FeatureToggle feature="beta-feature">
//             <span data-testid="content">Feature Active</span>
//           </FeatureToggle>
//         </FeatureToggleContext.Provider>,
//       );
//     });

//     expect(container.querySelector('[data-testid="content"]')).toBeNull();
//   });

//   it("renders fallback when feature is not enabled", () => {
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     act(() => {
//       createRoot(container).render(
//         <FeatureToggleContext.Provider value={{ enabledFeatures: [] }}>
//           <FeatureToggle
//             feature="beta-feature"
//             fallback={<span data-testid="fallback">Feature Disabled</span>}
//           >
//             <span data-testid="content">Feature Active</span>
//           </FeatureToggle>
//         </FeatureToggleContext.Provider>,
//       );
//     });

//     expect(
//       container.querySelector('[data-testid="fallback"]')?.textContent,
//     ).toBe("Feature Disabled");
//     expect(container.querySelector('[data-testid="content"]')).toBeNull();
//   });
// });

// describe("useFeatureToggle", () => {
//   it("returns isEnabled function checking features", () => {
//     let isEnabledFn: ((feature: string) => boolean) | null = null;

//     function TestComponent() {
//       const [isEnabled] = useFeatureToggle();
//       isEnabledFn = isEnabled;
//       return null;
//     }

//     const container = document.createElement("div");
//     act(() => {
//       createRoot(container).render(
//         <FeatureToggleContext.Provider
//           value={{ enabledFeatures: ["feature-a", "feature-b"] }}
//         >
//           <TestComponent />
//         </FeatureToggleContext.Provider>,
//       );
//     });

//     expect(isEnabledFn).not.toBeNull();
//     expect(isEnabledFn!("feature-a")).toBe(true);
//     expect(isEnabledFn!("feature-b")).toBe(true);
//     expect(isEnabledFn!("feature-c")).toBe(false);
//   });
// });
