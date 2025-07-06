"use client";

import Menu from "./component/nav_admin";
import { useState, useEffect } from "react";
import Header from "./component/header";
import dynamic from "next/dynamic";
import Select from "react-select";
import Cookies from "js-cookie";
import {
  GetDatayear,
  GetDatadepartmentall,
  GetDashboardProject,
  GetDashboardPie,
  GetDashboardLineDepartment,
  GetDatadepartmentUse,
  GetDatastyleUse,
  GetDataOkrUse,
  GetDatastrategicYear,
  GetDataactionplanByYear,
} from "../fetch_api/fetch_api_superadmin";
import "bootstrap-icons/font/bootstrap-icons.css";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Dashboard() {
  const [yearOptions, setyearOptions] = useState([]);
  const [quarterOptions, setQuarterOptions] = useState([
    { value: 0, label: "ทั้งปีงบประมาณ" },
    { value: 1, label: "ไตรมาส 1 (ต.ค. - ธ.ค.)" },
    { value: 2, label: "ไตรมาส 2 (ม.ค. - มี.ค.)" },
    { value: 3, label: "ไตรมาส 3 (เม.ย. - มิ.ย.)" },
    { value: 4, label: "ไตรมาส 4 (ก.ค. - ก.ย.)" },
  ]);

  // const [optionsDeparment, setOptionsDeparment] = useState([]);
  const [departmentOptions, setdepartmentOptions] = useState([]);
  const [optionstype, setoptionstype] = useState([]);
  const [optionsOkr, setoptionsOkr] = useState([]);
  const [optionsStrategic, setoptionsStrategic] = useState([]);
  const [optionsActionplan, setoptionsActionplan] = useState([]);
  const [data, setData] = useState({
    year_id: null,
    quarter: null,
    strategic_id: null,
    actionplan_id: null,
    department_id: null,
    okr_id: null,
    type_id: null,
    project_id: null,
    activity_id: null,
  });
  const [Project, setProject] = useState({
    total: null,
    report: null,
  });
  const [Activity, setActivity] = useState({
    total: null,
    report: null,
  });

  const [Money, setMoney] = useState({
    total: null,
    spend: null,
  });

  const [statePie, setStatePie] = useState({
    // series: [44, 55, 13, 43, 22],
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      // "Team A", "Team B", "Team C", "Team D", "Team E"
      labels: [],
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    if (yearOptions.length > 0 && !data.year_id) {
      console.log(yearOptions[0]);
      const { value, label } = yearOptions[0]; // หรือ .value, .label ถ้าเป็น react-select
      setData((prev) => ({
        ...prev,
        year_id: value,
        // year_label: year,
      }));
      console.log(value);
    }
  }, [yearOptions]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get("token");
        // console.log("token : ", token);
        const res = await GetDatayear(token);
        // console.log("year : ", res.data);
        const mappedYearOptions = res.data.map((item) => ({
          value: item.year_id, // หรือ item.year_id แล้วแต่โครงสร้าง
          label: item.year, // ปรับตาม field ที่แสดงผล
        }));
        console.log(mappedYearOptions);
        setyearOptions(mappedYearOptions);

        // const res_department = await GetDatadepartmentall(token);
        // const mappedDepartmentOptions = res_department.data.map((item) => ({
        //   value: item.departments_id, // หรือ item.year_id แล้วแต่โครงสร้าง
        //   label: item.departments_name, // ปรับตาม field ที่แสดงผล
        // }));
        // setdepartmentOptions(mappedDepartmentOptions);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get("token");
        // console.log("token : ", token);

        if (data.year_id) {
          const res = await GetDashboardProject(token, data.year_id);
          console.log("year : ", res);

          const {
            project_total,
            projects_report,
            activity_total,
            activity_report,
            avalible,
            spend_money,
          } = res;
          setProject((prev) => ({
            ...prev,
            total: project_total,
            report: projects_report,
          }));
          setActivity((prev) => ({
            ...prev,
            total: activity_total,
            report: activity_report,
          }));
          setMoney((prev) => ({
            ...prev,
            total: avalible,
            spend: spend_money,
          }));

          const res_pie = await GetDashboardPie(token, data.year_id);
          const filteredData = res_pie.filter(
            (item) => parseFloat(item.spend_money) >= 0
          );
          setStatePie((prev) => ({
            ...prev,
            series: filteredData.map((item) => parseFloat(item.spend_money)),
            options: {
              ...prev.options,
              chart: {
                ...prev.options.chart,
                width: "100%", // ให้เต็ม container
              },
              labels: filteredData.map(
                (item) =>
                  `${item.strategic_number}: ${item.strategic_name.trim()}`
              ),
              legend: {
                position: "bottom",
                fontSize: "14px",
                itemMargin: {
                  vertical: 4,
                },
              },
              tooltip: {
                y: {
                  formatter: (val) => {
                    return (
                      val.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) + " บาท"
                    );
                  },
                },
              },
            },
          }));

          const res_lineDepartmnet = await GetDashboardLineDepartment(
            token,
            data.year_id
          );
          const departmentLabels = res_lineDepartmnet.department.map((item) =>
            item.departments_name.trim()
          );

          setOptions((prev) => ({
            ...prev,
            xaxis: {
              categories: departmentLabels,
            },
          }));

          const res_Deparment = await GetDatadepartmentUse(token);
          const mappedDeparmentOptions = res_Deparment.map((item) => ({
            value: item.departments_id,
            label: item.departments_name,
          }));
          setdepartmentOptions(mappedDeparmentOptions);

          const res_style = await GetDatastyleUse(token);
          // console.log(res_teacher);
          const mappedstyleOptions = res_style.map((item) => ({
            value: item.style_id,
            label: `${item.style_name}  `,
          }));
          setoptionstype(mappedstyleOptions);

          const res_Okr = await GetDataOkrUse(token, data.year_id);
          const mappedOkrOptions = res_Okr.map((item) => ({
            value: item.okr_id,
            label: `${item.okr_number} : ${item.okr_name}`,
          }));
          setoptionsOkr(mappedOkrOptions);

          const res_strategic = await GetDatastrategicYear(token, data.year_id);
          const mappedStrategicOptions = res_strategic.data.map((item) => ({
            value: item.strategic_id,
            label: `${item.strategic_number} : ${item.strategic_name}`,
          }));
          setoptionsStrategic(mappedStrategicOptions);

          const res_actionplan = await GetDataactionplanByYear(
            token,
            data.year_id
          );
          const mappedActionplanOptions = res_actionplan.data.map((item) => ({
            value: item.action_plan_id,
            label: `${item.action_plan_number} : ${item.name_ap}`,
            id_strategic: item.id_strategic,
          }));
          // console.log(mappedActionplanOptions)
          setoptionsActionplan(mappedActionplanOptions);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, [data.year_id]);

  const [options, setOptions] = useState({
    // const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true, // เพิ่มเครื่องมือดาวน์โหลด
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // แนวตั้ง
        columnWidth: "55%",
        borderRadius: 5, // โค้งมนด้านบน
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false, // ซ่อนค่าบนแท่งกราฟ
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"], // โปร่งแสงขอบ
    },
    xaxis: {
      categories: [
        // "มกราคม",
        // "กุมภาพันธ์",
        // "มีนาคม",
        // "เมษายน",
        // "พฤษภาคม",
        // "มิถุนายน",
        // "กรกฎาคม",
        // "สิงหาคม",
        // "กันยายน",
        // "ตุลาคม",
        // "พฤศจิกายน",
        // "ธันวาคม",
      ],
      title: {
        text: "ปี-เดือน", // ชื่อแกน X
      },
    },
    yaxis: {
      title: {
        text: "จำนวน", // ชื่อแกน Y
      },
    },
    fill: {
      opacity: 1, // ความโปร่งใสของแท่งกราฟ
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "" + val + " จำนวน"; // แสดงหน่วย $ ใน Tooltip
        },
      },
    },
    colors: ["#1E90FF", "#FF6347", "#32CD32"], // สีของแต่ละซีรีส์
    legend: {
      position: "top", // ตำแหน่ง Legend
      horizontalAlign: "center", // จัดกึ่งกลาง
    },
  });

  const series = [
    {
      name: "โครงการ",
      data: ["1", "2", "3", "4"],
    },
    {
      name: "กิจกรรม",
      data: ["3", "6", "7", "8"],
    },
  ];

  const options_line = {
    chart: {
      type: "line", // เปลี่ยนเป็น line
      height: 350,
      toolbar: {
        show: true, // แสดงเครื่องมือดาวน์โหลดและจัดการกราฟ
      },
    },
    markers: {
      size: 6, // ขนาดของจุด
      shape: "circle", // เปลี่ยนเป็นวงกลม
      strokeWidth: 2, // ความหนาของเส้นรอบวง
      strokeColors: "#fff", // สีของเส้นรอบจุด
      fillOpacity: 1, // ความโปร่งแสงของจุด
      hover: {
        size: 8, // ขนาดของจุดเมื่อเมาส์วาง
      },
    },
    dataLabels: {
      enabled: true, // แสดงค่าบนจุดของเส้น
    },
    stroke: {
      curve: "smooth", // เพิ่มความโค้งมนให้เส้น
      width: 3, // ความหนาของเส้น
      colors: ["#1E90FF", "#FF6347", "#32CD32"], // สีของแต่ละซีรีส์
    },
    xaxis: {
      categories: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
      title: {
        text: "ปี-เดือน", // ชื่อแกน X
      },
    },
    yaxis: {
      title: {
        text: "จำนวน", // ชื่อแกน Y
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "" + val + " จำนวน"; // หน่วย $ ใน Tooltip
        },
      },
    },
    colors: ["#1E90FF", "#FF6347", "#32CD32"], // สีของแต่ละซีรีส์
    legend: {
      position: "top", // ตำแหน่ง Legend
      horizontalAlign: "center", // จัดให้อยู่ตรงกลาง
    },
  };

  // const [optionsStrategic, setoptionsStrategic] = useState([
  //   { value: "S1", label: "S1 : ยุทธศาสตร์ด้านการจัดการศึกษา" },
  //   { value: "S2", label: "S2 : ยุทธศาสตร์ด้านการวิจัย" },
  //   {
  //     value: "S3",
  //     label: "S3 : ยุทธศาสตร์ด้านการบริการวิชาการเพื่อสร้างประโยชน์ให้สังคม",
  //   },
  // ]);

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // ตั้งค่าเป็น true เมื่อคอมโพเนนต์ถูก mount แล้วบน client
  }, []);

  return (
    <>
      {isMounted && (
        <div className="">
          <Header />
          <hr />
          <div className="grid grid-cols-12  gap-0 w-full min-h-screen mt-20">
            <div className="bg-gray-100  xl:col-span-2 hidden md:block md:col-span-3 pt-4 ps-3">
              <Menu />
            </div>
            <div className="col-span-12 xl:col-span-10  md:col-span-9 mt-5 ms-4 md:mt-3 me-4 md:me-6">
              <div className="flex flex-col">
                <div className="grid grid-cols-12 gap-4 w-full mb-8">
                  <div className="col-span-12 md:col-span-6 md:ms-0  xl:col-span-3">
                    {" "}
                    <div
                      className="grid grid-cols-6 p-6 bg-white rounded-xl border
        border-gray-400 shadow-xl "
                    >
                      <div className="col-span-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="bi bi-kanban-fill text-2xl"></i>
                        </div>
                      </div>

                      <div className="col-span-4">
                        <div className="flex flex-col items-start">
                          <div className="text-md font-medium">
                            โครงการที่ดำเนินการ
                          </div>
                          {Project.total && (
                            <div className="text-md font-semibold">
                              {Project.report} / {Project.total} โครงการ
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 md:ms-0  xl:col-span-3">
                    {" "}
                    <div
                      className="grid grid-cols-6 p-6 bg-white rounded-xl border
        border-gray-400 shadow-xl "
                    >
                      <div className="col-span-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="bi bi-calendar-check-fill text-2xl"></i>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="flex flex-col items-start">
                          <div className="text-md font-medium">
                            กิจกรรมที่ดำเนินการ
                          </div>
                          {Activity.total && (
                            <div className="text-md font-semibold">
                              {Activity.report} / {Activity.total} กิจกรรม
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 md:ms-0  xl:col-span-3">
                    {" "}
                    <div
                      className="grid grid-cols-6 p-6 bg-white rounded-xl border
        border-gray-400 shadow-xl "
                    >
                      <div className="col-span-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="bi bi-cash-stack text-3xl"></i>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="flex flex-col items-start">
                          <div className="text-md font-medium">
                            งบประมาณที่ใช้ไป
                          </div>
                          {Money.spend && (
                            <div className="text-md font-semibold">
                              {Number(Money.spend).toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              บาท
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 md:ms-0  xl:col-span-3">
                    {" "}
                    <div
                      className="grid grid-cols-6 p-6 bg-white rounded-xl border
        border-gray-400 shadow-xl "
                    >
                      <div className="col-span-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="bi bi-wallet2 text-3xl"></i>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="flex flex-col items-start">
                          <div className="text-md font-medium">
                            งบประมาณคงเหลือ
                          </div>
                          {Money.total && (
                            <div className="text-md font-semibold">
                              {Number(Money.total).toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              บาท
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 mb-8">
                  <hr className="text-gray-300" />
                </div>
                <div
                  className="mb-4 bg-white rounded-md border
        border-gray-400 shadow-xl p-3 w-full"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* ปีงบประมาณ */}
                    {data.year_id && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          ปีงบประมาณ
                        </label>
                        <Select
                          id="strategic-year"
                          value={yearOptions.find(
                            (option) => option.value === data.year_id
                          )}
                          onChange={(e) =>
                            setData({
                              ...data,
                              year_id: e.value,
                            })
                          }
                          options={yearOptions}
                          styles={customStyles}
                          className="text-sm shadow-md"
                          placeholder="กรุณาเลือกปีงบประมาณ"
                          instanceId="strategic-year"
                        />
                      </div>
                    )}

                    {data.year_id && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          ไตรมาสที่
                        </label>
                        <Select
                          id="strategic-year"
                          value={quarterOptions.find(
                            (option) => option.value === data.year_id
                          )}
                          onChange={(e) =>
                            setData({
                              ...data,
                              year_id: e.value,
                            })
                          }
                          options={quarterOptions}
                          styles={customStyles}
                          className="text-sm shadow-md"
                          placeholder="กรุณาเลือกปีงบประมาณ"
                          instanceId="strategic-year"
                        />
                      </div>
                    )}

                    {/* หน่วยงานรับผิดชอบ */}

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        หน่วยงานรับผิดชอบ
                      </label>
                      <Select
                        id="department"
                        value={departmentOptions.find(
                          (option) => option.value === data.department_id
                        )}
                        onChange={(e) =>
                          setData({
                            ...data,
                            department_id: e.value,
                          })
                        }
                        options={departmentOptions}
                        styles={customStyles}
                        className="text-sm shadow-md"
                        placeholder="หน่วยงานรับผิดชอบ"
                        instanceId="department-select"
                      />
                    </div>

                    {/* OKR */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        OKR
                      </label>
                      <Select
                        id="okr"
                        value={optionsOkr.find(
                          (option) => option.value === data.okr_id
                        )}
                        onChange={(e) =>
                          setData({
                            ...data,
                            okr_id: e.value,
                          })
                        }
                        options={optionsOkr}
                        styles={customStyles}
                        className="text-sm shadow-md"
                        placeholder="ตัวชี้วัด OKR"
                        instanceId="okr-select"
                      />
                    </div>

                    {/* ประเภทโครงการ */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        ประเภทโครงการ
                      </label>
                      <Select
                        id="project-type"
                        value={optionstype.find(
                          (option) => option.value === data.type_id
                        )}
                        onChange={(e) =>
                          setData({
                            ...data,
                            type_id: e.value,
                          })
                        }
                        options={optionstype}
                        styles={customStyles}
                        className="text-sm shadow-md"
                        placeholder="ประเภทโครงการ"
                        instanceId="project-type-select"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        แผนยุทธศาสตร์
                      </label>
                      <Select
                        id="department"
                        value={optionsStrategic.find(
                          (option) => option.value === data.strategic_id
                        )}
                        onChange={(e) =>
                          setData({
                            ...data,
                            strategic_id: e.value,
                          })
                        }
                        options={optionsStrategic}
                        styles={customStyles}
                        className="text-sm shadow-md"
                        placeholder="แผนยุทธศาสตร์"
                        instanceId="department-select"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        กลยุทธ์
                      </label>
                      <Select
                        isDisabled={!data.strategic_id}
                        id="department"
                        value={optionsActionplan.find(
                          (option) => option.value == data.actionplan_id
                          // && option.id_strategic == data.strategic_id
                        )}
                        onChange={(e) =>
                          setData({
                            ...data,
                            actionplan_id: e.value,
                          })
                        }
                        options={optionsActionplan.filter(
                          (option) => option.id_strategic == data.strategic_id
                        )}
                        styles={customStyles}
                        className="text-sm shadow-md"
                        placeholder="แผนยุทธศาสตร์"
                        instanceId="department-select"
                      />
                    </div>
                    {/* โครงการ / กิจกรรม */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        โครงการ / กิจกรรม
                      </label>
                      <Select
                        id="project"
                        value={optionsStrategic.find(
                          (option) => option.value === data.strategic
                        )}
                        onChange={(e) =>
                          setData({
                            ...data,
                            strategic: e.value,
                          })
                        }
                        options={optionsStrategic}
                        styles={customStyles}
                        className="text-sm shadow-md"
                        placeholder="ประเภทโครงการ"
                        instanceId="project-select"
                      />
                    </div>
                  </div>

                  <div></div>
                </div>
                <div>
                  <div className="grid grid-cols-8 gap-4">
                    <div className="col-span-8 md:col-span-8 xl:col-span-5 bg-white rounded-xl border border-gray-400 shadow-xl p-3">
                      <div className="text-center my-4">
                        สถานะการดำเนินงานโครงการจำแนกตามหลักสูตร/หน่วยงาน
                      </div>
                      <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={350}
                      />
                    </div>

                    <div className="col-span-8 md:col-span-8 xl:col-span-3 bg-white rounded-xl border border-gray-400 shadow-xl p-3">
                      <div className="text-center my-4">
                        จำนวนงบประมาณที่ใช้จริงคิดเป็นเปอร์เซ็นต์จำแนกตามประเด็นยุทธศาสตร์
                      </div>
                      <div className="w-full max-w-full">
                        <ReactApexChart
                          options={statePie.options}
                          series={statePie.series}
                          type="pie"
                          height={350}
                          width="100%" // ใช้แบบ string เพื่อให้ responsive
                        />
                      </div>
                    </div>

                    <div className="col-span-8 md:col-span-8 xl:col-span-5 bg-white rounded-xl border border-gray-400 shadow-xl p-3">
                      <div className="text-center my-4">
                        สถานะการดำเนินงานกิจกรรม จำแนกตามหลักสูตร/หน่วยงาน
                      </div>
                      <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={350}
                      />
                    </div>
                    <div className="col-span-8 md:col-span-8 xl:col-span-3 bg-white rounded-xl border border-gray-400 shadow-xl p-3">
                      <div className="text-center my-4">
                        จำนวนโครงการกิจกรรมดำเนินการแล้วเสร็จจำแนกตามประเด็นยุทธศาสตร์
                      </div>
                      <div className="w-full max-w-full">
                        <ReactApexChart
                          options={statePie.options}
                          series={statePie.series}
                          type="pie"
                          height={300}
                          width="100%" // ใช้แบบ string เพื่อให้ responsive
                        />
                      </div>
                    </div>

                    <div className="col-span-8 bg-white rounded-xl border border-gray-400 shadow-xl p-3">
                      <h5 className="card-title">ยอดแต่ละเดือน</h5>
                      <div style={{ width: "100%", height: "300px" }}>
                        <ReactApexChart
                          options={options_line}
                          series={series}
                          type="line"
                          height={300}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>{/* <DatatableStrig /> */}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
