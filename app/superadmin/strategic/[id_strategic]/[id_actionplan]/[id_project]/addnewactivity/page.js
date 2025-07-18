"use client";
import Image from "next/image";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import Menu from "../../../../../component/nav_admin";
import Header from "../../../../../component/header";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import { FiEdit2 } from "react-icons/fi";
import "bootstrap-icons/font/bootstrap-icons.css";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
// import CustomEditor from "../../../component/create_editor";
const CustomEditor = dynamic(() => import("../../../../component/editor"), {
  ssr: false,
});
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import {
  GetDataprincipleUse,
  GetDatadepartmentUse,
  GetDatastrategicForAdd,
  GetDataOkrUse,
  GetDatateacherUse,
  GetDataemployeeUse,
  GetDataunitUse,
  GetDatastyleUse,
  GetAddActivityNew,
} from "../../../../../../fetch_api/fetch_api_superadmin";
import {
  ModalAddOkrNew,
  ModalAddObjectiveNew,
  ModalAddUserNew,
  ModalAddindicatorNew,
} from "./component/modal";

export default function addProject({ params }) {
  const searchParams = useSearchParams();
  const total = searchParams.get("total");
  const maxbudget = searchParams.get("maxbudget");
  const [isOpenModalOKRAdd, setIsOpenModalOKRAdd] = useState(false);
  const [isOpenModalObjectiveAdd, setIsOpenModalObjectiveAdd] = useState(false);
  const [isOpenModalUserAdd, setIsOpenModalUserAdd] = useState(false);
  const [isOpenModalindicatorAdd, setIsOpenModalindicatorAdd] = useState(false);
  const { id_strategic, id_actionplan, id_project } = use(params);
  const [overBudget, setOverBudget] = useState(false);
  const [strategic, setStrategic] = useState({
    id: "",
    name: "",
    budget: "",
    year_id: "",
    year: "",
  });

  const [dataAddNewActivity, setdataAddNewActivity] = useState({
    id_activity: "",
    activity_name: "",
    id: total,
    location: "",
    id_department: null,
    id_year: null,
    id_strategic: null,
    id_actionplan: null,
    id_project: null,
    activity_principle: [],
    budget: "",
    time_start: "",
    time_end: "",
    style_activtiy_detail: [],
    okr_detail_activity: [],
    objective_activity: [],
    employee: [],
    teacher: [],
    indicator_activity: [],
    abstract: "",
    obstacle: "",
    result: "",
  });

  const [isMounted, setIsMounted] = useState(false);

  // สำหรับโค้ดที่ต้องรอให้โหลดในเบราว์เซอร์ก่อน

  useEffect(() => {
    const saved = Cookies.get("dataAddNewActivity");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log(parsed);
        setdataAddNewActivity((prev) => ({
          ...prev,
          ...parsed, // รวมค่าเดิม + จาก cookie
        }));
      } catch (e) {
        console.error("ไม่สามารถแปลงข้อมูลจาก Cookie ได้", e);
      }
    }
    setIsMounted(true); // ตั้งค่าเป็น true เมื่อคอมโพเนนต์ถูก mount แล้วบน client
  }, []);

  useEffect(() => {
    console.log(dataAddNewActivity);
    const handleSaveToCookie = () => {
      Cookies.set("dataAddNewActivity", JSON.stringify(dataAddNewActivity), {
        expires: 7,
        path: "/",
      });
    };

    // 1. บันทึกตอนก่อนออกจากหน้า (รวมกด refresh, ปิดแท็บ)
    window.addEventListener("beforeunload", handleSaveToCookie);

    // 2. บันทึกตอนผู้ใช้กด back/forward (popstate)
    window.addEventListener("popstate", handleSaveToCookie);

    return () => {
      window.removeEventListener("beforeunload", handleSaveToCookie);
      window.removeEventListener("popstate", handleSaveToCookie);
    };
  }, [dataAddNewActivity]);

  const [actionplan, setActionplan] = useState({
    id: "",
    name: "",
    budget: "",
    year_id: "",
    year: "",
    start_date: null,
    end_date: null,
  });

  const [project, setProject] = useState({
    id: "",
    name: "",
    budget: "",
    year_id: "",
    year: "",
    Balance: "",
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    if (strategic && strategic.year_id) {
      setdataAddNewActivity((prev) => ({
        ...prev,
        id_year: strategic.year_id,
        time_start: `${strategic.year - 1}-10-01`,
        time_end: `${strategic.year}-09-30`,
      }));
    }
  }, [strategic]);
  useEffect(() => {
    async function fetchStrategicData() {
      const data = sessionStorage.getItem("strategic_data");
      const data_actionplan = sessionStorage.getItem("actionplan_data");
      const data_project = sessionStorage.getItem("project_data");
      // const data_activity = sessionStorage.getItem("activity_data");
      if (!data || !data_actionplan || !data_project) {
        window.location.href = `/superadmin/strategic`;
        return;
      }

      const parsed = JSON.parse(data);
      setStrategic(JSON.parse(data)); // set state
      const parsed_actionplan = JSON.parse(data_actionplan);
      setActionplan(parsed_actionplan);
      const parsed_project = JSON.parse(data_project);
      setProject(parsed_project);
      // console.log(parsed_project);
      // console.log(parsed_actionplan);
      setdataAddNewActivity((prev) => ({
        ...prev,
        id_actionplan: parsed_actionplan.id,
        id_strategic: parsed.id,
        id: total,
        id_project: parsed_project.id,
      }));
      try {
        const token = Cookies.get("token"); // อย่าลืมดึง token ด้วย
        const res_strategic = await GetDatastrategicForAdd(
          token,
          parsed.year_id
        );

        const mappedOptions = res_strategic.data.map((item) => ({
          value: item.strategic_id,
          label: `${item.strategic_number} : ${item.strategic_name}`,
        }));

        setoptionsStrategic(mappedOptions);

        const res_Okr = await GetDataOkrUse(token, parsed.year_id);
        const mappedOkrOptions = res_Okr.map((item) => ({
          value: item.okr_id,
          label: `${item.okr_number} : ${item.okr_name}`,
        }));
        setoptionsOkr(mappedOkrOptions);
      } catch (err) {
        console.error("Error loading strategic options:", err);
      }
    }

    fetchStrategicData();
  }, []);

  const [optionsOkr, setoptionsOkr] = useState([
    // { value: "1", label: "2567" },
    // { value: "2", label: "2568" },
    // { value: "3", label: "2569" },
  ]);
  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get("token");
        // console.log("token : ", token);
        const res = await GetDataprincipleUse(token);
        const mappedOptions = res.map((item) => ({
          value: item.principle_id,
          label: item.principle_name,
        }));
        setoptionsprinciples(mappedOptions);

        const res_Deparment = await GetDatadepartmentUse(token);
        const mappedDeparmentOptions = res_Deparment.map((item) => ({
          value: item.departments_id,
          label: item.departments_name,
        }));
        setOptionsDeparment(mappedDeparmentOptions);

        const res_employee = await GetDataemployeeUse(token);
        console.log(res_employee);
        const mappedemployeeOptions = res_employee.map((item) => ({
          value: item.id,
          label: `${item.name}  `,
          position: item.position?.position_name,
        }));
        setoptionsemployee(mappedemployeeOptions);

        const res_teacher = await GetDatateacherUse(token);
        // console.log(res_teacher);
        const mappedteacherOptions = res_teacher.map((item) => ({
          value: item.id,
          label: `${item.name}  `,
          position: item.position?.position_name,
        }));
        setoptionsteacher(mappedteacherOptions);

        const res_unit = await GetDataunitUse(token);
        // console.log(res_teacher);
        const mappedunitOptions = res_unit.map((item) => ({
          value: item.unit_id,
          label: `${item.unit_name}  `,
        }));
        setOptionsUnit(mappedunitOptions);

        const res_style = await GetDatastyleUse(token);
        // console.log(res_teacher);
        const mappedstyleOptions = res_style.map((item) => ({
          value: item.style_id,
          label: `${item.style_name}  `,
        }));
        setoptionstype(mappedstyleOptions);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, []);

  // const [selecteddeparment, setSelecteddeparment] = useState(null);
  const [optionsDeparment, setOptionsDeparment] = useState([
    // { value: "D1", label: "IT" },
    // { value: "D2", label: "AI" },
    // { value: "D3", label: "CS" },
  ]);

  const [optionsUnit, setOptionsUnit] = useState([
    // { value: "D1", label: "IT" },
    // { value: "D2", label: "AI" },
    // { value: "D3", label: "CS" },
  ]);

  const [optionsStrategic, setoptionsStrategic] = useState([
    // { value: "S1", label: "S1 : ยุทธศาสตร์ด้านการจัดการศึกษา" },
    // { value: "S2", label: "S2 : ยุทธศาสตร์ด้านการวิจัย" },
    // {
    //   value: "S3",
    //   label: "S3 : ยุทธศาสตร์ด้านการบริการวิชาการเพื่อสร้างประโยชน์ให้สังคม",
    // },
  ]);

  const [optionsprinciples, setoptionsprinciples] = useState([
    // {
    //   value: "PP1",
    //   label: "A1 : การพัฒนาหลักสูตรใหม่ ",
    // },
    // {
    //   value: "PP2",
    //   label: "A2 : การพัฒนา",
    // },
    // {
    //   value: "PP3",
    //   label: "A3 : การจัดการ",
    // },
    // {
    //   value: "PP4",
    //   label: "A4 : การจัดการศึกษา)",
    // },
  ]);

  const [optionstype, setoptionstype] = useState([
    // {
    //   value: "T1",
    //   label: "งานประจำ",
    // },
    // {
    //   value: "T2",
    //   label: "งานเชิงยุทธศาสตร์",
    // },
  ]);
  const [typeUser, setTypeuser] = useState();
  const [optionsteacher, setoptionsteacher] = useState([]);
  const [optionsemployee, setoptionsemployee] = useState([]);
  // const handleChange = (selectedOption) => {
  //   setSelecteddeparment(selectedOption);
  // };

  // การใช้ const [isMounted, setIsMounted] = useState(false) เป็นเทคนิคสำคัญในการแก้ไขปัญหา Hydration Error

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
  const columns = [
    {
      name: "ลำดับ",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "ตัวชี้วัด",
      selector: (row) => row.indicator_name,
      sortable: true,
      wrap: true,
    },

    {
      name: "ค่าเป้าหมาย",
      selector: (row) => row.goal,
      sortable: true,
      wrap: true,
      center: "true",
    },
    {
      name: "หน่วยนับ",
      selector: (row) => row.unit_name.label,
      sortable: true,
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
                setdataAddNewActivity((prev) => ({
                  ...prev,
                  indicator_activity: prev.indicator_activity.filter(
                    (item) => item.id !== row.id
                  ),
                }))
              }
            >
              <i className="bi bi-trash text-xl group-hover:text-red-500"></i>{" "}
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];

  const columns_okr = [
    {
      name: "ข้อ",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.name,
      sortable: true,
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
                setdataAddNewActivity((prev) => ({
                  ...prev,
                  okr_detail_activity: prev.okr_detail_activity.filter(
                    (item) => item.id !== row.id
                  ),
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
  const columns_objective = [
    {
      name: "ข้อ",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.name,
      sortable: true,
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
                setdataAddNewActivity((prev) => ({
                  ...prev,
                  objective_activity: prev.objective_activity.filter(
                    (item) => item.id !== row.id
                  ),
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
                setdataAddNewActivity((prev) => ({
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
                setdataAddNewActivity((prev) => ({
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

  const [editorData, setEditorData] = useState("");

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleAddactivity = async (row) => {
    // const newStatus = row.status === 1 ? 0 : 1;

    const isEmpty = (value) => {
      if (Array.isArray(value)) return value.length === 0;
      return value === null || value === "";
    };

    const ignoreFields = ["id_activity", "result","style_detail"];

    const emptyFields = Object.entries(dataAddNewActivity)
      .filter(([key]) => !ignoreFields.includes(key))
      .filter(([_, value]) => isEmpty(value))
      .map(([key]) => key); // ได้ชื่อฟิลด์ที่ว่าง

    const fieldLabels = {
      activity_name: "ชื่อกิจกรรม",
      id: "รหัสกิจกรรม",
      location: "สถานที่ดำเนินการ",
      id_department: "หน่วยงานที่รับผิดชอบ",
      year: "ปีงบประมาณ",
      id_strategic: "ยุทธศาสตร์",
      id_actionplan: "แผนปฏิบัติการ",
      activity_principle: "หลักการและเหตุผล",
      budget: "งบประมาณ",
      time_start: "วันเริ่มต้น",
      time_end: "วันสิ้นสุด",
      style_activtiy_detail: "ลักษณะกิจกรรม",
      okr_detail_activity: "OKR",
      objective_activity: "วัตถุประสงค์",
      employee: "เจ้าหน้าที่ผู้รับผิดชอบ",
      teacher: "อาจารย์ผุ้รับผิดชอบ",
      indicator_activity: "ตัวชี้วัด",
      abstract: "บทคัดย่อ",
      obstacle: "อุปสรรค",
    };

    const missingLabels = emptyFields.map((key) => fieldLabels[key] || key);

    if (missingLabels.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        html: `กรุณากรอกข้อมูลในฟิลด์:<br><strong>${missingLabels.join(
          ", "
        )}</strong>`,
      });
      return; // หยุดการส่งข้อมูล
    }

    // if (hasEmptyFields) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "กรอกข้อมูลไม่ครบ",
    //     text: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนบันทึก",
    //   });
    //   return;
    // }
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: `คุณต้องการเพิ่ม "${row.activity_name}" หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: "บันทึกข้อมูล",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("token");
        const response = await GetAddActivityNew(token, row);
        // if(response)
        console.log(response);
        if (response) {
          console.log("การอัปเดตสถานะสำเร็จ");
          // setData((prevData) =>
          //   prevData.map((item) =>
          //     item.action_plan_id === row.action_plan_id
          //       ? { ...item, status: newStatus }
          //       : item
          //   )
          // );
          // ทำการดำเนินการเพิ่มเติมที่ต้องการเมื่อการอัปเดตสำเร็จ
          Swal.fire({
            title: "อัปเดตข้อมูลสำเร็จ",
            text: "ข้อมูลถูกอัปเดตในระบบแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          }).then(() => {
            Cookies.remove("dataAddNewActivity", { path: "/" });
            window.history.back();
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
          title: "เกิดข้อผิดพลาด",
          text: `ไม่สามารถเพิ่มข้อมูลเนื่องจาก ${err} กรุณาลองใหม่อีกครั้ง`,
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        // console.log(err);
      }
    }
  };

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
              <div className="flex flex-row items-center justify-between">
                <div className="text-lg md:text-3xl">
                  แบบฟอร์มกิจกรรมตามแผนปฏิบัติการ วิทยาลัยการคอมพิวเตอร์
                  มหาวิทยาลัยขอนแก่น
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-8 gap-y-6 mt-3">
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ชื่อกิจกรรม
                  </span>
                  <input
                    type="text"
                    id="nameactivity"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรุณากรอกชื่อกิจกรรม"
                    required
                    value={dataAddNewActivity.activity_name || ""}
                    onChange={(e) =>
                      setdataAddNewActivity((prev) => ({
                        ...prev,
                        activity_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    รหัสกิจกรรม
                  </span>
                  <input
                    type="text"
                    id="idactivity"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรุณากรอกรหัสกิจกรรม"
                    readOnly
                    value={dataAddNewActivity.id}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    สถานที่
                  </span>
                  <input
                    type="text"
                    id="location"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรุณากรอกสถานที่"
                    value={dataAddNewActivity.location || ""}
                    onChange={(e) =>
                      setdataAddNewActivity((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    งบประมาณ
                  </span>
                  <input
                    type="text"
                    id="price"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรุณากรอกงบประมาณ"
                    value={
                      dataAddNewActivity.budget
                        ? Number(dataAddNewActivity.budget).toLocaleString(
                            "th-TH"
                          )
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, ""); // เอา , ออกก่อนเก็บ
                      const maxBalace = parseFloat(maxbudget);

                      if (rawValue > maxBalace) {
                        setOverBudget(true); // ⚠️ เกิน
                      } else {
                        setOverBudget(false); // ✅ ปกติ
                      }
                      if (!isNaN(rawValue)) {
                        if (rawValue <= maxBalace) {
                          setdataAddNewActivity({
                            ...dataAddNewActivity,
                            budget: rawValue,
                          });
                        }
                      }
                    }}
                  />
                  {overBudget && (
                    <p className="mt-1 text-sm text-red-600">
                      งบประมาณไม่ควรเกิน {maxbudget} บาท
                    </p>
                  )}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ระยะเวลาดำเนินการ
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
                          className="bg-gray-50  xl:w-67 md:w-38 w-38 shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date start"
                          value={dataAddNewActivity.time_start}
                          readOnly
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
                          className="bg-gray-50  xl:w-67 md:w-38 w-38 shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date end"
                          value={dataAddNewActivity.time_end}
                          readOnly
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
                    หน่วยงานรับผิดชอบ
                  </label>

                  <Select
                    id="deparment"
                    value={optionsDeparment.find(
                      (option) => option.value === dataAddNewActivity.deparment
                    )}
                    // value={dataAddNewActivity.deparment || ""}
                    onChange={(e) => {
                      console.log("Selected Value:", e.value);
                      setdataAddNewActivity({
                        ...dataAddNewActivity,
                        id_department: e.value,
                      });
                    }}
                    options={optionsDeparment}
                    styles={customStyles}
                    className="text-sm shadow-md"
                    placeholder="กรุณาเลือกหน่วยงานรับผิดชอบ"
                    instanceId="deparment-select" // Add this line to fix duplicate IDs
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label
                    htmlFor="deparment"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ปีงบประมาณ
                  </label>

                  <input
                    id="year"
                    name="year"
                    type="text"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ปีงบประมาณ"
                    value={strategic.year || ""}
                    readOnly
                  />
                  {/* <Select
                    id="idYear"
                    value={optionsYear.find(
                      (option) => option.value === dataAddNewActivity.year
                    )}
                    onChange={(e) => {
                      setdataAddNewActivity({
                        ...dataAddNewActivity,
                        deparment: e.value,
                      });
                    }}
                    options={optionsYear}
                    styles={customStyles}
                    className="text-sm shadow-md"
                    placeholder="กรุณาเลือกปีงบประมาณ"
                    instanceId="deparment-select" // Add this line to fix duplicate IDs
                  /> */}
                </div>
                <div className="col-span-12">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ลักษณะกิจกรรม
                  </span>

                  <div className="grid grid-cols-12 gap-2">
                    {optionstype.map((item) => {
                      return (
                        <div
                          key={item.value}
                          className="flex items-center col-span-12 md:col-span-3 xl:col-span-2"
                        >
                          <input
                            id={`checkbox-${item.value}`}
                            type="checkbox"
                            value={item.value}
                            checked={dataAddNewActivity.style_activtiy_detail.includes(
                              item.value
                            )}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() =>
                              setdataAddNewActivity((prev) => ({
                                ...prev,
                                style_activtiy_detail: prev.style_activtiy_detail.includes(
                                  item.value
                                )
                                  ? prev.style_activtiy_detail.filter(
                                      (v) => v !== item.value
                                    )
                                  : [...prev.style_activtiy_detail, item.value],
                              }))
                            }
                          />
                          <label
                            htmlFor={`checkbox-${item.value}`}
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {item.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-12">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ตอบสนองตามหลักธรรมาภิบาล (สามารถระบุได้มากกว่า 1)
                  </span>

                  <div className="grid grid-cols-12 gap-2">
                    {optionsprinciples.map((item) => {
                      return (
                        <div
                          key={item.value}
                          className="flex items-center col-span-12 md:col-span-3 xl:col-span-2"
                        >
                          <input
                            id={`checkbox-${item.value}`}
                            type="checkbox"
                            value={item.value}
                            checked={dataAddNewActivity.activity_principle.includes(
                              item.value
                            )}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() =>
                              setdataAddNewActivity((prev) => ({
                                ...prev,
                                activity_principle:
                                  prev.activity_principle.includes(item.value)
                                    ? prev.activity_principle.filter(
                                        (v) => v !== item.value
                                      )
                                    : [...prev.activity_principle, item.value],
                              }))
                            }
                          />
                          <label
                            htmlFor={`checkbox-${item.value}`}
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {item.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-12 mt-4">
                  <hr className="text-gray-200" />
                </div>
                <div className="col-span-12">
                  <h2>ความสอดคล้องกับประเด็นยุทธศาสตร์</h2>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ประเด็นยุทธศาสตร์
                  </span>

                  <input
                    id="year"
                    name="year"
                    type="text"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ปีงบประมาณ"
                    value={`${id_strategic} : ${strategic.name}`}
                    readOnly
                  />
                  {/* <Select
                    id="strategic"
                    value={optionsStrategic.find(
                      (option) => option.value === dataAddNewActivity.strategic
                    )}
                    onChange={(e) => {
                      setdataAddNewActivity({
                        ...dataAddNewActivity,
                        strategic: e.value,
                      });
                    }}
                    options={optionsStrategic}
                    styles={customStyles}
                    className="text-sm shadow-md"
                    placeholder="กรุณาเลือกปีงบประมาณ"
                    instanceId="strategic-select" // Add this line to fix duplicate IDs
                  /> */}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    กลยุทธ์
                  </span>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ปีงบประมาณ"
                    value={`${id_actionplan} : ${actionplan.name}`}
                    readOnly
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    โครงการ
                  </span>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ปีงบประมาณ"
                    value={`${id_project} : ${project.name}`}
                    readOnly
                  />
                </div>

                <div className="col-span-12">
                  <div className="flex flex-col ">
                    <div className="flex flex-row justify-between mb-2">
                      <h2>OKR </h2>
                      <button
                        type="button"
                        onClick={() => setIsOpenModalOKRAdd(true)}
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      {" "}
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns_okr}
                          data={dataAddNewActivity.okr_detail_activity}
                          customStyles={customStylesTable}
                          fixedHeaderScrollHeight="100%"
                          noDataComponent={
                            <div className="text-gray-500 py-4 text-center">
                              ยังไม่เพิ่มข้อมูล OKR
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="col-span-12 mt-4">
                  <hr className="text-gray-200" />
                </div> */}

                <div className="col-span-12 mt-4">
                  <hr className="text-gray-200" />
                </div>
                <div className="col-span-12 ">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    หลักการและเหตุผล
                  </label>
                  {/* <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                  /> */}
                  <CustomEditor
                    value={dataAddNewActivity.abstract}
                    onChange={(value) =>
                      setdataAddNewActivity({
                        ...dataAddNewActivity,
                        abstract: value, // value คือค่าจาก editor.getData()
                      })
                    }
                  />
                </div>
                <div className="col-span-12">
                  <div className="flex flex-col ">
                    <div className="flex flex-row justify-between mb-2">
                      <h2>วัตถุประสงค์ </h2>
                      <button
                        type="button"
                        onClick={() => setIsOpenModalObjectiveAdd(true)}
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns_objective}
                          data={dataAddNewActivity.objective_activity}
                          customStyles={customStylesTable}
                          fixedHeaderScrollHeight="100%"
                          noDataComponent={
                            <div className="text-gray-500 py-4 text-center">
                              ยังไม่เพิ่มข้อมูลวัตถุประสงค์
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
                      <h2>ตัวชี้วัดและค่าเป้าหมายของกิจกรรม/กิจกรรม </h2>
                      <button
                        type="button"
                        onClick={() => setIsOpenModalindicatorAdd(true)}
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns}
                          data={dataAddNewActivity.indicator_activity}
                          customStyles={customStylesTable}
                          fixedHeaderScrollHeight="100%"
                          noDataComponent={
                            <div className="text-gray-500 py-4 text-center">
                              ยังไม่เพิ่มข้อมูล
                              ตัวชี้วัดและค่าเป้าหมายของกิจกรรม
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
                      <h2>ผลที่คาดว่าจะได้รับ </h2>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <CustomEditor
                          value={dataAddNewActivity.result}
                          onChange={(value) =>
                            setdataAddNewActivity({
                              ...dataAddNewActivity,

                              result: value, // value คือค่าจาก editor.getData()
                            })
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
                      <h2>
                        ปัญหาอุปสรรค
                        และแนวทางการปรับปรุงการดำเนินงานในรอบปีที่ผ่านมา{" "}
                      </h2>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <CustomEditor
                          value={dataAddNewActivity.obstacle}
                          onChange={(value) =>
                            setdataAddNewActivity({
                              ...dataAddNewActivity,

                              obstacle: value, // value คือค่าจาก editor.getData()
                            })
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
                          data={dataAddNewActivity.employee}
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
                          data={dataAddNewActivity.teacher}
                          customStyles={customStylesTable}
                          fixedHeaderScrollHeight="100%"
                          noDataComponent={
                            <div className="text-gray-500 py-4 text-center">
                              ยังไม่เพิ่มข้อมูลผู้รับผิดชอบระดับนโยบาย / บริหาร
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 mt-4 flex flex-row justify-end">
                  <button
                    type="button"
                    onClick={() => handleAddactivity(dataAddNewActivity)}
                    className="bg-green-500 text-white text-sm px-12 py-2 rounded-md hover:bg-blue-600"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {strategic && isOpenModalOKRAdd && (
        <ModalAddOkrNew
          onClose={() => setIsOpenModalOKRAdd(false)}
          isOpen={ModalAddOkrNew}
          type={1}
          oleOkr={dataAddNewActivity.okr_detail_activity}
          onSelectOkr={(selectedOkrValue) => {
            console.log(selectedOkrValue),
              setdataAddNewActivity((prev) => {
                const exists = (prev.okr_detail_activity || []).some(
                  (item) => item.id === selectedOkrValue.value
                );

                if (exists) return prev;

                return {
                  ...prev,
                  okr_detail_activity: [
                    ...(prev.okr_detail_activity || []),
                    {
                      id: selectedOkrValue.value,
                      name: selectedOkrValue.label,
                    },
                  ],
                };
              });
          }}
          okr={optionsOkr}
        />
      )}

      {isOpenModalObjectiveAdd && (
        <ModalAddObjectiveNew
          onClose={() => setIsOpenModalObjectiveAdd(false)}
          isOpen={ModalAddOkrNew}
          type={1}
          oleOkr={dataAddNewActivity.objective_activity}
          onSelectOkr={(selectedOkrValue) => {
            console.log(selectedOkrValue),
              setdataAddNewActivity((prev) => {
                const exists = (prev.objective_activity || []).some(
                  (item) => item.name === selectedOkrValue // ตรวจจากชื่อ ไม่ใช้ value แล้ว
                );

                if (exists) return prev;

                const newId = (prev.objective_activity?.length || 0) + 1;

                return {
                  ...prev,
                  objective_activity: [
                    ...(prev.objective_activity || []),
                    {
                      id: newId, // index + 1
                      name: selectedOkrValue, //  ถ้า selectedOkrValue เป็น string
                    },
                  ],
                };
              });
          }}
          okr={optionsOkr}
        />
      )}

      {isOpenModalUserAdd && typeUser == 1 && (
        <ModalAddUserNew
          onClose={() => setIsOpenModalUserAdd(false)}
          isOpen={ModalAddUserNew}
          type={typeUser}
          olduser={dataAddNewActivity.employee}
          onSelectuser={(selectedOkrValue) => {
            // console.log(selectedOkrValue),
            setdataAddNewActivity((prev) => {
              const exists = (prev.employee || []).some(
                (item) => item.id === selectedOkrValue.value
              );

              if (exists) return prev;

              return {
                ...prev,
                employee: [
                  ...(prev.employee || []),
                  {
                    id: selectedOkrValue.value,
                    name: selectedOkrValue.label,
                    position: selectedOkrValue.position,
                  },
                ],
              };
            });
          }}
          user={optionsemployee}
        />
      )}

      {isOpenModalUserAdd && typeUser == 2 && (
        <ModalAddUserNew
          onClose={() => setIsOpenModalUserAdd(false)}
          isOpen={ModalAddUserNew}
          type={typeUser}
          olduser={dataAddNewActivity.teacher}
          onSelectuser={(selectedOkrValue) => {
            // console.log(selectedOkrValue),
            setdataAddNewActivity((prev) => {
              const exists = (prev.teacher || []).some(
                (item) => item.id === selectedOkrValue.value
              );

              if (exists) return prev;

              return {
                ...prev,
                teacher: [
                  ...(prev.teacher || []),
                  {
                    id: selectedOkrValue.value,
                    name: selectedOkrValue.label,
                    position: selectedOkrValue.position,
                  },
                ],
              };
            });
          }}
          user={optionsteacher}
        />
      )}
      {isOpenModalindicatorAdd && (
        <ModalAddindicatorNew
          onClose={() => setIsOpenModalindicatorAdd(false)}
          isOpen={ModalAddindicatorNew}
          type={1}
          unit={optionsUnit}
          olduser={dataAddNewActivity.indicator_activity}
          onSelectindicator={(selectedOkrValue) => {
            // console.log(selectedOkrValue),
            setdataAddNewActivity((prev) => {
              const exists = (prev.indicator_activity || []).some(
                (item) =>
                  item.indicator_name === selectedOkrValue.indicator_name
              );

              // const exists_unit = (prev.indicator || []).some(
              //   (item) =>
              //     item.unit_name.value === selectedOkrValue.unit_name.value
              // );

              if (exists) return prev;
              const newId = (prev.indicator_activity?.length || 0) + 1;
              return {
                ...prev,
                indicator_activity: [
                  ...(prev.indicator_activity || []),
                  {
                    id: newId,
                    indicator_name: selectedOkrValue.indicator_name,
                    unit_name: selectedOkrValue.unit_name,
                    goal: selectedOkrValue.goal,
                  },
                ],
              };
            });
          }}
          user={optionsteacher}
        />
      )}
    </>
  );
}
