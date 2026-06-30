"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await api.get("/health");
        setApiStatus(response.data.data.status);
      } catch (error) {
        console.error(error);
        setApiStatus("failed");
      }
    };

    checkApi();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">SalamatPo</h1>
      <p className="mt-4 text-lg">
        FastAPI 연결 상태: {apiStatus}
      </p>
    </main>
  );
}