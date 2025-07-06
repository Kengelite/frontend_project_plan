"use client";
import Image from "next/image";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import Menu from "../component/nav_admin";
import Cookies from "js-cookie";
import Header from "../component/header";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  Grid,
  Settings,
  User,
} from "lucide-react";
import { GetDataPositionUse } from "../../fetch_api/fetch_api_superadmin";
import DatatableUser from "../componentTable/user";
import { ModalUser } from "./modal";
export default function HomePerson() {
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [type, settype] = useState(null);
  const [data, setdata] = useState({
    id: null,
    name: null,
  });
  const [optionsPosition, setOptionsPosition] = useState([]);
  const [yearOptions, setyearOptions] = useState([
    // { value: 1, label: "2568" },
  ]);
  const [academicOptions, setacademicOptions] = useState([
    { value: 1, label: "เจ้าหน้าที่" },
    { value: 0, label: "อาจารย์" },
  ]);
  const [Year, setYear] = useState({
    // year_id: "2568",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = Cookies.get("token");
        const res_Position = await GetDataPositionUse(token);
        const mappedDeparmentOptions = res_Position.map((item) => ({
          value: item.position_id,
          label: item.position_name,
        }));

        console.log(res_Position);
        setOptionsPosition(mappedDeparmentOptions);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData(); // <-- ต้องเรียกฟังก์ชันที่ประกาศไว้
  }, []); // <-- ปิดวงเล็บของ useEffect
  useEffect(() => {
    if (yearOptions.length > 0 && !Year.year_id) {
      setYear({
        ...Year,
        year_id: yearOptions[0].year_id,
      });
    }
  }, [yearOptions]);

  const toggleModalAdd = () => {
    settype(1);
    setdata((prev) => ({
      ...prev,
      id: null,
      name: null,
      email: null,
      academic_position: null,
      url_img: null,
      id_position: null,
    }));
    setIsOpenModalAdd(!isOpenModalAdd); // เปลี่ยนสถานะของ modal
  };

  const toggleModalEdit = (row) => {
    settype(2);
    console.log(row);
    setdata((prev) => ({
      ...prev,
      id: row.id,
      name: row.name,
      email: row.email,
      // password : row.password,
      academic_position: row.academic_position,
      url_img: row.url_img,
      id_position: row.id_position,
    }));
    setIsOpenModalAdd(!isOpenModalAdd); // เปลี่ยนสถานะของ modal
  };
  useEffect(() => {
    // กด esc แล้วปืด
    console.log(isOpenModalAdd);
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
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <div className="text-lg md:text-2xl me-3 ">บุคลากรทั้งหมด</div>
              </div>
              <button
                onClick={toggleModalAdd}
                className="w-30 me-2 md:me-8 md:w-30 py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                เพิ่มข้อมูล
              </button>
            </div>
            <div>
              <DatatableUser edit={toggleModalEdit} />
              {/* <DatatableProject /> */}
            </div>
          </div>
        </div>
        <ModalUser
          isOpen={isOpenModalAdd}
          onClose={() => setIsOpenModalAdd(false)}
          type={type}
          academic={academicOptions}
          position={optionsPosition}
          data={data}
        />
      </div>
    </>
  );
}
