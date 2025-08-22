"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import Menu from "../../component/nav_admin";
import Header from "../../component/header";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import { FiEdit2 } from "react-icons/fi";
import "bootstrap-icons/font/bootstrap-icons.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "./loading";
import Cookies from "js-cookie";
import {
  GetDataunitUse,
  GetDataokr,
  AddDataPosition,
  EditDatadePosition,
} from "../../../fetch_api/fetch_api_superadmin";
export default function addProject() {
  const [dataAddNewokr, setdataAddNewokr] = useState({
    id: null,
    name: null,
    number: null,
    year: null,
    user_teacher: null,
    user_employee: null,
    start_date: "",
    end_date: "",
    goal: null,
    result: null,
    report_data: null,
    id_unit: null,
    id_year: null,
    url: "",
  });

  // const [selecteddeparment, setSelecteddeparment] = useState(null);

  // const handleChange = (selectedOption) => {
  //   setSelecteddeparment(selectedOption);
  // };

  // การใช้ const [isMounted, setIsMounted] = useState(false) เป็นเทคนิคสำคัญในการแก้ไขปัญหา Hydration Error
  const [isMounted, setIsMounted] = useState(false);

  // สำหรับโค้ดที่ต้องรอให้โหลดในเบราว์เซอร์ก่อน

  // useEffect(() => {
  //   const data = sessionStorage.getItem("okr_detail");
  //   if (!data) {
  //     window.location.href = `/superadmin/okr`;
  //   }
  //   if (data) {
  //     const parsed = JSON.parse(data);
  //     // console.log(parsed);
  //     setdataAddNewokr((prev) => ({
  //       ...prev,
  //       id: parsed.id,
  //       name: parsed.name,
  //       year: parsed.year,
  //       id_year: parsed.id_year,
  //       user_teacher: parsed.user_teacher,
  //       user_employee: parsed.user_employee,
  //       start_date: parsed.start_date?.slice(0, 10),
  //       end_date: parsed.end_date?.slice(0, 10),
  //       goal: parsed.goal,
  //       result: parsed.result,
  //       report_data: parsed.report_data,
  //       id_unit: parsed.id_unit,
  //     }));
  //   }

  //   setIsMounted(true); // ตั้งค่าเป็น true เมื่อคอมโพเนนต์ถูก mount แล้วบน client
  // }, []);

  const columns_useremployee = [
    {
      name: "ลำดับ",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.name,
      // sortable: true,
      wrap: true,
    },
    {
      name: "ตำแหน่ง",
      selector: (row) => row.position || "",
      // sortable: true,
      wrap: true,
    },
    {
      name: "จัดการ",
      cell: (row) => (
        <>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() =>
                setdataAddNewProject((prev) => ({
                  ...prev,
                  employee: prev.employee.filter((item) => item.id !== row.id),
                }))
              } // เรียกใช้ฟังก์ชัน handleDelete เมื่อกดปุ่ม
            >
              <i className="bi bi-trash text-xl group-hover:text-red-500"></i>{" "}
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];
  const columns_userteacher = [
    {
      name: "ลำดับ",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.name,
      // sortable: true,
      wrap: true,
    },
    {
      name: "ตำแหน่ง",
      selector: (row) => row.position || "",
      // sortable: true,
      wrap: true,
    },
    {
      name: "จัดการ",
      cell: (row) => (
        <>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() =>
                setdataAddNewProject((prev) => ({
                  ...prev,
                  teacher: prev.teacher.filter((item) => item.id !== row.id),
                }))
              } // เรียกใช้ฟังก์ชัน handleDelete เมื่อกดปุ่ม
            >
              <i className="bi bi-trash text-xl group-hover:text-red-500"></i>{" "}
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];
  const customStylesTable = {
    headCells: {
      style: {
        backgroundColor: "#f0f0f0", // สีพื้นหลังหัวตาราง
        color: "#1f2937", // สีตัวอักษร (เทาเข้ม)
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };
  useEffect(() => {
    async function fethData() {
      const data = sessionStorage.getItem("okr_detail");
      const parsed = JSON.parse(data);
      if (!data) {
        window.location.href = `/superadmin/okr`;
      }
      const token = Cookies.get("token");
      const res_unit = await GetDataunitUse(token);
      console.log(res_unit);
      const mappedunitOptions = res_unit.map((item) => ({
        value: item.unit_id,
        label: `${item.unit_name}  `,
      }));
      setOptionsUnit(mappedunitOptions);

      const res_okr = await GetDataokr(token, parsed.id);
      console.log(res_okr);

      setdataAddNewokr((prev) => ({
        ...prev,
        id: res_okr.id,
        name: res_okr.okr_name,
        number: res_okr.okr_number,
        year: res_okr.year.year,
        id_year: res_okr.id_year,
        user_teacher: res_okr.user_teacher,
        user_employee: res_okr.user_employee,
        start_date: res_okr.start_date?.slice(0, 10),
        end_date: res_okr.end_date?.slice(0, 10),
        goal: res_okr.goal,
        result: res_okr.result,
        report_data: res_okr.report_data,
        id_unit: res_okr.id_unit,
      }));
    }
    setIsMounted(true);
    fethData();
  }, []);
  const [optionsUnit, setOptionsUnit] = useState([]);
  // useEffect(() => {
  //   console.log(dataAddNewokr);
  // }, [dataAddNewokr]);
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white", // สีพื้นหลังที่ต้องการ
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

  const [optionsprinciples, setoptionsprinciples] = useState([
    {
      value: "1",
      label: "ไตรมาสที่ 1  ",
    },
    {
      value: "2",
      label: "ไตรมาสที่ 2  ",
    },
    {
      value: "3",
      label: "ไตรมาสที่ 3  ",
    },
    {
      value: "4",
      label: "ไตรมาสที่ 4  ",
    },
  ]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: type == 1 ? "ยืนยันการบันทึกข้อมูล ?" : "ยืนยันการแก้ไขข้อมูล ?",
      text: position ? `ชื่อตำแหน่ง: ${position}` : "",
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
        // if (Oldposition === position) {
        //   Swal.fire({
        //     title: "เกิดข้อผิดพลาด",
        //     text: "ไม่สามารถแก้ไขตำแหน่งเป็นค่าเดิมได้",
        //     icon: "error",
        //     confirmButtonText: "ตกลง",
        //   });
        //   return;
        // }
        try {
          const token = Cookies.get("token");

          let response;
          if (type == 1) {
            response = await AddDataPosition(token, position);
          } else {
            // console.log(data.id)
            response = await EditDatadePosition(token, position, data.id);
          }

          // if(response)
          console.log(response);
          if (response) {
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
  return (
    <>
      <Suspense fallback={<Loading />}>
        {isMounted && (
          <form className="" onSubmit={handleSubmit}>
            <Header />
            <hr />
            <div className="grid grid-cols-12  gap-0 w-full min-h-screen mt-20">
              <div className="bg-gray-100  xl:col-span-2 hidden md:block md:col-span-3 pt-4 ps-3">
                <Menu />
              </div>
              <div className="col-span-12 xl:col-span-10  border border-gray-300 rounded-lg  md:col-span-9 mt-5 ms-4 md:mt-3 me-4 md:me-6">
                <div className="flex flex-row items-center justify-between  py-4 px-8">
                  <div className="text-lg md:text-3xl">
                    รายงานผลการดำเนินงานตามข้อตกลงการปฏิบัติงานสู่ความเป็นเลิศ
                    (OKRs) {dataAddNewokr.year}
                  </div>
                </div>
                <hr className="w-full border-gray-300" />
                <div className="grid grid-cols-12 gap-x-8 gap-y-6 mt-3  py-4 px-8">
                  <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      รหัส OKRs :
                    </span>
                    <input
                      type="text"
                      id="nameproject"
                      className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกชื่อโครงการ"
                      required
                      value={dataAddNewokr.number || ""}
                      readOnly
                      // onChange={(e) =>
                      //   setdataAddNewokr({
                      //     ...dataAddNewokr,
                      //     number: e.target.value,
                      //   })
                      // }
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      OKRs :
                    </span>
                    <input
                      type="text"
                      id="nameproject"
                      className="bg-white  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกชื่อโครงการ"
                      required
                      value={dataAddNewokr.name || ""}
                      onChange={(e) =>
                        setdataAddNewokr({
                          ...dataAddNewokr,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      ปีงบประมาณ
                    </span>
                    <input
                      type="text"
                      id="idproject"
                      className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="ปีงบประมาณ"
                      readOnly
                      value={dataAddNewokr.year || ""}
                    />
                  </div>
                  {/* <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      ผู้รับผิดชอบระดับบริหาร/นโยบาย :
                    </span>
                    <input
                      type="text"
                      id="location"
                      className="bg-white  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกสถานที่"
                      value={dataAddNewokr.user_teacher || ""}
                      readOnly
                    />
                  </div> */}
                  {/* <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      ผู้รับผิดชอบระดับปฏิบัติการ :
                    </span>
                    <input
                      type="text"
                      id="price"
                      className="bg-white  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกงบประมาณ"
                      value={dataAddNewokr.user_employee || ""}
                      readOnly
                    />
                  </div> */}
                  <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      กำหนดให้รายงานข้อมูล :
                    </span>
                    <div className="flex flex-row">
                      <div
                        id="date-range-picker"
                        date-rangepicker="true"
                        className="flex items-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>
                          <input
                            id="datepicker-range-start"
                            name="start"
                            type="date"
                            className="bg-white  xl:w-64 md:w-38 w-38 shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-40 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date start"
                            value={dataAddNewokr.start_date ?? ""}
                            onChange={(e) =>
                              setdataAddNewokr({
                                ...dataAddNewokr,
                                start_date: e.target.value,
                              })
                            }
                            // readOnly
                          />
                        </div>
                        <span className="mx-4 text-gray-500">to</span>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>
                          <input
                            id="datepicker-range-end"
                            name="end"
                            type="date"
                            className="bg-gray-50 xl:w-64 md:w-38 w-38 shadow-md  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block  ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date end"
                            min={dataAddNewokr.start_date || ""}
                            disabled={!dataAddNewokr.start_date}
                            value={dataAddNewokr.end_date ?? ""}
                            onChange={(e) =>
                              setdataAddNewokr({
                                ...dataAddNewokr,
                                end_date: e.target.value,
                              })
                            }
                            // readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label
                      htmlFor="deparment"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ค่าเป้าหมาย :
                    </label>

                    <input
                      type="number"
                      id="price"
                      className="bg-white shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกค่าเป้าหมาย"
                      value={dataAddNewokr.goal ?? ""}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const numericValue = parseFloat(rawValue);
                        if (!isNaN(numericValue)) {
                          setdataAddNewokr((prev) => ({
                            ...prev,
                            goal: numericValue,
                          }));
                        } else {
                          setdataAddNewokr((prev) => ({
                            ...prev,
                            goal: "",
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label
                      htmlFor="deparment"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      ผลการดำเนินงาน :
                    </label>

                    <input
                      type="text"
                      id="price"
                      className="bg-white  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกงบประมาณ"
                      value={
                        dataAddNewokr.result
                          ? Number(dataAddNewokr.result).toLocaleString("th-TH")
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, ""); // เอา , ออกก่อนเก็บ
                        if (!isNaN(rawValue)) {
                          setdataAddNewokr({
                            ...dataAddNewokr,
                            result: rawValue,
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      หน่วยนับ
                    </span>

                    <Select
                      value={optionsUnit.find(
                        (item) => item.value == dataAddNewokr.id_unit
                      )}
                      onChange={(selectedOption) =>
                        setdataAddNewokr((prev) => ({
                          ...prev,
                          unit_name: selectedOption, // หรือ selectedOption.value ถ้าต้องการเก็บแค่ value
                        }))
                      }
                      options={optionsUnit}
                      getOptionLabel={(e) => e.label}
                      getOptionValue={(e) => e.value}
                      styles={customStyles}
                      className="text-sm "
                      placeholder="กรุณาเลือกหน่วยนับ"
                    />
                  </div>
                  <div className="col-span-12">
                    <label
                      htmlFor="deparment"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Link ข้อมูลรายละเอียด
                    </label>

                    <input
                      type="text"
                      id="url"
                      className="bg-white   shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="กรุณากรอกงบประมาณ"
                      required
                      value={
                        dataAddNewokr.price
                          ? Number(dataAddNewokr.price).toLocaleString("th-TH")
                          : ""
                      }
                      onChange={(e) => {
                        setdataAddNewokr((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  {/* 
                  <div className="col-span-12">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      ระบุวันที่รายงานผล
                    </span>

                    <div className="grid grid-cols-12 gap-4  ">
                      {optionsprinciples.map((item, index) => (
                        <div
                          key={item.value}
                          className="col-span-12 flex items-start md:items-center gap-8 "
                        >
                          <div className="flex items-start gap-2 md:gap-4">
                            <input
                              id={`checkbox-${item.value}`}
                              type="checkbox"
                              checked={dataAddNewokr.start_date.includes(
                                item.value
                              )}
                              readOnly
                            
                              className="w-6 h-6 text-gray-400 border-2 border-gray-400 rounded-sm focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`checkbox-${item.value}`}
                              className="text-sm leading-6"
                            >
                              {item.label} ภายในวันที่ 15 / 05 / 67
                            </label>
                          </div>
                          <div className=" px-3 py-1 text-sm rounded md:min-w-[240px] text-right">
                            ผู้รายงานข้อมูล keng apipath

                          </div>
                        </div>
                      ))}
                    </div>
                  </div> */}
                  <div className="col-span-12 mt-4">
                    <hr className="text-gray-200" />
                  </div>
                  <div className="col-span-12">
                    <div className="flex flex-col ">
                      <div className="flex flex-row justify-between mb-2">
                        <h2>ผู้รับผิดชอบระดับปฏิบัติ </h2>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpenModalUserAdd(true);
                            setTypeuser(1);
                          }}
                          className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                        >
                          เพิ่ม
                        </button>
                      </div>

                      <div className="relative">
                        <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                          <DataTable
                            columns={columns_useremployee}
                            data={dataAddNewokr.employee}
                            customStyles={customStylesTable}
                            fixedHeaderScrollHeight="100%"
                            noDataComponent={
                              <div className="text-gray-500 py-4 text-center">
                                ยังไม่เพิ่มข้อมูลผู้รับผิดชอบระดับปฏิบัติ
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 mt-4">
                    <hr className="text-gray-200" />
                  </div>
                  <div className="col-span-12">
                    <div className="flex flex-col ">
                      <div className="flex flex-row justify-between mb-2">
                        <h2>ผู้รับผิดชอบระดับนโยบาย / บริหาร </h2>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpenModalUserAdd(true);
                            setTypeuser(2);
                          }}
                          className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                        >
                          เพิ่ม
                        </button>
                      </div>

                      <div className="relative">
                        <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                          <DataTable
                            columns={columns_userteacher}
                            data={dataAddNewokr.teacher}
                            customStyles={customStylesTable}
                            fixedHeaderScrollHeight="100%"
                            noDataComponent={
                              <div className="text-gray-500 py-4 text-center">
                                ยังไม่เพิ่มข้อมูลผู้รับผิดชอบระดับนโยบาย /
                                บริหาร
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 mt-4 flex flex-row justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white text-sm px-24 py-2.5 rounded-md hover:bg-blue-600"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Suspense>
    </>
  );
}
