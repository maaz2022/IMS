import OrderTracking from '@/components/TrackOrders';
import React from 'react';
import { auth } from '../../../../auth';
import { db } from '@/lib/db';

const Page = async () => {
  const session = await auth();

  // Ensure that session and session.user are not null
  const userName = session?.user?.name ?? ''; // Use default empty string if name is null or undefined

  // Fetch orders excluding the current user's orders
  const orders = await db.trackOrder.findMany({
    where: {
      userName: { not: { equals: userName } }, // Corrected to ensure userName is properly typed
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch user names for each order if necessary
  const ordersWithNames = await Promise.all(
    orders.map(async (order) => {
      const user = await db.user.findUnique({
        where: { id: order.userId || '' }, // Use an empty string as fallback if userId is null
        select: { name: true }, // Fetch the user name
      });

      return {
        ...order,
        name: user?.name || '', // Add name, default to empty string if not found
      };
    })
  );

  return (
    <OrderTracking data={ordersWithNames} /> // Pass the modified orders to OrderTracking
  );
};

export default Page;
