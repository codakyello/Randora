import { useRef, useLayoutEffect } from "react";

function useOutsideClick<T extends HTMLElement>(
  handler: () => void, // The handler function
  listenCapturing: boolean = false // Optional: Defaults to capturing phase
) {
  const ref = useRef<T>(null); // Using a generic HTML element ref

  useLayoutEffect(() => {
    console.log("Outside clicked");
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler(); // Call the handler when a click happens outside
      }
    }

    // Add the event listener
    document.addEventListener("click", handleClick, listenCapturing);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handler, listenCapturing]);

  return ref; // Return the ref to be attached to the element
}

export default useOutsideClick;
