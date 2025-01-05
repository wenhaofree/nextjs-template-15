"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>
                  {t("orderDetails.orderId")}: {order.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t("orderDetails.date")}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("orderDetails.amount")}</p>
                    <p>${order.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("orderDetails.status")}</p>
                    <p className="capitalize text-green-600">
                      {t(`orderDetails.${order.status}`)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
