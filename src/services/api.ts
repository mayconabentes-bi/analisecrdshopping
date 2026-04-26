/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoreData } from "../types";

const API_BASE_URL = "http://localhost:3001/api";

export async function fetchStores(): Promise<StoreData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stores`);
    if (!response.ok) {
      throw new Error(`Error fetching stores: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Service Error:", error);
    throw error;
  }
}
