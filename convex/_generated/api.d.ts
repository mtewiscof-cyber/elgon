/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as blogPosts from "../blogPosts.js";
import type * as cart from "../cart.js";
import type * as customers from "../customers.js";
import type * as growers from "../growers.js";
import type * as inventory from "../inventory.js";
import type * as messages from "../messages.js";
import type * as migrations from "../migrations.js";
import type * as news from "../news.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as wishlist from "../wishlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blogPosts: typeof blogPosts;
  cart: typeof cart;
  customers: typeof customers;
  growers: typeof growers;
  inventory: typeof inventory;
  messages: typeof messages;
  migrations: typeof migrations;
  news: typeof news;
  orders: typeof orders;
  products: typeof products;
  subscriptions: typeof subscriptions;
  users: typeof users;
  wishlist: typeof wishlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
