import {
  useLocalStorage,
  unnest,
  SharedStateContext,
  useSharedState,
} from "../index";

it("exports useLocalStorage", () => {
  expect(useLocalStorage).toBeTruthy();
});

it("exports unnest", () => {
  expect(unnest).toBeTruthy();
});

it("exports SharedStateContext", () => {
  expect(SharedStateContext).toBeTruthy();
});

it("exports useSharedState", () => {
  expect(useSharedState).toBeTruthy();
});
