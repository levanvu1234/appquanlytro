import axios from "./axios.customize";

const createUserApi=(name, email,phonenumber, password) =>{
    const URL_API="/v1/api/register";
    const data ={
        name, email,phonenumber, password
    } 
    return axios.post(URL_API, data)
}
const LoginApi=(phonenumber, password) =>{
    const URL_API="/v1/api/login";
    const data ={
         phonenumber, password
    }
    return axios.post(URL_API, data)
}
const GetUserApi=() =>{
    const URL_API="/v1/api/user";
    
    return axios.get(URL_API)
}
const updateUserApi = (id, updatedData) => {
  const URL_API = `/v1/api/users/${id}`;
  return axios.put(URL_API, updatedData);
};

//room
const GetRoomApi=() =>{
    const URL_API="/v1/api/room";
    
    return axios.get(URL_API)
}
const CreateRoomApi = (roomData) => {
    const URL_API = "/v1/api/room";
    return axios.post(URL_API, roomData);
};
const updateRoomApi = (id, updatedData) => {
  const URL_API = `/v1/api/room/${id}`;
  return axios.put(URL_API, updatedData);
};

//building
const GetBuildingApi=() =>{
    const URL_API="/v1/api/building";
    
    return axios.get(URL_API)
}
const CreateBuildingApi = async (buildingData) => {
    const URL_API = "/v1/api/building";
    return axios.post(URL_API, buildingData); 
};
const GetBuildingRevenueApi = async () => {
  try {
    const data = await axios.get("/v1/api/building/report/revenue");
    console.log("🧾 API data:", data); // Lúc này `data` là mảng
    return data;
  } catch (err) {
    console.error("❌ Lỗi gọi API doanh thu:", err.message);
    return [];
  }
};


//bill
const GetBillApi=() =>{
    const URL_API="/v1/api/bill";
    
    return axios.get(URL_API)
}
const CreateBillgApi = async (monthlyBillData) => {
    const URL_API = "/v1/api/bill";
    return axios.post(URL_API, monthlyBillData); 
};
const updateBillApi = (id, updatedData) => {
  const URL_API = `/v1/api/bill/${id}`;
  return axios.put(URL_API, updatedData);
};
const PrintBillPdfApi = async (billId) => {
  const URL_API = `/v1/api/bill/pdf/${billId}`;
  return axios.get(URL_API, {
    responseType: 'blob', // để nhận dữ liệu nhị phân PDF
    
  });
};

export{ //thay vi dung export default thi dung nhu nay de xuat ra nhieu function(api)
    createUserApi,LoginApi,GetUserApi,updateUserApi, 
    GetRoomApi,CreateRoomApi,updateRoomApi,
    GetBuildingApi, CreateBuildingApi,GetBuildingRevenueApi,
    GetBillApi,CreateBillgApi,updateBillApi,PrintBillPdfApi

}