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
import _ from "lodash";
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
  GetEditProject,
  DeleteObjective,
  DeleteOkrproject,
  GetProject,
  Deleteprojectuser,
  Deleteindicator,
} from "../../../../../../fetch_api/fetch_api_superadmin";
import {
  ModalAddOkrNew,
  ModalAddObjectiveNew,
  ModalAddUserNew,
  ModalAddindicatorNew,
  ModalAddTeacherNew,
} from "../component/modal";

export default function addProject({ params }) {
  const searchParams = useSearchParams();
  const total = searchParams.get("total");
  const maxbudget = searchParams.get("maxbudget");
  const [isOpenModalOKRAdd, setIsOpenModalOKRAdd] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [isOpenModalindicatorAdd, setIsOpenModalindicatorAdd] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [isOpenModalEmployeeAdd, setIsOpenModalEmployeeAdd] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [isOpenModalTeacherAdd, setIsOpenModalTeacherAdd] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [isOpenModalObjectiveAdd, setIsOpenModalObjectiveAdd] = useState({
    isOpen: false,
    type: null,
    data: null,
  });
  const [isOpenModalUserAdd, setIsOpenModalUserAdd] = useState(false);
  // const [isOpenModalindicatorAdd, setIsOpenModalindicatorAdd] = useState();
  const { id_strategic, id_actionplan } = use(params);
  const [overBudget, setOverBudget] = useState(false);
  const [dataProject, setdataProject] = useState({
    project_id: "",
    project_name: "",
    project_number: null,
    location: "",
    id_department: null,
    id_year: null,
    id_strategic: null,
    id_actionplan: null,
    project_principle: [],
    budget: "",
    time_start: "",
    time_end: "",
    style_detail: [],
    okr_detail_project: [],
    objective: [],
    employee: [],
    teacher: [],
    indicator: [],
    abstract: "",
    obstacle: "",
    result: "",
  });
  const [olddataProject, setolddataProject] = useState({
    project_id: "",
    project_name: "",
    project_number: null,
    location: "",
    id_department: null,
    id_year: null,
    id_strategic: null,
    id_actionplan: null,
    project_principle: [],
    budget: "",
    time_start: "",
    time_end: "",
    style_detail: [],
    okr_detail_project: [],
    objective: [],
    employee: [],
    teacher: [],
    indicator: [],
    abstract: "",
    obstacle: "",
    result: "",
  });

  const [isMounted, setIsMounted] = useState(false);

  // สำหรับโค้ดที่ต้องรอให้โหลดในเบราว์เซอร์ก่อน

  useEffect(() => {
    // const saved = Cookies.get("dataProject");
    async function fetchData() {
      const data_actionplan = sessionStorage.getItem("actionplan_data");
      const data_strategic = sessionStorage.getItem("strategic_data");
      const data_project = sessionStorage.getItem("project_edit");
      if (!data_actionplan || !data_project || !data_strategic) {
        window.location.href = `/superadmin/strategic`;
        return;
      }

      const parsed_actionplan = JSON.parse(data_actionplan);
      const parsed_strategic = JSON.parse(data_strategic);
      setActionplan(JSON.parse(data_actionplan));
      const par_project = JSON.parse(data_project);
      // console.log(par_project.data.project_id);
      const token = Cookies.get("token");
      const res = await GetProject(token, par_project.data.project_id);
      console.log(res);
      if (res.status == 200 && res.data.length > 0) {
        const res_data = res.data[0];
        const object_map = res_data.objective.map((item) => ({
          id: item.objective_id,
          name: item.objective_name,
        }));
        const okr_map = res_data.project_okr.map((item) => ({
          id_okr_project: item.okr_detail_project_id,
          id: item.okr.okr_id,
          name: `${item.okr.okr_number} ${item.okr.okr_name}`,
        }));
        const principle_map = res_data.project_principle.map(
          (item) => item.id_principle
        );
        const style_map = res_data.project_style.map((item) => item.id_style);
        // console.log(res_data.project_users)
        const emp_map = res_data.project_users
          .filter((item) => item.user?.academic_position === "2")
          .map((item) => ({
            id: item.user.id,
            id_project_users: item.id_project_user,
            name: `${item.user.name}`,
            position: `${item.user.position.position_name || "-"} `,
          }));

        const teacher_map = res_data.project_users
          .filter((item) => item.user?.academic_position === "1")
          .map((item) => ({
            id: item.user.id,
            name: item.user.name,
            id_project_users: item.id_project_user,
            position: item.user.position?.position_name || "-",
          }));

        const indicator_map = res_data.project_indicator.map((item) => ({
          id: item.indicator_id,
          indicator_name: item.indicator_name,
          goal: item.goal,
          unit_name: {
            value: item.unit.unit_id,
            label: item.unit.unit_name,
          },
        }));

        // console.log(principle_map);
        setdataProject((prev) => ({
          ...prev,
          project_id: par_project.data.project_id,
          project_name: res_data.project_name,
          project_number: res_data.project_number,
          location: res_data.location,
          budget: res_data.budget,
          time_start: res_data.time_start,
          time_end: res_data.time_end,
          id_actionplan: parsed_actionplan.id,
          id_strategic: parsed_strategic.id,
          abstract: res_data.abstract,
          id_department: res_data.id_department,
          result: res_data.result,
          obstacle: res_data.obstacle,
          id_year: res_data.id_year,
          objective: object_map,
          project_principle: principle_map,
          style_detail: style_map,
          okr_detail_project: okr_map,
          employee: emp_map,
          teacher: teacher_map,
          indicator: indicator_map,
        }));
        setolddataProject((prev) => ({
          ...prev,
          project_id: par_project.data.project_id,
          project_name: res_data.project_name,
          project_number: res_data.project_number,
          location: res_data.location,
          budget: res_data.budget,
          time_start: res_data.time_start,
          time_end: res_data.time_end,
          id_actionplan: parsed_actionplan.id,
          id_strategic: parsed_strategic.id,
          abstract: res_data.abstract,
          id_department: res_data.id_department,
          result: res_data.result,
          obstacle: res_data.obstacle,
          id_year: res_data.id_year,
          objective: object_map,
          project_principle: principle_map,
          style_detail: style_map,
          okr_detail_project: okr_map,
          employee: emp_map,
          teacher: teacher_map,
          indicator: indicator_map,
        }));
      }

      setIsMounted(true); // ตั้งค่าเป็น true เมื่อคอมโพเนนต์ถูก mount แล้วบน client
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log(dataProject);
  //   const handleSaveToCookie = () => {
  //     Cookies.set("dataProject", JSON.stringify(dataProject), {
  //       expires: 7,
  //       path: "/",
  //     });
  //   };

  //   // 1. บันทึกตอนก่อนออกจากหน้า (รวมกด refresh, ปิดแท็บ)
  //   window.addEventListener("beforeunload", handleSaveToCookie);

  //   // 2. บันทึกตอนผู้ใช้กด back/forward (popstate)
  //   window.addEventListener("popstate", handleSaveToCookie);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleSaveToCookie);
  //     window.removeEventListener("popstate", handleSaveToCookie);
  //   };
  // }, [dataProject]);

  const [strategic, setStrategic] = useState({
    id: "",
    name: "",
    budget: "",
    year_id: "",
    year: "",
  });

  const [actionplan, setActionplan] = useState({
    id: "",
    name: "",
    budget: "",
    year_id: "",
    year: "",
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    if (strategic && strategic.year_id) {
      setdataProject((prev) => ({
        ...prev,
        id_year: strategic.year_id,
        time_start: `${strategic.year - 1}-10-01`,
        time_end: `${strategic.year}-09-30`,
      }));
    }
  }, [strategic]);
  useEffect(() => {
    async function fetchStrategicData() {
      // console.log(parsed);
      // console.log(parsed_actionplan);
      // setdataProject((prev) => ({
      //   ...prev,
      //   id_actionplan: parsed_actionplan.id,
      //   id_strategic: parsed.id,
      //   project_number: "P" + total,
      // }));
      try {
        const data = sessionStorage.getItem("strategic_data");
        const parsed = JSON.parse(data);
        setStrategic(JSON.parse(data)); // set state
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

  const [optionsOkr, setoptionsOkr] = useState([]);
  // const [optionsUnit, setoptionsOkr] = useState([]);
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
  const [optionsDeparment, setOptionsDeparment] = useState([]);

  const [optionsUnit, setOptionsUnit] = useState([]);

  const [optionsStrategic, setoptionsStrategic] = useState([]);

  const [optionsprinciples, setoptionsprinciples] = useState([]);

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

  const deleted_indicator = async (row, type) => {
    console.log(row);
    try {
      if (dataProject.indicator.length == 1 ) {
        Swal.fire({
          title: "ไม่สามารถลบได้ ",
          text: `ไม่สามารถลบได้เนื่องจากเป็นลำดับสุดท้ายของข้อมูล`,
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      Swal.fire({
        title: `การลบข้อมูล ${row.indicator_name}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const token = Cookies.get("token");
          const res = await Deleteindicator(token, row.id);

          if (res?.status === 200) {
            Swal.fire({
              title: "สำเร็จ",
              text: `ลบ ${row.indicator_name}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setdataProject((prev) => ({
              ...prev,
              indicator: prev.indicator.filter((item) => item.id !== row.id),
            }));
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "กรุณาลองใหม่อีกครั้ง",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
    }
  };
  const columns = [
    {
      name: "ลำดับ",
      selector: (row, index) => index + 1,
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
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={
                () =>
                  setIsOpenModalindicatorAdd({
                    isOpen: true,
                    type: 2,
                    data: row,
                  })
                // console.log(row)
              }
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() => deleted_indicator(row)}
            >
              <i className="bi bi-trash text-xl group-hover:text-red-500"></i>{" "}
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];

  const deleted_okr = async (row) => {
    console.log(row);
    try {
      if (dataProject.okr_detail_project.length == 1) {
        Swal.fire({
          title: "ไม่สามารถลบได้ ",
          text: `ไม่สามารถลบได้เนื่องจากเป็นลำดับสุดท้ายของข้อมูล`,
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      Swal.fire({
        title: `การลบข้อมูล ${row.name}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const token = Cookies.get("token");
          const res = await DeleteOkrproject(token, row.id_okr_project);

          if (res?.status === 200) {
            Swal.fire({
              title: "สำเร็จ",
              text: `ลบ ${row.name}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setdataProject((prev) => ({
              ...prev,
              okr_detail_project: prev.okr_detail_project.filter(
                (item) => item.id !== row.id
              ),
            }));
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "กรุณาลองใหม่อีกครั้ง",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
    }
  };
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
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={() =>
                setIsOpenModalOKRAdd({
                  isOpen: true,
                  type: 2,
                  data: row,
                })
              }
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() => deleted_okr(row)}
            >
              <i className="bi bi-trash text-xl group-hover:text-red-500"></i>{" "}
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];

  const deleted_objective = async (row) => {
    try {
      if (dataProject.objective.length == 1) {
        Swal.fire({
          title: "ไม่สามารถลบได้ ",
          text: `ไม่สามารถลบได้เนื่องจากเป็นลำดับสุดท้ายของข้อมูล`,
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      Swal.fire({
        title: `การลบข้อมูล ${row.name}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const token = Cookies.get("token");
          const res = await DeleteObjective(token, row.id);

          if (res?.status === 200) {
            Swal.fire({
              title: "สำเร็จ",
              text: `ลบวัตถุประสงค์ ${row.name}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setdataProject((prev) => ({
              ...prev,
              objective: prev.objective.filter((item) => item.id !== row.id),
            }));
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "กรุณาลองใหม่อีกครั้ง",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
    }
  };
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
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={() =>
                setIsOpenModalObjectiveAdd({
                  isOpen: true,
                  type: 2,
                  data: row,
                })
              }
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() => deleted_objective(row)}

              //   setdataProject((prev) => ({
              //     ...prev,
              //     objective: prev.objective.filter(
              //       (item) => item.id !== row.id
              //     ),
              //   }))
              // }
            >
              <i className="bi bi-trash text-xl group-hover:text-red-500"></i>{" "}
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];

  const deleted_projectuser = async (row, type) => {
    console.log(row);
    try {
      if (dataProject.employee.length == 1 && type == 1) {
        Swal.fire({
          title: "ไม่สามารถลบได้ ",
          text: `ไม่สามารถลบได้เนื่องจากเป็นลำดับสุดท้ายของข้อมูล`,
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      } else if (dataProject.teacher.length == 1 && type == 2) {
        Swal.fire({
          title: "ไม่สามารถลบได้ ",
          text: `ไม่สามารถลบได้เนื่องจากเป็นลำดับสุดท้ายของข้อมูล`,
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      Swal.fire({
        title: `การลบข้อมูล ${row.name}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const token = Cookies.get("token");
          const res = await Deleteprojectuser(
            token,
            row.id_project_users,
            type
          );

          if (res?.status === 200) {
            Swal.fire({
              title: "สำเร็จ",
              text: `ลบ ${row.name}`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            if (type == 1) {
              setdataProject((prev) => ({
                ...prev,
                employee: prev.employee.filter((item) => item.id !== row.id),
              }));
            } else {
              setdataProject((prev) => ({
                ...prev,
                teacher: prev.teacher.filter((item) => item.id !== row.id),
              }));
            }
          } else {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "กรุณาลองใหม่อีกครั้ง",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          }
        }
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
    }
  };
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
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={() =>
                setIsOpenModalEmployeeAdd({
                  isOpen: true,
                  type: 2,
                  data: row,
                })
              }
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() => deleted_projectuser(row, 1)}
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
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={() =>
                setIsOpenModalTeacherAdd({
                  isOpen: true,
                  type: 2,
                  data: row,
                })
              }
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100  group"
              onClick={() => deleted_projectuser(row, 2)}
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

  const handleEditproject = async (row) => {
    // const newStatus = row.status === 1 ? 0 : 1;
    console.log(row);
    const isEmpty = (value) => {
      if (Array.isArray(value)) return value.length === 0;
      return value === null || value === "";
    };
    if (
      row.project_name === olddataProject.project_name &&
      row.project_number === olddataProject.project_number &&
      row.id_department === olddataProject.id_department &&
      row.abstract === olddataProject.abstract &&
      row.result === olddataProject.result &&
      row.obstacle === olddataProject.obstacle &&
      JSON.stringify(row.style_detail) ===
        JSON.stringify(olddataProject.style_detail) &&
      JSON.stringify(row.project_principle) ===
        JSON.stringify(olddataProject.project_principle) &&
      row.location === olddataProject.location
    ) {
      Swal.fire({
        icon: "warning",
        title: "ยังไม่มีการแก้ไขข้อมูล",
      });
      return;
    }
    const ignoreFields = [
      "id_project",
      "result",
      "indicator",
      "teacher",
      "employee",
      "objective",
      "okr_detail_project",
    ];

    const emptyFields = Object.entries(dataProject)
      .filter(([key]) => !ignoreFields.includes(key))
      .filter(([_, value]) => isEmpty(value))
      .map(([key]) => key); // ได้ชื่อฟิลด์ที่ว่าง

    const fieldLabels = {
      project_name: "ชื่อโครงการ",
      project_number: "รหัสโครงการ",
      location: "สถานที่ดำเนินการ",
      id_department: "หน่วยงานที่รับผิดชอบ",
      year: "ปีงบประมาณ",
      id_strategic: "ยุทธศาสตร์",
      id_actionplan: "กลยุทธ์",
      project_principle: "หลักการและเหตุผล",
      budget: "งบประมาณ",
      time_start: "วันเริ่มต้น",
      time_end: "วันสิ้นสุด",
      style_detail: "ลักษณะโครงการ",
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
      text: `คุณต้องการเพิ่ม "${row.project_name}" หรือไม่`,
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
        const response = await GetEditProject(token, row);
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
            // Cookies.remove("dataProject", { path: "/" });
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
          title: "เกิดข้อผิดพลาด",
          text: `ไม่สามารถเพิ่มข้อมูล กรุณาลองใหม่อีกครั้ง`,
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
            <div className="col-span-12 xl:col-span-10  md:col-span-9 mt-5 ms-4 md:mt-3 me-4 mb-8 pb-8 md:me-6 border border-gray-300 rounded-lg shadow-xl">
              <div className="flex flex-row items-center justify-between py-4 px-8">
                <div className="text-lg md:text-3xl">
                  แบบฟอร์มโครงการตามแผนปฏิบัติการ วิทยาลัยการคอมพิวเตอร์
                  มหาวิทยาลัยขอนแก่น
                </div>
              </div>
              <hr className="w-full border-gray-300" />
              <div className="grid grid-cols-12 gap-x-8 gap-y-6 mt-3 px-4 md:px-8">
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ชื่อโครงการ
                  </span>
                  <input
                    type="text"
                    id="nameproject"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรุณากรอกชื่อโครงการ"
                    required
                    value={dataProject.project_name || ""}
                    onChange={(e) =>
                      setdataProject((prev) => ({
                        ...prev,
                        project_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    รหัสโครงการ
                  </span>
                  <input
                    type="text"
                    id="idproject"
                    className="bg-gray-50  shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรุณากรอกรหัสโครงการ"
                    readOnly
                    value={dataProject.project_number}
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
                    value={dataProject.location || ""}
                    onChange={(e) =>
                      setdataProject((prev) => ({
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
                      dataProject.budget
                        ? Number(dataProject.budget).toLocaleString("th-TH")
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
                          setdataProject({
                            ...dataProject,
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
                      className="flex items-center justify-between"
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
                          className="bg-gray-50  xl:w-67 md:w-38 w-34 shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date start"
                          value={dataProject.time_start}
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
                          className="bg-gray-50  xl:w-67 md:w-38 w-34 shadow-md border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Select date end"
                          value={dataProject.time_end}
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
                      (option) => option.value === dataProject.id_department
                    )}
                    // value={dataProject.deparment || ""}
                    onChange={(e) => {
                      console.log("Selected Value:", e.value);
                      setdataProject({
                        ...dataProject,
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
                      (option) => option.value === dataProject.year
                    )}
                    onChange={(e) => {
                      setdataProject({
                        ...dataProject,
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
                <div className="col-span-12 md:col-span-6">
                  <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ลักษณะโครงการ
                  </span>

                  <div className="grid grid-cols-12 gap-2">
                    {optionstype.map((item) => {
                      return (
                        <div
                          key={item.value}
                          className="flex items-center col-span-12 md:col-span-4 xl:col-span-4"
                        >
                          <input
                            id={`checkbox-${item.value}`}
                            type="checkbox"
                            value={item.value}
                            checked={dataProject.style_detail.includes(
                              item.value
                            )}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() =>
                              setdataProject((prev) => ({
                                ...prev,
                                style_detail: prev.style_detail.includes(
                                  item.value
                                )
                                  ? prev.style_detail.filter(
                                      (v) => v !== item.value
                                    )
                                  : [...prev.style_detail, item.value],
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
                            checked={dataProject.project_principle.includes(
                              item.value
                            )}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() =>
                              setdataProject((prev) => ({
                                ...prev,
                                project_principle:
                                  prev.project_principle.includes(item.value)
                                    ? prev.project_principle.filter(
                                        (v) => v !== item.value
                                      )
                                    : [...prev.project_principle, item.value],
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
                      (option) => option.value === dataProject.strategic
                    )}
                    onChange={(e) => {
                      setdataProject({
                        ...dataProject,
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
                  {/* <Select
                    id="actionplan"
                    value={optionsActionplan.find(
                      (option) => option.value === dataProject.actionplan
                    )}
                    onChange={(e) => {
                      setdataProject({
                        ...dataProject,
                        actionplan: e.value,
                      });
                    }}
                    options={optionsActionplan}
                    styles={customStyles}
                    className={`text-sm shadow-md ${
                      dataProject.strategic === null
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    placeholder="กรุณาเลือกกลยุทธ์"
                    isDisabled={dataProject.strategic === null}
                    instanceId="strategic-select" // Add this line to fix duplicate IDs
                  /> */}
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
                    value={dataProject.abstract}
                    onChange={(value) =>
                      setdataProject({
                        ...dataProject,
                        abstract: value, // value คือค่าจาก editor.getData()
                      })
                    }
                  />
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
                          value={dataProject.obstacle}
                          onChange={(value) =>
                            setdataProject({
                              ...dataProject,

                              obstacle: value, // value คือค่าจาก editor.getData()
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex flex-col ">
                    <div className="flex flex-row justify-between mb-2">
                      <h2>ผลที่คาดว่าจะได้รับ </h2>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <CustomEditor
                          value={dataProject.result}
                          onChange={(value) =>
                            setdataProject({
                              ...dataProject,

                              result: value, // value คือค่าจาก editor.getData()
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 mt-4 flex flex-row justify-end">
                  <button
                    type="button"
                    onClick={() => handleEditproject(dataProject)}
                    className="bg-green-500 text-white text-sm px-12 py-2 rounded-md hover:bg-blue-600"
                  >
                    บันทึก
                  </button>
                </div>
                <div className="col-span-12 mt-4">
                  <hr className="text-gray-200" />
                </div>

                <div className="col-span-12">
                  <div className="flex flex-col ">
                    <div className="flex flex-row justify-between mb-2">
                      <h2>OKR </h2>
                      <button
                        type="button"
                        onClick={() =>
                          setIsOpenModalOKRAdd({
                            isOpen: true,
                            type: 1,
                            data: null,
                          })
                        }
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
                          data={dataProject.okr_detail_project}
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

                <div className="col-span-12">
                  <div className="flex flex-col ">
                    <div className="flex flex-row justify-between mb-2">
                      <h2>วัตถุประสงค์ </h2>
                      <button
                        type="button"
                        onClick={() =>
                          setIsOpenModalObjectiveAdd({
                            isOpen: true,
                            type: 1,
                            data: null,
                          })
                        }
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns_objective}
                          data={dataProject.objective}
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
                      <h2>ตัวชี้วัดและค่าเป้าหมายของโครงการ/กิจกรรม </h2>
                      <button
                        type="button"
                        onClick={() =>
                          setIsOpenModalindicatorAdd({
                            isOpen: true,
                            type: 1,
                            data: null,
                          })
                        }
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns}
                          data={dataProject.indicator}
                          customStyles={customStylesTable}
                          fixedHeaderScrollHeight="100%"
                          noDataComponent={
                            <div className="text-gray-500 py-4 text-center">
                              ยังไม่เพิ่มข้อมูล
                              ตัวชี้วัดและค่าเป้าหมายของโครงการ
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
                      <h2>ผู้รับผิดชอบระดับปฏิบัติ </h2>
                      <button
                        type="button"
                        onClick={() =>
                          setIsOpenModalEmployeeAdd({
                            isOpen: true,
                            type: 1,
                            data: null,
                          })
                        }
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns_useremployee}
                          data={dataProject.employee}
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
                        onClick={() =>
                          setIsOpenModalTeacherAdd({
                            isOpen: true,
                            type: 1,
                            data: null,
                          })
                        }
                        className=" top-9 right-2 bg-blue-500 text-white text-sm px-8 py-1.5 rounded-md hover:bg-blue-600"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-md border border-gray-200 shadow-md mt-3 ">
                        <DataTable
                          columns={columns_userteacher}
                          data={dataProject.teacher}
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
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpenModalOKRAdd.isOpen && dataProject.project_id && (
        <ModalAddOkrNew
          onClose={() => setIsOpenModalOKRAdd({ isOpen: false, type: null })}
          isOpen={isOpenModalOKRAdd.isOpen}
          type={isOpenModalOKRAdd.type}
          old={isOpenModalOKRAdd.data}
          id_project={dataProject.project_id}
          data={dataProject.okr_detail_project}
          onSelectOkr={(selectedOkrValue) => {
            if (isOpenModalOKRAdd.type === 1) {
              setdataProject((prev) => ({
                ...prev,
                okr_detail_project: [
                  ...(prev.okr_detail_project || []),
                  {
                    id_okr_project: selectedOkrValue.id,
                    id: selectedOkrValue.value,
                    name: selectedOkrValue.label,
                  },
                ],
              }));
            } else {
              // console.log(selectedOkrValue);
              // console.log(dataProject);
              setdataProject((prev) => ({
                ...prev,
                okr_detail_project: prev.okr_detail_project.map((item) =>
                  item.id_okr_project === selectedOkrValue.id
                    ? {
                        ...item,
                        id: selectedOkrValue.value,
                        name: selectedOkrValue.label,
                      }
                    : item
                ),
              }));
            }
          }}
          okr={optionsOkr}
        />
      )}

      {isOpenModalObjectiveAdd.isOpen && dataProject.project_id && (
        <ModalAddObjectiveNew
          onClose={() =>
            setIsOpenModalObjectiveAdd({ isOpen: false, type: null })
          }
          isOpen={isOpenModalObjectiveAdd.isOpen}
          type={isOpenModalObjectiveAdd.type}
          old={isOpenModalObjectiveAdd.data}
          id_project={dataProject.project_id}
          objective={dataProject.objective}
          onSelectOkr={(selectedOkrValue) => {
            console.log(selectedOkrValue);
            if (isOpenModalObjectiveAdd.type === 1) {
              setdataProject((prev) => ({
                ...prev,
                objective: [
                  ...(prev.objective || []),
                  {
                    id: selectedOkrValue.id,
                    name: selectedOkrValue.name,
                  },
                ],
              }));
            } else {
              setdataProject((prev) => ({
                ...prev,
                objective: prev.objective.map(
                  (item) =>
                    item.id === selectedOkrValue.id
                      ? { ...item, name: selectedOkrValue.name } // อัปเดตชื่อ
                      : item // คงเดิมถ้าไม่ใช่
                ),
              }));
            }
          }}
          okr={optionsOkr}
        />
      )}

      {isOpenModalEmployeeAdd.isOpen && (
        <ModalAddUserNew
          onClose={() =>
            setIsOpenModalEmployeeAdd({ isOpen: false, type: null })
          }
          isOpen={isOpenModalEmployeeAdd.isOpen}
          type={isOpenModalEmployeeAdd.type}
          data={dataProject.employee}
          id_project={dataProject.project_id}
          id_year={dataProject.id_year}
          olduser={isOpenModalEmployeeAdd.data}
          onSelectuser={(selectedOkrValue) => {
            // console.log(selectedOkrValue),
            if (isOpenModalEmployeeAdd.type === 1) {
              setdataProject((prev) => {
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
            } else {
              // console.log(dataProject);
              // console.log(selectedOkrValue);
              setdataProject((prev) => ({
                ...prev,
                employee: prev.employee.map((item) =>
                  item.id_project_users === selectedOkrValue.id
                    ? {
                        ...item,
                        id: selectedOkrValue.value,
                        name: selectedOkrValue.label,
                        position: selectedOkrValue.position,
                      }
                    : item
                ),
              }));
            }
          }}
          user={optionsemployee}
        />
      )}

      {isOpenModalTeacherAdd.isOpen && (
        <ModalAddTeacherNew
          onClose={() =>
            setIsOpenModalTeacherAdd({ isOpen: false, type: null })
          }
          isOpen={isOpenModalTeacherAdd.isOpen}
          type={isOpenModalTeacherAdd.type}
          data={dataProject.teacher}
          id_project={dataProject.project_id}
          id_year={dataProject.id_year}
          olduser={isOpenModalTeacherAdd.data}
          onSelectuser={(selectedOkrValue) => {
            // console.log(selectedOkrValue),
            if (isOpenModalTeacherAdd.type === 1) {
              setdataProject((prev) => {
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
            } else {
              // console.log(selectedOkrValue);
              // console.log(dataProject);
              setdataProject((prev) => ({
                ...prev,
                teacher: prev.teacher.map((item) =>
                  item.id_project_users === selectedOkrValue.id
                    ? {
                        ...item,
                        id: selectedOkrValue.value,
                        name: selectedOkrValue.label,
                        position: selectedOkrValue.position,
                      }
                    : item
                ),
              }));
            }
          }}
          user={optionsteacher}
        />
      )}
      {isOpenModalindicatorAdd.isOpen && (
        <ModalAddindicatorNew
          onClose={() =>
            setIsOpenModalindicatorAdd({ isOpen: false, type: null })
          }
          isOpen={isOpenModalindicatorAdd.isOpen}
          type={isOpenModalindicatorAdd.type}
          data={dataProject.indicator}
          indicator={isOpenModalindicatorAdd.data}
          id_project={dataProject.project_id}
          id_year={dataProject.id_year}
          olduser={isOpenModalindicatorAdd.data}
          onSelectindicator={(selectedOkrValue) => {
            if (isOpenModalindicatorAdd.type === 1) {
              setdataProject((prev) => {
                const exists = (prev.indicator || []).some(
                  (item) => item.id === selectedOkrValue.id
                );

                if (exists) return prev;

                return {
                  ...prev,
                  indicator: [
                    ...(prev.indicator || []),
                    {
                      id: selectedOkrValue.id,
                      indicator_name: selectedOkrValue.name,
                      unit_name: {
                        value: selectedOkrValue.unit_id,
                        label: selectedOkrValue.unit_name,
                      },
                      goal: selectedOkrValue.goal,
                    },
                  ],
                };
              });
            } else {
              // console.log(selectedOkrValue);
              // console.log(dataProject);
              setdataProject((prev) => ({
                ...prev,
                indicator: prev.indicator.map((item) =>
                  item.id === selectedOkrValue.id
                    ? {
                        ...item,
                        indicator_name: selectedOkrValue.name,
                        unit_name: {
                          value: selectedOkrValue.unit_id,
                          label: selectedOkrValue.unit_name,
                        },
                        goal: selectedOkrValue.goal,
                      }
                    : item
                ),
              }));
            }
          }}
          unit={optionsUnit}
        />
      )}
    </>
  );
}
