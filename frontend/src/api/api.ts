import axios from "axios";

const API_BASE_URL = "/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for authentication
  headers: {
    "Content-Type": "application/json",
  },
  // we don't use arrays as query parameters currently, but if we do in the future,
  // paramsSerializer: (params) => {
  //   const searchParams = new URLSearchParams();

  //   Object.entries(params).forEach(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       // Only serialize non-empty arrays as array=1,2,3 format
  //       if (value.length > 0) {
  //         searchParams.append(key, `${value.join(',')}`);
  //       }
  //     } else if (value !== undefined && value !== null) {
  //       searchParams.append(key, String(value));
  //     }
  //   });

  //   return searchParams.toString();
  // },
});
