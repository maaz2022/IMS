"use server";

import { db } from "@/lib/db";
import { auth, signIn } from "../../auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const loginSignup = async (formData: FormData, isLogin: boolean) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({
    where: { email },
    select: { isAdmin: true },
  });

  const res = await signIn("credentials", {
    name,
    email,
    password,
    isLogin,
    redirect: true,
    callbackUrl: "/",
  })
    .then(() => {
      redirect("/");
    })
    .catch((err) => {
      if (err?.toString() == "Error: NEXT_REDIRECT") {
        user?.isAdmin ? redirect("/dashboard") : redirect("/");
      } else return { error: err?.type };
    });

  if (!isLogin && res?.error) {
    return { error: "credentials already exists" };
  } else {
    return { error: "wrong credentials" };
  }
};

// update user

export const updateUser = async (id: string, userId: string, isAdmin: boolean, status: string) => {
  let inventory;
  let trackOrder = null;

  try {
    // Update inventory to assign the new userId
    inventory = await db.inventory.update({
      where: { id },
      data: { userId }, // Transfer item ownership by updating userId
    });

    if (!inventory) {
      return { error: "failed to transfer inventory" };
    }

    // Update the status and other order details in TrackOrder
    trackOrder = await db.trackOrder.update({
      where: { id },
      data: {
        status, // Dynamic status provided by the user
        orderCost: inventory.cost, // Set order cost from inventory
        itemName: inventory.name, // Set item name from inventory
        userName: inventory.userId
          ? (await db.user.findUnique({ where: { id: inventory.userId } }))?.name || ""
          : "", // Set the user's name if available
        userId, // Set the userId as the current user transferring
      },
    });

    if (!trackOrder) {
      return { error: "failed to update track order" };
    }

    // Optionally revalidate the frontend view based on user's role (Admin or User)
    revalidatePath(isAdmin ? "/dashboard" : "/");

  } catch (error) {
    console.error("Error updating order:", error);
    return { error: "failed to update the user and inventory" };
  }

  return { inventory, trackOrder };
};



// /pages/api/updateOrder.ts





// Function to dynamically update the order status
export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const updatedOrder = await db.trackOrder.update({
      where: { id: orderId },
      data: { status: newStatus }, // Update the status field
    });

    if (!updatedOrder) {
      return { error: "Failed to update order status" };
    }

    return { success: true, updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
};



// update user role
export const updateUserRole = async (
  formData: FormData,
  isAdmin: boolean,
  data: any
) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }
  const checkEmail = await db.user.findUnique({ where: { email } });
  if (!checkEmail) return { error: "User not found" };

  let user;
  try {
    user = await db.user.update({
      where: { id: data?.id },
      data: { name, email, password, isAdmin },
    });
    console.log(user, "user");
    if (!user) {
      return { error: "User not udpated" };
    }
  } catch (error) {
    return { error: "User not udpated" };
  }

  revalidatePath(`/dashboard/clients`);
  return user;
};

// add/update inventory

export const addUpdateInventory = async (formData: FormData, data: any) => {
  const session = await auth();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const getCost = formData.get("cost") as string;
  const cost = Number(getCost);

  // New fields from formData
  const getAsPerPlan = formData.get("asPerPlan") as string;
  const getExisting = formData.get("existing") as string;
  const getRequired = formData.get("required") as string;
  const getProInStore = formData.get("proInStore") as string;

  // Convert new fields to numbers
  const asPerPlan = Number(getAsPerPlan);
  const existing = Number(getExisting);
  const required = Number(getRequired);
  const proInStore = Number(getProInStore);

  const user = await db.user.findUnique({
    where: { email: session?.user?.email! },
  });

  // Validate that all required fields are present
  if (!name || !description || !cost ) {
    return { error: "All fields are required" };
  }

  let inventory;
  try {
    if (data?.id) {
      // Update existing inventory
      inventory = await db.inventory.update({
        where: { id: data?.id },
        data: {
          name,
          description,
          cost,
          asPerPlan,
          existing,
          required,
          proInStore,
          userId: user?.id,
        },
      });
    } else {
      // Create new inventory
      inventory = await db.inventory.create({
        data: {
          name,
          description,
          cost,
          asPerPlan,
          existing,
          required,
          proInStore,
          userId: user?.id,
        },
      });
    }

    if (!inventory) {
      return { error: "failed to create inventory" };
    }
  } catch (error) {
    return { error: "failed to create inventory" };
  }

  revalidatePath(`/dashboard`);
  return inventory;
};


// delete inventory

export const DeleteInventory = async (id: string) => {
  try {
    const result = await db.inventory.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    if (!result) {
      return { error: "inventory not deleted" };
    }
  } catch (error) {
    return { error: "inventory not deleted" };
  }
};

export const DeleteUser = async (id: string) => {
  try {
    const result = await db.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    if (!result) {
      return { error: "user not deleted" };
    }
  } catch (error) {
    return { error: "user not deleted" };
  }
};
// Function to send an order




