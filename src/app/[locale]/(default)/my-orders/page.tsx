"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const t = useTranslations("my-orders");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Here you would typically fetch orders from your backend
    // For now, we'll show the latest payment result from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    
    if (sessionId) {
      // Create a mock order from the successful payment
      const newOrder = {
        id: sessionId,
        amount: parseFloat(urlParams.get("amount") || "0"),
        status: "success",
        createdAt: new Date().toISOString(),
      };
      setOrders([newOrder]);
    }
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">{t("noOrders")}</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  {t("orderDetails.orderId")}: {order.id}
                </h3>
              </div>
              <div className="space-y-2">
                <p>
                  {t("orderDetails.amount")}: ${order.amount.toFixed(2)}
                </p>
                <p>
                  {t("orderDetails.status")}: {t(`orderDetails.${order.status}`)}
                </p>
                <p>
                  {t("orderDetails.date")}: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
