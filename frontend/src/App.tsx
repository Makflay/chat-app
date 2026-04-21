import { useEffect, useRef } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/auth-store";

function App() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  const startedRef = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      await useAuthStore.persist.rehydrate();

      const { token } = useAuthStore.getState();
      console.log("token useEffect App", token);

      if (!token) {
        setInitialized(true);
        return;
      }

      await fetchMe();
    };
    console.log("startedRef.current", startedRef.current);
    if (startedRef.current) return;
    startedRef.current = true;

    void initAuth();
  }, [fetchMe, setInitialized]);

  console.log("isInitialized App.tsx", isInitialized);

  if (!isInitialized) {
    return <p>Loading...</p>;
  }

  return <AppRouter />;
}

export default App;
