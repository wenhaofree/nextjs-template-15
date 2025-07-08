"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: number;
  orderNo: string;
  amount: number;
  status: string;
  createdAt: string;
  productName: string;
  currency: string;
  paidAt: string | null;
}

export default function OrdersPage() {
  const t = useTranslations("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      case "expired":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100);
  };

  const getStatusText = (status: string) => {
    const statusKey = status.toLowerCase();
    // Use type assertion for dynamic keys
    return t(`orderDetails.status.${statusKey}` as any);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("description")}</p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">{t("noOrders")}</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.orderNo}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {order.productName || t("orderDetails.purchase")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("orderDetails.orderId")}: {order.orderNo}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">{t("orderDetails.amount")}</p>
                  <p className="font-medium">
                    {formatAmount(order.amount, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t("orderDetails.orderDate")}</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), "PPP")}
                  </p>
                </div>
                {order.paidAt && (
                  <div>
                    <p className="text-gray-500">{t("orderDetails.paidDate")}</p>
                    <p className="font-medium">
                      {format(new Date(order.paidAt), "PPP")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
