import { AxiosError } from "axios";

export const handleAxiosError = (error: AxiosError) => {
  // Check if the error is a 4XX or 5XX error.
  if (
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 600
  ) {
    console.error(error.message);
    // The error is a meaningful error.
    console.error("Request data:", error.response.request.body);
    console.error("Response data: ", error.response.data);
    const { data } = error.response as { data: { message: string } };
    const errorMessage = data.message;
    return !!errorMessage ? errorMessage : error.message;
  } else {
    // The error is not a meaningful error.
    console.error(error);
    return error.message;
  }
};
