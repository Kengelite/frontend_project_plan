"use client";
import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import {
  GetDataactionplanByidproject,
  UpdatestatusActivity,
  DeleteActivity,
  SendEmailActivity,
} from "../../fetch_api/fetch_api_superadmin"; // ปรับ path ตามจริง
import Link from "next/link";
import Cookies from "js-cookie";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FiEdit2 } from "react-icons/fi";
import Switch from "react-switch";
import Swal from "sweetalert2";
import { MdEmail } from "react-icons/md";
export default function DatatableActivity({
  id_projectref,
  val,
  onMaxBudgetChange,
  onTotalChange,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SecrchData, setSecrchData] = useState([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // default เป็น 10
  const [hasMounted, setHasMounted] = useState(false);

  const { id_strategic, id_actionplan, id_project } = val;
  const fetchData = useCallback(async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      // console.log("token : ", id_projectref);
      const res = await GetDataactionplanByidproject(
        token,
        id_projectref,
        page,
        perPage
      );
      // console.log(res.data);
      setData(res.data);
      setSecrchData(res.data);
      setTotalRows(res.total);
      if (onTotalChange) {
        onTotalChange(res.total);
      }

      const totalBudget = res.data.reduce(
        (sum, item) => sum + parseFloat(item.budget),
        0
      );
      console.log(totalBudget);
      onMaxBudgetChange(totalBudget);

      // console.log(res);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      fetchData(page, perPage);
    }
  }, [fetchData, hasMounted, page, perPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Fixed handlePerRowsChange function
  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };
  useEffect(() => {
    const filtered = data.filter((data) => {
      const budget = Number(data.budget);
      const spendMoney = Number(data.spend_money);
      const remainingBudget = budget - spendMoney; // คำนวณเหมือนใน cell

      return `${data.name_activity} ${data.id} ${budget} ${spendMoney} ${remainingBudget}`
        .toLowerCase()
        .includes(SearchTerm.toLowerCase());
    });

    setSecrchData(filtered);
  }, [SearchTerm, data]);

  const columns = [
    {
      name: "ลำดับ",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.name_activity,
      sortable: true,
      wrap: true,
      width: "300px",
      cell: (row) => (
        <div style={{ padding: "10px 0px" }}>{row.name_activity}</div>
      ),
    },
    {
      name: "รายงานผล",
      selector: (row) => row.activity_detail_count,
      sortable: true,
      center: "true",
      width: "160px",
      cell: (row) => (
        <div className="flex items-center h-full">
          {row.activity_detail_count}
        </div>
      ),
    },
    {
      name: "งบประมาณ (บาท)",
      selector: (row) => row.budget,
      sortable: true,
      wrap: true,
      right: "true",
      width: "160px",
      cell: (row) =>
        `${Number(row.budget).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} `,
    },
    {
      name: "ใช้ไป (บาท)",
      sortable: true,
      selector: (row) => row.spend_money,
      right: "true",
      width: "160px",
      cell: (row) =>
        `${Number(row.spend_money).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} `,
    },
    {
      name: "คงเหลือ (บาท)",
      sortable: true,
      right: "true",
      selector: (row) => row.budget - row.spend_money,
      width: "160px",
      cell: (row) =>
        `${Number(row.budget - row.spend_money).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} `,
    },
    {
      name: "สถานะรายงาน",
      width: "200px",
      sortable: true,
      center: "true",
      cell: (row) => {
        let text = "";
        let bg = "";

        switch (row.status_report) {
          case 0:
            text = "ยังไม่มีการรายงาน";
            bg = "bg-yellow-200 text-yellow-800";
            break;
          case 1:
            text = "มีการรายงานเรียบร้อย";
            bg = "bg-green-200 text-green-800";
            break;
          case 2:
            text = "หมดเวลารายงานโดยไม่มีการรายงาน";
            bg = "bg-red-200 text-red-800";
            break;
          default:
            text = "-";
            bg = "bg-gray-200 text-gray-800";
        }

        return (
          <span className={`px-2 py-1 rounded text-sm font-medium ${bg}`}>
            {text}
          </span>
        );
      },
    },
    {
      name: "จำนวนการแจ้งเตือน",
      selector: (row) => row.count_send_email,
      sortable: true,
      center: "true",
      width: "200px",
      cell: (row) => (
        <div className="flex items-center h-full">{row.count_send_email}</div>
      ),
    },
    {
      name: "แจ้งเตือน",
      width: "160px",
      cell: (row) => (
        <>
          <div style={{ padding: "5px" }}>
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group "
              onClick={() => handleNotiEmail(row)}
            >
              <MdEmail
                className="text-gray-500 text-xl group-hover:text-blue-500"
                size={24}
              />
            </button>
          </div>
        </>
      ),
    },
    {
      name: "สถานะ",
      cell: (row) => (
        <div style={{ padding: "5px" }}>
          <Switch
            onChange={() => handlechageStatus(row)}
            checked={row.status === 1}
            onColor="#4caf50"
            offColor="#d9534f"
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%", // ให้ข้อความใช้พื้นที่ของ Switch ทั้งหมด
                  color: "white",
                  fontSize: "12px",
                }}
              >
                เปิด
              </div>
            }
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%", // ให้ข้อความใช้พื้นที่ของ Switch ทั้งหมด
                  color: "white",
                  fontSize: "12px",
                }}
              >
                ปิด
              </div>
            }
          />
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "ดำเนินการ",
      cell: (row) => (
        <>
          <div style={{ padding: "5px" }}>
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group "
              onClick={() => {
                // เก็บข้อมูลที่ต้องส่งไว้ใน sessionStorage
                sessionStorage.setItem(
                  "activitydetail_data",
                  JSON.stringify({
                    id: row.activity_id,
                    name: row.name_activity,
                    budget: row.budget,
                    Balance: row.budget - row.spend_money,
                  })
                );

                // เปลี่ยนหน้า
                window.location.href = `/superadmin/strategic/${id_strategic}/${id_actionplan}/${id_project}/${row.id}`;
              }}
            >
              <i className="bi bi-eye text-gray-500 text-xl group-hover:text-blue-500"></i>
            </button>
          </div>

          <div style={{ padding: "5px" }}>
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group"
              onClick={() => {
                // เก็บข้อมูลที่ต้องส่งไว้ใน sessionStorage
                sessionStorage.setItem(
                  "strategic_data",
                  JSON.stringify({
                    name: row.strategic_name,
                    budget: row.budget,
                  })
                );

                // เปลี่ยนหน้า
                window.location.href = `/superadmin/strategic/${row.strategic_number}`;
              }}
            >
              <FiEdit2 className="text-xl text-gray-500 group-hover:text-black" />
            </button>
          </div>
          <div style={{ padding: "5px" }}>
            {" "}
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 hover:text-red-500 "
              onClick={() => handleDelete(row)} // เรียกใช้ฟังก์ชัน handleDelete เมื่อกดปุ่ม
            >
              <i className="bi bi-trash text-xl "></i>
            </button>
          </div>
        </>
      ),
      ignoreRowClick: true,
    },
  ];
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

  const handlechageStatus = async (row) => {
    const newStatus = row.status === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: `คุณต้องการ  ${newStatus === 1 ? "เปิดการใช้งาน" : "ปิดการใช้งาน"}
            สำหรับ  "${row.name_activity}" หรือไม่
            `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === 1 ? "#4caf50" : "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: newStatus === 1 ? "เปิดการใช้งาน" : "ปิดการใช้งาน",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("token");
        const response = await UpdatestatusActivity(token, row.activity_id);
        // if(response)
        console.log(response);
        if (response) {
          console.log("การอัปเดตสถานะสำเร็จ");
          setData((prevData) =>
            prevData.map((item) =>
              item.activity_id === row.activity_id
                ? { ...item, status: newStatus }
                : item
            )
          );
          Swal.fire({
            title: "อัปเดตข้อมูลสำเร็จ",
            text: "ข้อมูลถูกอัปเดตในระบบแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        console.log(err);
      }
    }
  };

  const handleNotiEmail = async (row) => {
    console.log("test :::: ");
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: `คุณต้องการแจ้งเตือนสำหรับ "${row.name_activity}" หรือไม่`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "ความคืบหน้ากิจกรรม", // ปุ่มหลัก
      denyButtonText: "รายงานผลกิจกรรม", // ปุ่มรอง
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#28a745",
      cancelButtonColor: "gray",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "กำลังอัปเดตข้อมูล...",
          text: "กรุณารอสักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // แสดง loading spinner
          },
        });
        const token = Cookies.get("token");
        const response = await SendEmailActivity(token, row.activity_id, 1);
        // if(response)
        console.log(response);
        if (response.status === 200) {
          Swal.fire({
            title: "ส่งการแจ้งเตือนสำเร็จ",
            text: "ข้อมูลถูกส่งการแจ้งเตือนสำเร็จแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถส่ง E-mail แจ้งเตือนได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        console.log(err);
      }
    } else if (result.isDenied) {
      try {
        Swal.fire({
          title: "กำลังอัปเดตข้อมูล...",
          text: "กรุณารอสักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // แสดง loading spinner
          },
        });
        const token = Cookies.get("token");
        const response = await SendEmailActivity(token, row.activity_id, 2);
        // if(response)
        console.log(response);
        if (response.status === 200) {
          setSecrchData((prev) =>
            prev.map((e) =>
              e.activity_id === row.activity_id
                ? { ...e, count_send_email: (e.count_send_email ?? 0) + 1 }
                : e
            )
          );
          Swal.fire({
            title: "ส่งการแจ้งเตือนสำเร็จ",
            text: "ข้อมูลถูกส่งการแจ้งเตือนสำเร็จแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถส่ง E-mail แจ้งเตือนได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        console.log(err);
      }
    }
  };
  const handleDelete = async (row) => {
    // const newStatus = row.status === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: `คุณต้องการคุณต้องการลบ "${row.name_activity}" หรือไม่
            `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("token");
        const response = await DeleteActivity(token, row.activity_id);
        // if(response)
        console.log(response);
        if (response) {
          // setData((prevData) =>
          //   prevData.filter((item) => item.strategic_id !== row.strategic_id)
          // );
          console.log("การลบสำเร็จ");
          setData((prevData) =>
            prevData.filter((item) => item.activity_id != row.activity_id)
          );
          // ทำการดำเนินการเพิ่มเติมที่ต้องการเมื่อการอัปเดตสำเร็จ
          Swal.fire({
            title: "ลบข้อมูลสำเร็จ",
            text: "ข้อมูลถูกลบออกจากระบบแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบได้ กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        console.log(err);
      }
    }
  };

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
        <div>
          <div className="">
            <input
              type="text"
              className="form-control my-3  p-2  w-full  border border-gray-300 rounded-md"
              placeholder="ค้นหา..."
              value={SearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="bg-white shadow-xl rounded-md border border-gray-200 mt-4 flex flex-col"
           
          >
            <DataTable
              columns={columns}
              data={SecrchData}
              keyField="activity_id"
              pagination
              paginationServer // ← สำคัญ: ใช้ pagination แบบ server
              customStyles={customStyles}
              paginationPerPage={perPage}
              paginationDefaultPage={page}
              paginationTotalRows={totalRows} // ← ส่งจำนวน row ทั้งหมดมาจาก Laravel
              onChangePage={handlePageChange} // ← เรียกเมื่อเปลี่ยนหน้า
              onChangeRowsPerPage={handlePerRowsChange}
              fixedHeaderScrollHeight="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
}
