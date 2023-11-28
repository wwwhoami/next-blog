"use client";

import { MutableRefObject, useEffect, useState } from "react";

type Props = {
  ref: MutableRefObject<HTMLDivElement>;
};

const useOnScreen = (ref: MutableRefObject<any>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

export default useOnScreen;
