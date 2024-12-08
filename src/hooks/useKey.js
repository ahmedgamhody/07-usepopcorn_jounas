import { useEffect } from "react";

export default function useKey(key, action) {
  useEffect(() => {
    const callBackFun = (event) => {
      if (event.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    };

    window.addEventListener("keydown", callBackFun);

    return () => {
      window.removeEventListener("keydown", callBackFun);
    };
  }, [key, action]);
}
