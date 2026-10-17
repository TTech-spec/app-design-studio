import * as React from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

// Scale factor (never above 1) that fits a fixed width x height design inside the window,
// plus the window size in the design's (unscaled) pixels.
export function useFitScale(width: number, height: number) {
  const [fit, setFit] = React.useState({ scale: 1, viewportWidth: width, viewportHeight: height });

  useIsomorphicLayoutEffect(() => {
    const onResize = () => {
      const scale = Math.min(1, window.innerWidth / width, window.innerHeight / height);
      setFit({
        scale,
        viewportWidth: window.innerWidth / scale,
        viewportHeight: window.innerHeight / scale,
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [width, height]);

  return fit;
}
