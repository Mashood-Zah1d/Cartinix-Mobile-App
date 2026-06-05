import api from "../Api/api";

export const getProducts = async () => {
    try {
        const response = await api.get("/products/productDetail")
        return response.data
    } catch (error) {
        throw (
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        )
    }
}


export const getProductDetail = async (id) => {
    try {
        const response = await api.get(`/products/${id}`)
        console.log(response.data);
        
        return response.data
    } catch (error) {
        throw (
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        )
    }
}