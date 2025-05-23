"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import Menu from "../../component/nav";
import Header from "../../component/header";
import Cookies from "js-cookie";

export default function addProject() {
  const [projectData, setprojectData] = useState({
    id: "",
    number: "",
    name: "",
    budget: 0,
    spend_money: 0,
    start: "",
    end: "",
    today: new Date().toISOString().split("T")[0],
  });
  const [fullname, setfullname] = useState("");
  useEffect(() => {
    const data = sessionStorage.getItem("project_data");
    if (!data) {
      window.location.href = `/user/project`;
    } else {
      const parsed = JSON.parse(data);
      setprojectData((prev) => ({
        ...prev,
        ...parsed,
        today: prev.today || new Date().toISOString().split("T")[0], // fallback ถ้า prev ไม่มี
      }));
    }
    const fullname = Cookies.get("fullname");
    setfullname(fullname);
  }, []);

  const handleChange_spendMoney = (e) => {
    const raw = e.target.value.replace(/,/g, ""); // ลบ comma
    const numberValue = parseFloat(raw);
    if (!isNaN(numberValue)) {
      setprojectData((prev) => ({ ...prev, spend_money: numberValue }));
    } else if (raw === "") {
      setprojectData((prev) => ({ ...prev, spend_money: 0 }));
    }
  };

  const periods = [
    { id: "q1", label: "ต.ค.-ธ.ค. 67", start: "2024-10-01", end: "2024-12-31" },
    {
      id: "q2",
      label: "ม.ค.-มี.ค. 68",
      start: "2025-01-01",
      end: "2025-03-31",
    },
    {
      id: "q3",
      label: "เม.ย.-มิ.ย. 68",
      start: "2025-04-01",
      end: "2025-06-30",
    },
    {
      id: "q4",
      label: "ก.ค.-ก.ย. 68",
      start: "2025-07-01",
      end: "2025-09-30",
    },
  ];
  // const start = "2024-10-01"; // จาก backend
  // const end = "2025-12-31";
  const isPeriodSelected = (periodStart, periodEnd) => {
    return projectData.start <= periodEnd && projectData.end >= periodStart;
  };
  const selectedPeriods = periods.filter((p) =>
    isPeriodSelected(p.start, p.end)
  );
  return (
    <>
      <div className="">
        <Header />
        <hr />
        <div className="grid grid-cols-10 gap-4 w-full min-h-screen mt-20">
          <div className="bg-gray-100 col-span-2 xl:col-span-2 hidden md:block md:col-span-2 pt-4 ps-3">
            <Menu />
          </div>
          <div className="col-span-10 xl:col-span-8  md:col-span-8  mt-5 md:mt-3 ms-8 md:ms-0 me-8">
            <div className="flex flex-row items-start justify-between w-full mt-2">
              <div className="text-lg md:text-lg me-4">
                รายงานผลการดำเนินงานโครงการกิจกรรมตามแผนปฏิบัติการประจำปีงบประมาณ
                พ.ศ. 2568
              </div>
              <div>
                <a
                  href="/user/project/report/add_report"
                  className="bg-blue-500  px-6 py-3 rounded-xl text-sm text-white whitespace-nowrap"
                >
                  รายงานผล
                </a>
              </div>
            </div>
            <div className="grid grid-cols-9 gap-x-8 gap-y-6 mt-3">
              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  รหัสโครงการ
                </span>
                <input
                  type="text"
                  id="project_number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="รหัสโครงการ"
                  readOnly
                  value={`CP1-${projectData.number}-1.1`}
                />
              </div>
              <div className="col-span-9 md:col-span-6">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  ชื่อโครงการ
                </span>
                <input
                  type="text"
                  id="project_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ชื่อโครงการ"
                  readOnly
                  value={`${projectData.name}`}
                />
              </div>
              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  ผู้รับผิดชอบระดับนโยบาย
                </span>
                <input
                  type="text"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกชื่อผู้รับผิดชอบ"
                  required
                />
              </div>

              <div className="col-span-9 md:col-span-6 xl:col-span-3">
                <div className="flex flex-col ">
                  <div className="flex flex-row justify-between mb-0.5">
                    <h2>วันที่ดำเนินการ </h2>
                  </div>

                  <div className="flex flex-row">
                    <div
                      id="date-range-picker"
                      date-rangepicker="true"
                      className="flex items-center"
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg
                            className="w-3 md:w-4 h-4 text-gray-500 dark:text-gray-400"
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
                          value={projectData.start || ""}
                          onChange={(e) =>
                            setprojectData((prev) => ({
                              ...prev,
                              start: e.target.value,
                            }))
                          }
                          className="bg-gray-50 ps-6 md:ps-8 xl:ps-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date start"
                        />
                      </div>
                      <span className="mx-2 text-gray-500">to</span>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg
                            className="w-3 md:w-4 h-4 text-gray-500 dark:text-gray-400"
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
                          value={projectData.end || ""}
                          onChange={(e) =>
                            setprojectData((prev) => ({
                              ...prev,
                              end: e.target.value,
                            }))
                          }
                          className="bg-gray-50  ps-6 md:ps-8 xl:ps-10  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date end"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  สถานที่ดำเนินการ
                </span>
                <input
                  type="text"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกสถานที่ดำเนินการ"
                  required
                />
              </div>

              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  ผู้รายงานข้อมูล
                </span>
                <input
                  type="text"
                  id="fullname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ผู้รายงานข้อมูล"
                  readOnly
                  value={fullname}
                />
              </div>

              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  งบประมาณ
                </span>
                <input
                  type="text"
                  id="budget"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  readOnly
                  value={
                    projectData.budget !== undefined
                      ? parseFloat(projectData.budget).toLocaleString("th-TH")
                      : "0"
                  }
                />
              </div>

              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  งบประมาณใช้จริง
                </span>
                <input
                  type="text"
                  id="spend_money"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@flowbite.com"
                  value={
                    projectData.spend_money !== undefined
                      ? projectData.spend_money.toLocaleString("th-TH")
                      : "0"
                  }
                  onChange={handleChange_spendMoney}
                />
              </div>
              <div className="col-span-9 md:col-span-3">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  งบประมาณคงเหลือ
                </span>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@flowbite.com"
                  readOnly
                  value={
                    projectData.spend_money !== undefined &&
                    projectData.budget > projectData.spend_money
                      ? (
                          projectData.budget - projectData.spend_money
                        ).toLocaleString("th-TH")
                      : "0"
                  }
                />
              </div>
              <div className="col-span-9 md:col-span-6 xl:col-span-3">
                <div className="flex flex-col ">
                  <div className="flex flex-row justify-between mb-0.5">
                    <h2>วันที่รายงาน </h2>
                  </div>

                  <div
                    id="date-range-picker"
                    date-rangepicker="true"
                    className="flex items-center"
                  >
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-3 md:w-4 h-4 text-gray-500 dark:text-gray-400"
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
                        name="today"
                        type="date"
                        value={projectData.today || ""}
                        readOnly
                        className="bg-gray-50 ps-6 md:ps-8 xl:ps-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select date start"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-9 ">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  ลักษณะการจัดกิจกรรม
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกรายละเอียดการจัดกิจกรรม..."
                ></textarea>
              </div>

              <div className="col-span-9 md:col-span-9">
                <div className="flex flex-col ">
                  <div className="flex flex-row justify-between mb-2">
                    <h2>Link ข่าว ภาพ รายละเอียด (ถ้ามี) </h2>
                    <button
                      type="button"
                      className=" top-9 right-2 bg-blue-500 text-white text-sm px-4 py-1 rounded-lg hover:bg-blue-600"
                    >
                      เพิ่ม
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id="objective"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="ไฟล์"
                      readOnly
                    />
                    <button
                      type="button"
                      className="absolute top-1.5 right-2 bg-blue-500 text-white text-sm px-4 py-1 rounded-lg hover:bg-blue-600"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-9">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  วันที่รายงาน
                </span>

                <div className="flex flex-row justify-start items-center">
                  {periods.map((p) => (
                    <div key={p.id} className="flex items-center ms-4">
                      <input
                        type="checkbox"
                        id={p.id}
                        readOnly
                        checked={isPeriodSelected(p.start, p.end)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                      />
                      <label
                        htmlFor={p.id}
                        className="ms-2 text-sm text-gray-900"
                      >
                        {p.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-9 mt-4 flex flex-row justify-end">
                <button
                  type="button"
                  className="bg-blue-500 text-white text-sm px-16 py-3 rounded-lg hover:bg-blue-600"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
