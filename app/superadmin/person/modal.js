import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import {
  AddDataUser,
  EditDataUser,
} from "../../fetch_api/fetch_api_superadmin";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
export function ModalUser({ isOpen, onClose, type, data, position, academic }) {
  if (!isOpen) return null;
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [showsecretPassword, setShowsecretPassword] = useState(false);
  const [dataUser, setdataUser] = useState({
    id: data.id ? data.id : null,
    name: data.name ? data.name : "",
    email: data.email ? data.email : "",
    password: "",
    confirmpassword: "",
    secret_key: "",
    imgFile: "",
    id_position: data.id_position ? data.id_position : null,
    academic_position: data.academic_position ? data.academic_position : null,
    imgUrl: data.url_img
      ? `${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/user/${data.url_img}`
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });

  const [olddataUser, setolddataUser] = useState({
    id: data.id ? data.id : null,
    name: data.name ? data.name : "",
    email: data.email ? data.email : "",
    password: "",
    confirmpassword: "",
    secret_key: "",
    imgFile: "",
    id_position: data.id_position ? data.id_position : null,
    academic_position: data.academic_position ? data.academic_position : null,
    imgUrl: data.url_img
      ? `${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/user/${data.url_img}`
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });

  const [OlYear, setolddpartmentName] = useState(data.name);

  //   const [optionsPosition, setOptionsPosition] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: dataUser.name ? `ชื่อ : ${dataUser.name}` : "",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // console.log("Submitted Strategic Name: ", Year);

        // เพิ่มหรือส่งข้อมูลกลับ
        // เช่น: onSave(Year);
        try {
          const token = Cookies.get("token");
          const formData = new FormData();
          // หากจำเป็นต้องส่ง parameter เช่น user_id
          const requiredFields = {
            name: "ชื่อ",
            id_position: "ตำแหน่ง",
            email: "อีเมล",
            academic_position: "ประเภท",
            secret_key: "รหัสยืนยันตัวตน",
          };

          const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !dataUser[key])
            .map(([, label]) => label);

          if (missingFields.length > 0) {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: `กรุณากรอกข้อมูล: ${missingFields.join(", ")}`,
              icon: "error",
              confirmButtonText: "ตกลง",
            });
            return;
          }
          formData.append("name", dataUser.name || "");
          formData.append("id_position", dataUser.id_position);
          formData.append("email", dataUser.email);
          formData.append("password", dataUser.password);
          formData.append("academic_position", dataUser.academic_position);
          if (dataUser.imgFile instanceof File) {
            formData.append("url_img", dataUser.imgFile);
          }
          if (dataUser.password !== "") {
            if (dataUser.password !== dataUser.confirmpassword) {
              Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "รหัสผ่านไม่เหมือนกัน",
                icon: "error",
                confirmButtonText: "ตกลง",
              });
              return;
            }

            if (
              !/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
                dataUser.password
              )
            ) {
              Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว และมีตัวพิมพ์ใหญ่กับอักขระพิเศษอย่างน้อย 1 ตัว",
                icon: "error",
                confirmButtonText: "ตกลง",
              });
              return;
            }

            formData.append("password", dataUser.password);
          }
          console.log(dataUser);
          let response;
          if (type == 1) {
            response = await AddDataUser(token, formData);
          } else {
            console.log(dataUser.id);
            formData.append("_method", "PUT");
            response = await EditDataUser(
              token,
              formData,
              dataUser.id,
              dataUser.secret_key
            );
          }

          // if(response)
          console.log(response);
          if (response.status == 200) {
            Swal.fire({
              title: "อัปเดตข้อมูลสำเร็จ",
              // text: ` ${newStatus === 1 ? "เปิดการใช้งาน" : "ปิดการใช้งาน"} ${row.departments_name}`,
              text: "ข้อมูลถูกอัปเดตในระบบแล้ว",
              icon: "success",
              confirmButtonText: "ตกลง",
              timer: 1500,
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถเพิ่มข้อมูล กรุณาลองใหม่อีกครั้ง",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: err, // แสดงเฉพาะข้อความเท่านั้น
            confirmButtonText: "ตกลง",
          });
          console.log(err);
        }

        // onClose(); // ปิด modal ถ้าต้องการ
      }
    });
  };

  function formatDecimalWithComma(value) {
    if (value === "" || value === null || value === undefined) return "";

    // const [intPart, decimalPart] = value.split(".");
    // \B = ยุทธ์ศาสตร์ที่ไม่ใช่ขอบเขตคำ
    // ?= ตรงนี้จะ match ก็ต่อเมื่อข้างหน้ามี pattern ที่กำหนด
    // \d{3} → ตัวเลข 3 ตัวติดกัน
    // (?!\d) ป้องกันการใส่คอมมาที่ท้ายสุดของตัวเลข เช่น "123," ← แบบนี้ไม่เอา
    // มองไปข้างหน้า ถ้าเจอกลุ่มตัวเลข 3 หลักขึ้นไป ที่ ไม่มีตัวเลขต่อท้ายอีก ให้ match ตรงนี้

    const strValue = String(value);

    // ถ้าไม่มีจุดทศนิยม ไม่ต้องแยก
    if (!strValue.includes(".")) {
      return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const [intPart, decimalPart] = strValue.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined
      ? `${formattedInt}.${decimalPart}`
      : formattedInt;
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f9fafb", // สีพื้นหลังที่ต้องการ
      borderColor: "#d1d5db", // สีของขอบ
      padding: "0.125rem", // ขนาด padding
      borderRadius: "0.375rem", // ขอบมุมโค้ง
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff", // สีพื้นหลังของ dropdown
      borderColor: "#d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#1E90FF" : "#ffffff", // สีเมื่อเลือก option
      color: state.isSelected ? "#ffffff" : "#333333", // สีตัวอักษรเมื่อเลือก
      padding: "0.5rem", // ขนาด padding ของแต่ละ option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // สีของ placeholder
    }),
  };
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 w-full min-h-screen overflow-y-auto bg-gray-500/60 z-50 flex justify-center items-start pt-2"
    >
      <div
        data-aos="fade-down"
        className="relative p-4 w-full max-w-xl max-h-screen mb-4"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {type == 1 ? "เพิ่มข้อมูลบุคลากรใหม่" : "แก้ไขบุคลากร"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5">
            <form  autoComplete="off" className="space-y-4">
              <div>
                <div className="flex justify-center">
                  {dataUser?.imgUrl && (
                    <div className="mb-2">
                      <img
                        src={dataUser.imgUrl}
                        alt="รูปโปรไฟล์"
                        className="w-36 h-36  rounded-full border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-0 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="กรุณากรอกชื่อ"
                  required
                  value={dataUser.name}
                  onChange={(e) => {
                    // onYearChange(e.target.value);
                    setdataUser({
                      ...dataUser,
                      name: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    อีเมล
                  </label>
                  
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="off"
                    className="bg-gray-0 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="กรุณากรอกอีเมล"
                    required
                    value={dataUser.email}
                    onChange={(e) => {
                      // onYearChange(e.target.value);
                      setdataUser({
                        ...dataUser,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    รหัสผ่าน
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className="bg-gray-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="กรุณากรอกรหัสผ่าน"
                      required
                       autoComplete="off"
                      value={dataUser.password || ""}
                      onChange={(e) =>
                        setdataUser({
                          ...dataUser,
                          password: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
              </div>
              {dataUser.password && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ยืนยันรหัสผ่าน
                    </label>

                    <div className="relative">
                      <input
                        type={showconfirmPassword ? "text" : "password"}
                        name="confirmpassword"
                        id="confirmpassword"
                        className="bg-gray-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="กรุณากรอกยืนยันรหัสผ่าน"
                        required
                         autoComplete="off"
                        value={dataUser.confirmpassword || ""}
                        onChange={(e) =>
                          setdataUser({
                            ...dataUser,
                            confirmpassword: e.target.value,
                          })
                        }
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                        onClick={() => setShowconfirmPassword((prev) => !prev)}
                      >
                        {showconfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="deparment"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ตำแหน่ง
                  </label>
                  <Select
                    id="deparment"
                    value={position.find(
                      (option) => option.value === dataUser.id_position
                    )}
                    // value={dataAddNewActivity.deparment || ""}
                    onChange={(e) => {
                      // console.log("Selected Value:", e.value);
                      setdataUser({
                        ...dataUser,
                        id_position: e.value,
                      });
                    }}
                    options={position}
                    styles={customStyles}
                    className="text-sm shadow-md"
                    placeholder="กรุณาเลือกตำแหน่ง"
                    instanceId="deparment-select" // Add this line to fix duplicate IDs
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="nameStrategic"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ประเภท
                  </label>
                  <Select
                    id="type"
                    value={academic.find(
                      (option) =>
                        option.value === parseInt(dataUser.academic_position)
                    )}
                    // value={dataAddNewActivity.deparment || ""}
                    onChange={(e) => {
                      console.log("Selected Value:", e.value);
                      setdataUser({
                        ...dataUser,
                        academic_position: e.value,
                      });
                    }}
                    options={academic}
                    styles={customStyles}
                    className="text-sm shadow-md"
                    placeholder="กรุณาเลือกประเภท"
                    instanceId="type-select" // Add this line to fix duplicate IDs
                  />
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input"
                >
                  อัปโหลดไฟล์ (เช่น รูปภาพหรือเอกสาร)
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file); // แปลงเป็น URL
                      setdataUser((prev) => ({
                        ...prev,
                        imgUrl: previewUrl,
                        imgFile: file, // แยกเก็บไว้เพื่อส่งไป backend
                      }));
                    }
                  }}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  SVG, PNG, JPG ขนาดไม่เกิน 800x400px
                </p>

                {/* <input
                  type="file"
                  name="fileUpload"
                  id="fileUpload"
                  className="bg-gray-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // ส่งต่อ file ไปยังฟังก์ชันจัดการ
                      console.log("อัปโหลดไฟล์:", file);
                      setDataUser((prev) => ({
                        ...prev,
                        file: file, // เก็บไฟล์ไว้ใน state
                      }));
                    }
                  }}
                /> */}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  รหัสยืนยันตัวตน
                </label>

                <div className="relative">
                  <input
                    type={showsecretPassword ? "text" : "password"}
                    name="secret_key"
                    id="secret_key"
                    className="bg-gray-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="กรุณากรอกรหัสยืนยันตัวตน"
                    required
                    value={dataUser.secret_key || ""}
                    onChange={(e) =>
                      setdataUser({
                        ...dataUser,
                        secret_key: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    onClick={() => setShowsecretPassword((prev) => !prev)}
                  >
                    {showsecretPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-5">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  ยืนยัน
                </button>
                <button
                  onClick={onClose}
                  className="text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
