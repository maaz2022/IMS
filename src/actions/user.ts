"use server";

import { db } from "@/lib/db";
import { auth, signIn } from "../../auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const loginSignup = async (formData: FormData, isLogin: boolean) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check if all required fields are filled
  if (!email || !password || (!isLogin && !name)) {
    return { error: "All fields are mandatory to filled." }; // Error message for missing fields
  }

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
      redirect("/"); // Redirect on successful sign in
    })
    .catch((err) => {
      if (err?.toString() === "Error: NEXT_REDIRECT") {
        user?.isAdmin ? redirect("/dashboard") : redirect("/");
      } else return { error: err?.type }; // Return error type for failed login
    });

  if (!isLogin && res?.error) {
    return { error: "credentials already exist" }; // Error for existing credentials
  } else {
    return { error: "wrong credentials" }; // Error for wrong credentials
  }
};


// update user

export const updateUser = async (id: string, userId: string, isAdmin: boolean) => {
  let inventory;
  let trackOrder = null;

  try {
    // Update inventory to assign the new userId
    inventory = await db.inventory.update({
      where: { id },
      data: { userId },
    });

    if (!inventory) {
      console.error("Inventory update failed: No inventory found");
      return { error: "failed to transfer inventory" };
    }

    // Update the status and other order details in TrackOrder
    trackOrder = await db.trackOrder.create({
      data: {
        orderCost: inventory.cost, // Assuming the cost is part of the inventory
        itemName: inventory.name, // Get the item name from inventory
        userName: inventory.userId 
          ? (await db.user.findUnique({ where: { id: inventory.userId } }))?.name || "" // Optional chaining to handle null
          : "", 
        userId: userId, 
      },
    });

    if (!trackOrder) {
      console.error("TrackOrder update failed: No track order found");
      return { error: "failed to update track order" };
    }

    // Optionally revalidate the frontend view based on user's role (Admin or User)
    revalidatePath(isAdmin ? "/dashboard" : "/");

  } catch (error) {
    console.error("Error updating order:", error instanceof Error ? error.message : error);
    return { error: "failed to update the user and inventory" };
  }

  return { inventory, trackOrder };
};

// export const updateUserr = async (id: string, userId: string, isAdmin: boolean) => {
//   let transmittal;
//   let trackOrder = null;

//   try {
//     // Update the transmittal to assign the new userId
//     transmittal = await db.transmittal.update({
//       where: { id },
//       data: { userId }, // Update userId for the transmittal
//     });

//     if (!transmittal) {
//       console.error("Transmittal update failed: No transmittal found");
//       return { error: "Failed to transfer transmittal" };
//     }

//     // Create a new track order based on the transmittal details
// trackOrder = await db.trackOrder.create({
//   data: {

//     itemName: transmittal.descriptionOfGoods,
//     userName: transmittal.userId
//       ? (await db.user.findUnique({ where: { id: transmittal.userId } }))?.name || ""
//       : "",
//     userId: userId,
//     mall: transmittal.mall, // Now this will be valid
//     storeCollectedFrom: transmittal.storeCollectedFrom, // This too
//     storeDeliveredTo: transmittal.storeDeliveredTo, // And this
//     quantity: transmittal.quantity, // If you need to track quantity
//   },
// });


//     if (!trackOrder) {
//       console.error("TrackOrder creation failed: No track order found");
//       return { error: "Failed to create track order" };
//     }

//     // Optionally revalidate the frontend view based on user's role (Admin or User)
//     revalidatePath(isAdmin ? "/dashboard" : "/");

//   } catch (error) {
//     console.error("Error updating order:", error instanceof Error ? error.message : error);
//     return { error: "Failed to update the user and transmittal" };
//   }

//   return { transmittal, trackOrder }; // Return both transmittal and track order details
// };



// /pages/api/updateOrder.ts





// // Function to dynamically update the order status
// export const updateOrderStatus = async (orderId: string, newStatus: string) => {
//   try {
//     const updatedOrder = await db.trackOrder.update({
//       where: { id: orderId },
//       data: { status: newStatus }, // Update the status field
//     });

//     if (!updatedOrder) {
//       return { error: "Failed to update order status" };
//     }

