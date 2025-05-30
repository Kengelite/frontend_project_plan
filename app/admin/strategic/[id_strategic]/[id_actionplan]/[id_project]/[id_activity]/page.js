"use client";
import Image from "next/image";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import Menu from "../../../../../component/nav_admin";
import Header from "../../../../../component/header";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  Grid,
  Settings,
  User,
} from "lucide-react";
import DatatableActivityDetail from "../../../../../component/activitydetail";

export default function HomeActivity({ params }) {
  const searchParams = useSearchParams();
  const [Activity, setActivity] = useState({ id: "", name: "", budget: "" });
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(false);
  
  const { id_strategic, id_actionplan, id_project, id_activity } = use(params);
  useEffect(() => {
    const data = sessionStorage.getItem("activitydetail_data");
    const project_data = sessionStorage.getItem("project_data");
    const strategic_data = sessionStorage.getItem("strategic_data");
    const actionplan_data = sessionStorage.getItem("actionplan_data");
    // console.log(data)
    if (!data || !project_data ||!strategic_data ||!actionplan_data ) {
      window.location.href = `/admin/strategic`;
    }
    console.log(data);
    if (data) {
      setActivity(JSON.parse(data));
    }
  }, []);

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
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <a
                      href="/admin/strategic"
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
                        href={`/admin/strategic/${id_strategic}`}
                        className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                      >
                        {id_strategic}
                      </a>
                    </div>
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
                        href={`/admin/strategic/${id_strategic}/${id_actionplan}`}
                        className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                      >
                        {id_actionplan}
                      </a>
                    </div>
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
                        href={`/admin/strategic/${id_strategic}/${id_actionplan}/${id_project}`}
                        className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                      >
                        {id_project}
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
                        {id_activity} : {Activity.name}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="text-lg md:text-2xl me-3  font-bold">
                จัดการรายละเอียดกิจกรรม
              </div>
              <div className="text-lg md:text-2xl me-3  ">
                {" "}
                {id_activity} ​: {Activity.name}
              </div>
              <div className="flex justify-between ">
                <div className="text-lg md:text-2xl   ">
                  {" "}
                  งบประมาณ{" "}
                  {Number(Activity.budget).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="text-lg md:text-2xl   ">
                  {" "}
                  คงเหลือ{" "}
                  {Number(Activity.Balance).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </div>
                <a
                  data-modal-target="popup-modal"
                  data-modal-toggle="popup-modal"
                  // onClick={toggleModalAdd}
                  className="w-22 justify-end text-center md:w-25 py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-700"
                  href={`./${id_activity}/add?total=${total+1}&maxBudget=${Activity.Balance}`}
                >
                  รายงานผล
                </a>
              </div>
            </div>
            <div>
              {Activity.id && (
                <DatatableActivityDetail
                  id_activityref={Activity.id}
                  onEditTotal={setTotal}
                  val={{ id_strategic, id_actionplan, id_project, id_activity ,total }}
                  Balance={Activity.Balance}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
