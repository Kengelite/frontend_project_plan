"use client";
import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import {
  GetDatastrategicYear,
} from "../../fetch_api/fetch_api_admin"; // ปรับ path ตามจริง
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import Cookies from "js-cookie";
import { FiEdit2 } from "react-icons/fi";
import Switch from "react-switch";
import Swal from "sweetalert2";
import { FaBalanceScale } from "react-icons/fa";

export default function DatatableStrig({
  year_id,
  onTotalChange,
  onEdit,
  year,
}) {
  const [data, setData] = useState([]);
  const [SecrchData, setSecrchData] = useState([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const columns = [
    {
      name: "รหัส",
      selector: (row) => row.strategic_number,
      sortable: true,
      width:"100px"
    },
    {
      name: "ชื่อ",
      selector: (row) => row.strategic_name,
      sortable: true,
      wrap: true,
      width: "350px",
    },
    {
      name: "กลยุทธ์",
      selector: (row) => row.action_plan_count,
      sortable: true,
      center: "true",
      
    },
    {
      name: "โครงการ",
      selector: (row) => row.projects_count,
      sortable: true,
      center: "true",
      width: "140px",
    },
    {
      name: "งบประมาณ (บาท)",
      // selector: (row) => row.budget,
      sortable: true,
      right: "true",
      width: "160px",
      selector: (row) => row.budget,
      wrap: true,
      cell: (row) =>
        `${parseFloat(row.budget).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} `,
    },
    {
      name: "ใช้ไป (บาท)",
      sortable: true,
      right: "true",
      width: "160px",
      selector: (row) => row.spend_money,
      cell: (row) =>
        `${parseFloat(row.spend_money).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} `,
    },
    {
      name: "คงเหลือ (บาท)",
      sortable: true,
      right: "true",
      width: "160px",
      selector: (row) => row.budget - row.spend_money,
      cell: (row) =>
        `${parseFloat(row.budget - row.spend_money).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} `,
    },
    {
      name: "จัดการ",
      // width: "200px",
      cell: (row) => (
        <>
          <div style={{ padding: "5px" }}>
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group "
              onClick={() => {
                // เก็บข้อมูลที่ต้องส่งไว้ใน sessionStorage
                sessionStorage.setItem(
                  "strategic_data",
                  JSON.stringify({
                    id: row.strategic_id,
                    name: row.strategic_name,
                    budget: row.budget,
                    Balance: row.budget - row.spend_money,
                    year_id: year_id,
                    year: year,
                  })
                );

                // เปลี่ยนหน้า
                window.location.href = `/admin/strategic/${row.strategic_number}`;
              }}
            >
              <i className="bi bi-eye text-gray-500 text-xl group-hover:text-blue-500"></i>
            </button>
          </div>
          {/* <div style={{ padding: "5px" }}>
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={() => {
                // newname, id, number, budget, id_year
                onEdit(
                  row.strategic_name,
                  row.strategic_id,
                  row.strategic_number,
                  row.budget,
                  row.id_year
                );
              }}
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div> */}
          {/* <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 hover:text-red-500 "
              onClick={() => handleDelete(row)} // เรียกใช้ฟังก์ชัน handleDelete เมื่อกดปุ่ม
            >
              <i className="bi bi-trash text-xl "></i>
            </button>
          </div> */}
        </>
      ),
      ignoreRowClick: true,
    },
  ];
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState(10); // default เป็น 10
  const [hasMounted, setHasMounted] = useState(false);

  const fetchData = useCallback(
    async (page = 1, perPage = 10) => {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const res = await GetDatastrategicYear(token, year_id, page, perPage);
        setData(res.data);
        setSecrchData(res.data);
        setTotalRows(res.total);
        if (onTotalChange) {
          onTotalChange(res.total);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    },
    [year_id]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    if (hasMounted) {
      fetchData(page, perPage);
    }
  }, [fetchData, hasMounted, page, perPage]);

  // ฟังก์ชันจัดการการเปลี่ยนหน้า
  const handlePageChange = (newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  // ฟังก์ชันจัดการการเปลี่ยนจำนวนแถวต่อหน้า
  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const customStyles = {
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
    const filtered = data.filter((data) => {
      const budget = Number(data.budget);
      const spendMoney = Number(data.spend_money);
      const remainingBudget = budget - spendMoney; // คำนวณเหมือนใน cell

      return `${data.strategic_name} ${data.strategic_number} ${budget} ${spendMoney} ${remainingBudget}`
        .toLowerCase()
        .includes(SearchTerm.toLowerCase());
    });

    setSecrchData(filtered);
  }, [SearchTerm, data]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-300"></div>
          <span className="ml-3 text-gray-300">กำลังโหลดข้อมูล...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400">
          ยังไม่มีข้อมูล
        </div>
      ) : (
        <div className="">
          <input
            type="text"
            className="form-control my-3  p-2  w-full  border border-gray-300 rounded-md"
            placeholder="ค้นหา..."
            value={SearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="bg-white  rounded-md border border-gray-200 shadow-xl  "
            style={{ height: "90vh", display: "flex", flexDirection: "column" }}
          >
            {" "}
            <DataTable
              columns={columns}
              data={SecrchData}
              customStyles={customStyles} // สำหรับหัวตาราง
              pagination
              paginationServer // ← สำคัญ: ใช้ pagination แบบ server
              paginationPerPage={perPage}
              paginationDefaultPage={page}
              paginationTotalRows={totalRows} // ← ส่งจำนวน row ทั้งหมดมาจาก Laravel
              onChangePage={handlePageChange} // ← เรียกเมื่อเปลี่ยนหน้า
              onChangeRowsPerPage={handlePerRowsChange}
              fixedHeaderScrollHeight="100%" // ให้ scroll สูงเต็ม container
            />
          </div>
        </div>
      )}
    </div>
  );
}
