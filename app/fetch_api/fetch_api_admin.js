"use server";
let api = "http://127.0.0.1:8000";
import axios from "axios";

// import DatatableStrig from "../component/strig";
export async function GetDatastrategic(token) {
  try {
    console.log("token : ", token);
    const response = await axios.get(`${api}/api/v1/admin/strategic`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `application/json`, // ส่ง Token ผ่าน Header
      },
    });

    // const json = await response.json();
    console.log("data : ", response.data?.data);
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}

export async function GetDataactionplan(token, id_strategic) {
  console.log(id_strategic);
  try {
    console.log("token : ", token);
    const response = await axios.get(`${api}/api/v1/admin/actionplan`, {
      params: {
        id_strategic: id_strategic,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // const json = await response.json();
    console.log("data : ", response.data?.data);
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}

export async function GetDataproject(token, id_actionplan) {
  console.log(id_actionplan);
  try {
    console.log("token : ", token);
    const response = await axios.get(`${api}/api/v1/admin/project`, {
      params: {
        id_actionplan: id_actionplan,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // const json = await response.json();
    console.log("data : ", response.data?.data);
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}

export async function GetDataactivity(token, id_project) {
  console.log(id_project);
  try {
    console.log("token : ", token);
    const response = await axios.get(`${api}/api/v1/admin/activity`, {
      params: {
        id_project: id_project,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // const json = await response.json();
    console.log("data : ", response.data?.data);
    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}



export async function GetLogin(email, password) {
  // console.log(id_strategic.data)
  try {
    const response = await axios.post(
      `${api}/api/login-admin`,
      { email, password },
      {
        headers: {
          "Content-Type": `application/json`, // ส่ง Token ผ่าน Header
        },
      }
    );

    // const json = await response.json();
    console.log("data : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Swal.fire("Error", "ไม่สามารถดึงข้อมูลได้", "error");
    throw error; // ส่ง Error ออกไปให้จัดการในที่เรียกใช้
  }
}
