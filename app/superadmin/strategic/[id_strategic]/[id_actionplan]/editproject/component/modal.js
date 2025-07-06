"use client";
import { useState, useEffect } from "react";
// In component/modal.js
import Select from "react-select";

import {
  AddObjectiveNew,
  EditObjective,
  AddOkrprojectNew,
  EditOkrproject,
  AddprojectuserNew,
  Editprojectuser,
} from "../../../../../../fetch_api/fetch_api_superadmin";
import _ from "lodash";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
export function ModalAddOkrNew({
  isOpen,
  onClose,
  type,
  okr,
  old,
  id_project,
  data,
  onSelectOkr,
}) {
  if (!isOpen) return null;

  const [idOkrProject, setidOkrProject] = useState(
    type == 1 ? "" : old.id_okr_project
  );
  const [selectedOkrproject, setSelectedOkrproject] = useState(
    type == 1
      ? ""
      : {
          value: old.id,
          label: old.name,
        }
  );
  const [OldokrProject, setoldokrProject] = useState(
    type == 1
      ? ""
      : {
          value: old.id,
          label: old.name,
        }
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f9fafb", // สีพื้นหลังที่ต้องการ
      borderColor: "#d1d5db", // สีของขอบ
      padding: "0.125rem", // ขนาด padding
      borderRadius: "0.375rem", // ขอบมุมโค้ง
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff", // สีพื้นหลังของ dropdown
      borderColor: "#d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#4caf50" : "#ffffff", // สีเมื่อเลือก option
      color: state.isSelected ? "#ffffff" : "#333333", // สีตัวอักษรเมื่อเลือก
      padding: "0.5rem", // ขนาด padding ของแต่ละ option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // สีของ placeholder
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
  };

  useEffect(() => {
    console.log(old);
    console.log(selectedOkrproject);
  }, [selectedOkrproject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedOkrproject);

    const isDuplicate = data.some(
      (item) => item.id === selectedOkrproject.value
    );
    if (isDuplicate) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "OKR นี้ในโปรเจคนี้อยู่แล้ว",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: type
        ? `ยืนยันการบันทึกข้อมูล : ${selectedOkrproject.label}`
        : `ยืนยันการแก้ไขข้อมูล : ${selectedOkrproject.label}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");
        console.log(id_project);
        if (type == 1) {
          const res = await AddOkrprojectNew(
            token,
            selectedOkrproject.value,
            id_project
          );
          console.log(res);
          if (res.status === 200 || res.status === 201) {
            onSelectOkr({
              label: selectedOkrproject.label,
              value: res.data.value,
              id: res.data.okr_detail_project_id,
            });
            Swal.fire({
              title: "สำเร็จ",
              text: `เพิ่มวัตถุประสงค์ ${selectedOkrproject.label}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        } else {
          const res = await EditOkrproject(
            token,
            idOkrProject,
            selectedOkrproject.value
          );
          console.log(res);
          if (res.status === 200 || res.status === 201) {
            onSelectOkr({
              label: selectedOkrproject.label,
              value: res.data.id_okr,
              id: idOkrProject,
            });
            Swal.fire({
              title: "สำเร็จ",
              text: `แก้ไข​ OKR ใหม่เป็น ${selectedOkrproject.label}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        }
      }
    });
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 w-full h-full bg-gray-500/60 bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        data-aos="fade-down"
        className="relative p-4 w-full max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {type === 1 ? "เพิ่ม OKR ใหม่" : "แก้ไข OKR "}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="Okrproject"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  OKR
                </label>
                <Select
                  value={
                    okr.find((option) => option.value === selectedOkrproject) ||
                    selectedOkrproject
                  }
                  onChange={(e) => setSelectedOkrproject(e)}
                  options={okr} // ตัวเลือกทั้งหมด
                  styles={customStyles}
                  className="text-sm"
                  placeholder="กรุณาเลือก OKR " // ข้อความ placeholder
                />
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="submit"
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

export function ModalAddObjectiveNew({
  isOpen,
  onClose,
  type,
  objective,
  old,
  id_project,
  onSelectOkr,
}) {
  if (!isOpen) return null;

  // const [actionplanName, setActionplanName] = useState("");
  const [selectedStrategic, setSelectedStrategic] = useState({
    id: type == 1 ? "" : old.id,
    name: type == 1 ? "" : old.name,
  });
  useEffect(() => {
    console.log(selectedStrategic);
  }, [selectedStrategic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(type);
    if (selectedStrategic.name.trim() == "") {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const isDuplicate = objective.some(
      (item) => item.name.trim() === selectedStrategic.name.trim()
    );
    console.log(isDuplicate);
    if (isDuplicate) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "วัตถุประสงค์นี้มีอยู่แล้ว",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: type
        ? `ยืนยันการบันทึกข้อมูล : ${selectedStrategic.name}`
        : `ยืนยันการแก้ไขข้อมูล : ${selectedStrategic.name}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");
        console.log(id_project);
        if (type == 1) {
          const res = await AddObjectiveNew(
            token,
            selectedStrategic.name,
            id_project
          );
          console.log(res);
          if (res.status === 200 || res.status === 201) {
            if (selectedStrategic.name.trim() !== "") {
              onSelectOkr({
                name: selectedStrategic.name,
                id: res.data.objective_id,
              });
            }
            Swal.fire({
              title: "สำเร็จ",
              text: `เพิ่มวัตถุประสงค์ ${selectedStrategic.name}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        } else {
          const res = await EditObjective(
            token,
            selectedStrategic.id,
            selectedStrategic.name
          );
          console.log(res);
          if (res.status === 200 || res.status === 201) {
            if (selectedStrategic.name.trim() !== "") {
              onSelectOkr(selectedStrategic);
            }
            Swal.fire({
              title: "สำเร็จ",
              text: `แก้ไขวัตถุประสงค์ ${selectedStrategic.name}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        }
      }
    });
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 w-full h-full bg-gray-500/60 bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        data-aos="fade-down"
        className="relative p-4 w-full max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {type === 1 ? "เพิ่มวัตถุประสงค์ใหม่" : "แก้ไขวัตถุประสงค์"}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="Strategic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  วัตถุประสงค์
                </label>
                <input
                  type="text"
                  value={selectedStrategic.name}
                  onChange={(e) =>
                    setSelectedStrategic((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="กรุณากรอกชื่อวัตถุประสงค์"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="submit"
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

export function ModalAddUserNew({
  isOpen,
  onClose,
  type,
  user,
  olduser,
  data,
  id_project,
  id_year,
  onSelectuser,
}) {
  if (!isOpen) return null;

  // const [actionplanName, setActionplanName] = useState("");
  const [Employee, setSelectedEmployee] = useState(
    type == 1
      ? ""
      : {
          value: olduser.id,
          label: olduser.name,
          id_project_users: olduser.id_project_users,
        }
  );

  const [idUserProject, setidUserProject] = useState(
    type == 1 ? "" : olduser.id_project_users
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f9fafb", // สีพื้นหลังที่ต้องการ
      borderColor: "#d1d5db", // สีของขอบ
      padding: "0.125rem", // ขนาด padding
      borderRadius: "0.375rem", // ขอบมุมโค้ง
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff", // สีพื้นหลังของ dropdown
      borderColor: "#d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#4caf50" : "#ffffff", // สีเมื่อเลือก option
      color: state.isSelected ? "#ffffff" : "#333333", // สีตัวอักษรเมื่อเลือก
      padding: "0.5rem", // ขนาด padding ของแต่ละ option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // สีของ placeholder
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Employee);

    const isDuplicate = data.some((item) => item.id === Employee.value);
    if (isDuplicate) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ชื่อเจ้าหน้านี้ในโปรเจคนี้อยู่แล้ว",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: type
        ? `ยืนยันการบันทึกข้อมูล : ${Employee.label}`
        : `ยืนยันการแก้ไขข้อมูล : ${Employee.label}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");
        console.log(id_year);
        if (type == 1) {
          const res = await AddprojectuserNew(
            token,
            Employee.value,
            id_project,
            1,
            id_year
          );
          // console.log(res);
          if (res.status === 200 || res.status === 201) {
            onSelectuser({
              label: Employee.label,
              value: res.data.value,
              id: res.data.okr_detail_project_id,
              position: Employee.position,
            });
            Swal.fire({
              title: "สำเร็จ",
              text: `เพิ่มผู้รับผิดชอบระดับปฏิบัติ ${Employee.label}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        } else {
          const res = await Editprojectuser(
            token,
            idUserProject,
            Employee.value
          );
          console.log(res);
          if (res.status === 200 || res.status === 201) {
            onSelectuser({
              label: Employee.label,
              value: res.data.id_user,
              id: res.data.id_project_user,
              position: Employee.position,
            });
            Swal.fire({
              title: "สำเร็จ",
              text: `แก้ไข​ผู้รับผิดชอบระดับปฏิบัติใหม่เป็น ${Employee.label}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        }
      }
    });
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 w-full h-full bg-gray-500/60 bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        data-aos="fade-down"
        className="relative p-4 w-full max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {type === 1
                ? "เพิ่มผู้รับผิดชอบระดับปฏิบัติใหม่"
                : "แก้ไขผู้รับผิดชอบระดับปฏิบัติ"}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="Strategic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {type === 1
                    ? "ผู้รับผิดชอบระดับปฏิบัติ"
                    : "ผู้รับผิดชอบระดับนโยบาย / บริหาร  "}
                </label>
                <Select
                  value={
                    user.find((option) => option.value === Employee) || Employee
                  }
                  onChange={(e) => setSelectedEmployee(e)}
                  options={user} // ตัวเลือกทั้งหมด
                  getOptionLabel={(e) => `${e.label} ${e.position || ""}`} // label ที่โชว์
                  getOptionValue={(e) => e.value}
                  styles={customStyles}
                  className="text-sm"
                  placeholder={
                    type === 1
                      ? "กรุณาเลือกผู้รับผิดชอบระดับปฏิบัติ"
                      : "กรุณาเลือกผู้รับผิดชอบระดับนโยบาย / บริหาร  "
                  } // ข้อความ placeholder
                />
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="submit"
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

export function ModalAddTeacherNew({
  isOpen,
  onClose,
  type,
  user,
  olduser,
  data,
  id_project,
  id_year,
  onSelectuser,
}) {
  if (!isOpen) return null;

  // const [actionplanName, setActionplanName] = useState("");
  const [Employee, setSelectedEmployee] = useState(
    type == 1
      ? ""
      : {
          value: olduser.id,
          label: olduser.name,
          id_project_users: olduser.id_project_users,
        }
  );

  const [idUserProject, setidUserProject] = useState(
    type == 1 ? "" : olduser.id_project_users
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f9fafb", // สีพื้นหลังที่ต้องการ
      borderColor: "#d1d5db", // สีของขอบ
      padding: "0.125rem", // ขนาด padding
      borderRadius: "0.375rem", // ขอบมุมโค้ง
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff", // สีพื้นหลังของ dropdown
      borderColor: "#d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#4caf50" : "#ffffff", // สีเมื่อเลือก option
      color: state.isSelected ? "#ffffff" : "#333333", // สีตัวอักษรเมื่อเลือก
      padding: "0.5rem", // ขนาด padding ของแต่ละ option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // สีของ placeholder
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
  };

  useEffect(() => {
    console.log(Employee);
  }, [Employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Employee);

    const isDuplicate = data.some((item) => item.id === Employee.value);
    if (isDuplicate) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ชื่อเจ้าหน้านี้ในโปรเจคนี้อยู่แล้ว",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: type
        ? `ยืนยันการบันทึกข้อมูล : ${Employee.label}`
        : `ยืนยันการแก้ไขข้อมูล : ${Employee.label}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");
        console.log(id_year);
        if (type == 1) {
          const res = await AddprojectuserNew(
            token,
            Employee.value,
            id_project,
            2,
            id_year
          );
          // console.log(res);
          if (res.status === 200 || res.status === 201) {
            onSelectuser({
              label: Employee.label,
              value: res.data.value,
              id: res.data.id_project_user,
              position: Employee.position,
            });
            Swal.fire({
              title: "สำเร็จ",
              text: `เพิ่มผู้รับผิดชอบระดับบริหาร ${Employee.label}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        } else {
          const res = await Editprojectuser(
            token,
            idUserProject,
            Employee.value
          );
          console.log(res);
          if (res.status === 200 || res.status === 201) {
            onSelectuser({
              label: Employee.label,
              value: res.data.id_user,
              id: res.data.id_project_user,
              position: Employee.position,
            });
            Swal.fire({
              title: "สำเร็จ",
              text: `แก้ไข​ผู้รับผิดชอบระดับปฏิบัติใหม่เป็น ${Employee.label}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            }).then(() => {
              onClose();
            });
          }
        }
      } else {
        onClose();
      }
    });
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 w-full h-full bg-gray-500/60 bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        data-aos="fade-down"
        className="relative p-4 w-full max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {type === 1
                ? "เพิ่มผู้รับผิดชอบระดับบริหารใหม่"
                : "แก้ไขผู้รับผิดชอบระดับบริหาร"}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="Strategic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {type === 1
                    ? "ผู้รับผิดชอบระดับปฏิบัติ"
                    : "ผู้รับผิดชอบระดับนโยบาย / บริหาร  "}
                </label>
                <Select
                  value={
                    user.find((option) => option.value === Employee) || Employee
                  }
                  onChange={(e) => setSelectedEmployee(e)}
                  options={user} // ตัวเลือกทั้งหมด
                  getOptionLabel={(e) => `${e.label} ${e.position || ""}`} // label ที่โชว์
                  getOptionValue={(e) => e.value}
                  styles={customStyles}
                  className="text-sm"
                  placeholder={
                    type === 1
                      ? "กรุณาเลือกผู้รับผิดชอบระดับปฏิบัติ"
                      : "กรุณาเลือกผู้รับผิดชอบระดับนโยบาย / บริหาร  "
                  } // ข้อความ placeholder
                />
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="submit"
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

export function ModalAddindicatorNew({
  isOpen,
  onClose,
  type,
  indicator,
  unit,
  oldindicator,
  onSelectindicator,
}) {
  if (!isOpen) return null;

  // const [actionplanName, setActionplanName] = useState("");
  const [dataIndicator, setdataIndicator] = useState({
    indicator_name: null,
    unit_name: null,
    goal: null,
  });
  //   const [Oldactionplan, setoldactionplan] = useState(oleindicator);

  useEffect(() => {
    console.log(dataIndicator);
  }, [dataIndicator]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(type);
    const requiredFields = {
      indicator_name: "ตัวชี้วัด",
      //   unit_name: "หน่วยนับ",
      goal: "ค่าเป้าหมาย",
    };

    // Object.entries(requiredFields))  แปลงเป็น [[],[]]
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!dataIndicator[field] || dataIndicator[field].trim() === "") {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: `กรุณากรอกข้อมูลช่อง ${label} ให้ครบถ้วน`,
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        return;
      }
    }
    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: type
        ? `ยืนยันการบันทึกข้อมูล : ${dataIndicator.indicator_name}`
        : `ยืนยันการแก้ไขข้อมูล : ${dataIndicator.indicator_name}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // console.log("Submitted Strategic Name: ", position);

        // เพิ่มหรือส่งข้อมูลกลับ
        // เช่น: onSave(position);

        // if (_.isEqual(Oldactionplan, selectedStrategic)) {
        //   Swal.fire({
        //     title: "เกิดข้อผิดพลาด",
        //     text: "ไม่สามารถแก้ไข OKR เป็นค่าเดิมได้",
        //     icon: "error",
        //     confirmButtonText: "ตกลง",
        //   });
        //   return;
        // }
        // if (dataIndicator.indicator_name.trim() !== "") {
        //   onSelectOkr(selectedStrategic);
        // }
        onSelectindicator(dataIndicator);
        onClose();

        // onClose(); // ปิด modal ถ้าต้องการ
      }
    });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f9fafb", // สีพื้นหลังที่ต้องการ
      borderColor: "#d1d5db", // สีของขอบ
      padding: "0.125rem", // ขนาด padding
      borderRadius: "0.375rem", // ขอบมุมโค้ง
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff", // สีพื้นหลังของ dropdown
      borderColor: "#d1d5db",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#4caf50" : "#ffffff", // สีเมื่อเลือก option
      color: state.isSelected ? "#ffffff" : "#333333", // สีตัวอักษรเมื่อเลือก
      padding: "0.5rem", // ขนาด padding ของแต่ละ option
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // สีของ placeholder
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed top-0 left-0 w-full h-full bg-gray-500/60 bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        data-aos="fade-down"
        className="relative p-4 w-full max-w-xl max-h-full"
      >
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {type === 1
                ? "เพิ่มตัวชี้วัดและค่าเป้าหมายของโครงการ/กิจกรรมใหม่"
                : "แก้ไขตัวชี้วัดและค่าเป้าหมายของโครงการ/กิจกรรม"}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="Strategic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ตัวชี้วัด
                </label>
                <input
                  type="text"
                  value={dataIndicator.indicator_name || ""}
                  onChange={(e) =>
                    setdataIndicator((prev) => ({
                      ...prev,
                      indicator_name: e.target.value,
                    }))
                  }
                  placeholder="กรุณากรอกชื่อตัวชี้วัด"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label
                  htmlFor="Strategic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  หน่วยนับ
                </label>
                <Select
                  value={dataIndicator.unit_name}
                  onChange={(selectedOption) =>
                    setdataIndicator((prev) => ({
                      ...prev,
                      unit_name: selectedOption, // หรือ selectedOption.value ถ้าต้องการเก็บแค่ value
                    }))
                  }
                  options={unit}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  styles={customStyles}
                  className="text-sm"
                  placeholder="กรุณาเลือกหน่วยนับ"
                />
              </div>
              <div>
                <label
                  htmlFor="Strategic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ค่าเป้าหมายของโครงการ/กิจกรรม
                </label>
                <input
                  type="number"
                  value={dataIndicator.goal || ""}
                  onChange={(e) =>
                    setdataIndicator((prev) => ({
                      ...prev,
                      goal: e.target.value,
                    }))
                  }
                  placeholder="กรุณากรอกค่าเป้าหมายของโครงการ/กิจกรรม"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="submit"
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
