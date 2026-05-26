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

      if (!token) {
        setInitialized(true);
        return;
      }

      await fetchMe();
    };
    if (startedRef.current) return;
    startedRef.current = true;

    void initAuth();
  }, [fetchMe, setInitialized]);

  if (!isInitialized) {
    return <p>Loading...</p>;
  }

  return <AppRouter />;
}

export default App;
