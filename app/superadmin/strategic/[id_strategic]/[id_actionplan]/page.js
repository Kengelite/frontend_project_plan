"use client";
import Image from "next/image";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import Menu from "../../../component/nav_admin";
import Header from "../../../component/header";
import { ModalAddProject } from "../../component/modal_project";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  Grid,
  Settings,
  User,
} from "lucide-react";
import Aos from "aos";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import DatatableProject from "../../../component/project";

export default function HomeProject({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [Actionplan, setActionplan] = useState({
    id: "",
    name: "",
    budget: "",
  });
  const [Strategic, setStrategic] = useState({ id: "", name: "", budget: "" });
  const [open, setOpen] = useState(false);
  const { id_strategic, id_actionplan } = use(params);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [isOpenModalAddNew, setIsOpenModalAddNew] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [MaxBudget, setMaxBudget] = useState(0);
  useEffect(() => {
    const data = sessionStorage.getItem("actionplan_data");
    const data_strategic = sessionStorage.getItem("strategic_data");

    if (!data || !data_strategic) {
      window.location.href = `/superadmin/strategic`;
    }
    console.log(data);
    console.log(data);
    console.log(data_strategic);
    if (data) {
      setActionplan(JSON.parse(data));
      setStrategic(JSON.parse(data_strategic));
    }
  }, []);

  useEffect(() => {
    Aos.init({
      duration: 300,
      once: false,
    });
  }, []);

  const toggleModalAdd = () => {
    setIsOpenModalAdd(!isOpenModalAdd); // เปลี่ยนสถานะของ modal
  };

  useEffect(() => {
    // กด esc แล้วปืด
    console.log(isOpenModalAddNew);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isOpenModalAdd) {
          toggleModalAdd(); // ปิด Modal ถ้าเปิดอยู่
        }
      }
    };
    // handleKeyDown คือฟังก์ชันที่ฟัง event การกดปุ่มบนคีย์บอร์ด (เช่น Escape)
    document.addEventListener("keydown", handleKeyDown);

    // ใช้ลบ event listener เพื่อป้องกันปัญหา memory leak หรือ event ถูกเรียกซ้ำซ้อน
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpenModalAdd]);

  const handleModalSelect = (type) => {
    if (type === "new") {
      toggleModalAdd();
      if (parseFloat(Actionplan.budget - MaxBudget) > 0) {
        router.push(
          `./${id_actionplan}/addnewproject?total=${
            totalRows + 1
          }&maxbudget=${parseFloat(Actionplan.budget - MaxBudget)}`
        );
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "งบประมาณไม่เพียงพอในการเพิ่มโครงการใหม่",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    }
  };

  return (
    <>
      <div className="">
        <Header />
        <hr />
        <div className="grid grid-cols-12  gap-0 w-full min-h-screen mt-20">
          <div className="bg-gray-100  xl:col-span-2 hidden md:block md:col-span-3 pt-4 ps-3">
            <Menu />
          </div>
          <div className="col-span-12 xl:col-span-10  md:col-span-9 mt-5 ms-4 md:mt-3 me-4 md:me-6">
            <div className="flex flex-col">
              <nav classme="flex mb-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <a
                      href="/superadmin/strategic"
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3 me-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                      </svg>
                      หน้าแรก
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <a
                        href={`/superadmin/strategic/${id_strategic}`}
                        className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                      >
                        {id_strategic}
                      </a>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg
                        className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                      <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                        {id_actionplan} : {Actionplan.name}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              <div className="text-lg md:text-2xl  font-bold">
                จัดการโครงการ
              </div>
              <div className="text-lg md:text-2xl  ">
                {" "}
                {id_actionplan} {Actionplan.name}
              </div>
              <div className="flex justify-between ">
                <div className="text-lg md:text-2xl  ">
                  {" "}
                  งบประมาณ{" "}
                  {Number(Actionplan.budget).toLocaleString("th-TH", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  บาท
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="text-lg md:text-2xl   ">
                  {" "}
                  คงเหลือ{" "}
                  {Number(Actionplan.Balance).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </div>
                <div className="flex gap-4">
                  <button
                    data-modal-target="popup-modal"
                    data-modal-toggle="popup-modal"
                    onClick={toggleModalAdd}
                    className="w-22 justify-end md:w-25 py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-700"
                  >
                    เพิ่มข้อมูล 
                  </button>
                </div>
              </div>
            </div>
            <div>
              {Actionplan.id && (
                <DatatableProject
                  id_action={Actionplan.id}
                  val={{ id_strategic, id_actionplan }}
                  onTotalChange={setTotalRows}
                  onMaxBudgetChange={setMaxBudget}
                  strategicName={Strategic.name}
                  actionplanName={Actionplan.name}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalAddProject
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        onSelect={handleModalSelect}
      />
    </>
  );
}
