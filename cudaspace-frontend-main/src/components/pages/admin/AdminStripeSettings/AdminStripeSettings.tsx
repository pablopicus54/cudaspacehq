"use client";
import React, { useEffect, useMemo, useState } from "react";

type StripeClientConfig = {
  publishableKey: string;
  mode: "live" | "test" | string;
};

const maskKey = (key: string) => {
  if (!key) return "";
  const visible = key.slice(-6);
  return `••••••••••••••••••••••••${visible}`;
};

export default function AdminStripeSettings() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<StripeClientConfig | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  const envMode = envKey.includes("pk_live") ? "live" : "test";

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        if (baseUrl) {
          const res = await fetch(`${baseUrl}package/stripe-client`);
          const json = await res.json();
          const data = json?.data as StripeClientConfig | undefined;
          setConfig(
            data || {
              publishableKey: envKey,
              mode: envMode,
            }
          );
        } else {
          setConfig({ publishableKey: envKey, mode: envMode });
        }
      } catch (e) {
        setConfig({ publishableKey: envKey, mode: envMode });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [baseUrl]);

  const publishableKeyMasked = useMemo(
    () => maskKey(config?.publishableKey || envKey),
    [config?.publishableKey, envKey]
  );

  return (
    <div className="max-w-2xl mt-4 bg-white border rounded p-6">
      <h2 className="text-xl font-semibold mb-2">Stripe Settings</h2>
      <p className="text-sm text-gray-600 mb-6">
        Keys are sourced from the server at runtime. Editing here is disabled in
        this build.
      </p>

      {loading ? (
        <div className="text-gray-600">Loading current configuration…</div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publishable Key
            </label>
            <input
              value={publishableKeyMasked}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used on the client for Stripe Elements initialization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                  (config?.mode || envMode) === "live"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {(config?.mode || envMode).toUpperCase()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Status
              </label>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                Managed server-side
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <input
              value={"••••••••••••"}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Secret key is never exposed to the browser and is configured
              server-side.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook Secret
            </label>
            <input
              value={"••••••••••••"}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Webhook secret is used by the backend to verify Stripe events.
            </p>
          </div>

          <div className="pt-2">
            <button
              disabled
              className="cursor-not-allowed bg-gray-200 text-gray-600 px-4 py-2 rounded"
              title="Editing is disabled in this build"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}