//     return { success: true, updatedOrder };
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return { error: "Failed to update order status" };
//   }
// };



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

  // Get the Base64 image from formData
  const imageBase64 = formData.get("imageBase64") as string | null;

  // Convert new fields to numbers
  const asPerPlan = Number(getAsPerPlan);
  const existing = Number(getExisting);
  const required = Number(getRequired);
  const proInStore = Number(getProInStore);

  const user = await db.user.findUnique({
    where: { email: session?.user?.email! },
  });

  // Validate that all required fields are present
  if (!name || !description || !cost) {
    return { error: "All fields are required" };
  }

  let inventory;
  try {
    console.log("Creating/Updating Inventory:", {
      name,
      description,
      cost,
      asPerPlan,
      existing,
      required,
      proInStore,
      userId: user?.id,
      image: imageBase64,
    });

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
          image: imageBase64, // Store image as Base64
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
          image: imageBase64, // Store image as Base64
        },
      });
    }

    if (!inventory) {
      return { error: "Failed to create inventory" };
    }
  } catch (error) {
    console.error("Error in addUpdateInventory:", error);
    return { error: "Failed to create inventory" };
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

export const DeleteTrackOrder = async (id: string) => {
  try {
    const result = await db.trackOrder.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    if (!result) {
      return { error: "track order not deleted" };
    }
  } catch (error) {
    return { error: "track order not deleted" };
  }
};


export const TransmittalDelete = async (id: string) => {
  try {
    const result = await db.transmittal.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    if (!result) {
      return { error: "Transmittal not deleted" };
    }
  } catch (error) {
    return { error: "transmittal not deleted" };
  }
};



export const addUpdateTransmittal = async (formData: FormData, data: any) => {
  const session = await auth();

  // Retrieve fields from formData
  const mall = formData.get("mall") as string;
  const storeCollectedFrom = formData.get("storeCollectedFrom") as string;
  const storeDeliveredTo = formData.get("storeDeliveredTo") as string;
  const managerName = formData.get("managerName") as string;
  const descriptionOfGoods = formData.get("descriptionOfGoods") as string;
  const getQuantity = formData.get("quantity") as string;
  const quantity = Number(getQuantity); // Convert to number directly

  // Retrieve and format dates
  const dateDispatched = formData.get("dateDispatched") as string;
  const dateReceived = formData.get("dateReceived") as string;

  const formattedDateDispatched = new Date(dateDispatched).toISOString();
  const formattedDateReceived = new Date(dateReceived).toISOString();

  const time = formData.get("time") as string;
  const receivingStoreRepName = formData.get("receivingStoreRepName") as string;
  const receivingStoreRepSignature = formData.get("receivingStoreRepSignature") as string;

  // Fetch user details based on the session
  const user = await db.user.findUnique({
    where: { email: session?.user?.email! },
  });

  // Validate that all required fields are present
  if (!mall || !storeCollectedFrom || !storeDeliveredTo || !managerName || !descriptionOfGoods || !quantity) {
    return { error: "All required fields must be provided" };
  }

  let transmittal;
  try {
    console.log("Creating/Updating Transmittal:", {
      mall,
      storeCollectedFrom,
      storeDeliveredTo,
      managerName,
      descriptionOfGoods,
      quantity,
      dateDispatched: formattedDateDispatched,
      dateReceived: formattedDateReceived,
      time,
      receivingStoreRepName,
      receivingStoreRepSignature,
      userId: user?.id,
    });

    if (data?.id) {
      // Update existing transmittal
      transmittal = await db.transmittal.update({
        where: { id: data.id },
        data: {
          mall,
          storeCollectedFrom,
          storeDeliveredTo,
          managerName,
          descriptionOfGoods,
          quantity,
          dateDispatched: formattedDateDispatched,
          dateReceived: formattedDateReceived,
          time,
          receivingStoreRepName,
          receivingStoreRepSignature,
          userId: user?.id,
        },
      });
    } else {
      // Create new transmittal
      transmittal = await db.transmittal.create({
        data: {
          mall,
          storeCollectedFrom,
          storeDeliveredTo,
          managerName,
          descriptionOfGoods,
          quantity,
          dateDispatched: formattedDateDispatched,
          dateReceived: formattedDateReceived,
          time,
          receivingStoreRepName,
          receivingStoreRepSignature,
          userId: user?.id,
        },
      });
    }

    if (!transmittal) {
      return { error: "Failed to create transmittal" };
    }
  } catch (error: any) {
    console.error("Error in addUpdateTransmittal:", error);
    return { error: error.message || "Failed to create transmittal" };
  }

  revalidatePath(`/dashboard`); // Revalidate path for client-side updates
  return transmittal; // Return the created or updated transmittal
};



