import api from "../Api/api.js";
export const signupUser = async (formData) => {
  try {

    const response = await api.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw (
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong"
    );
  }
};

export const loginUser = async (data) => {
  try {
    
    const response = await api.post("/users/login", data);
    return response.data;
  } catch (error) {
    throw (
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong"
    );
  }
};