import {
  renderHook,
  act,
  RenderHookResult,
  Renderer,
} from "@testing-library/react-hooks";
import LocalStorageMock from "../../mocks/LocalStorageMock";
import { SharedStateContext } from "../../context/SharedState";
import { useSharedState } from "../useSharedState";

describe("useSharedState", () => {
  let localStorage: LocalStorageMock;

  beforeEach(() => {
    localStorage = new LocalStorageMock();
    // @ts-ignore
    global.localStorage = localStorage;
    jest.useFakeTimers();
  });

  afterEach(() => {
    // @ts-ignore
    delete global.localStorage;
    jest.clearAllTimers();
  });

  let hook: RenderHookResult<
    {
      namespace: string;
      defaults: number;
    },
    [number, React.Dispatch<React.SetStateAction<number>>],
    Renderer<{
      namespace: string;
      defaults: number;
    }>
  >;

  const NAMESPACE = "foo";
  const DEFAULT = 5;

  describe("when mounted", () => {
    beforeEach(() => {
      hook = renderHook(
        ({ namespace, defaults }) =>
          useSharedState<number>(namespace, defaults),
        {
          wrapper: SharedStateContext,
          initialProps: {
            namespace: NAMESPACE,
            defaults: DEFAULT,
          },
        }
      );
    });

    it("returns default value unless stored", () => {
      expect(hook.result.current[0]).toEqual(5);
    });

    it("allows updating statically", () => {
      act(() => {
        hook.result.current[1](10);
      });

      expect(hook.result.current[0]).toEqual(10);
    });

    it("allows updating dynamically", () => {
      act(() => {
        hook.result.current[1]((n) => n + 10);
      });

      expect(hook.result.current[0]).toEqual(15);
    });
  });
});
