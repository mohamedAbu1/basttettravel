"use client";

import StatusScreen from "@/components/feedback/StatusScreen";

export default function AdminError({ error, reset }) {
  return <StatusScreen mode="error" error={error} reset={reset} />;
}
