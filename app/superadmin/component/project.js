"use client";
import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import {
  GetDataprojectByidaction,
  UpdatestatusProject,
  DeleteProject,
  GetDatastyleUse,
  GetDataprincipleUse,
} from "../../fetch_api/fetch_api_superadmin"; // ปรับ path ตามจริง
import Link from "next/link";
import Cookies from "js-cookie";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FiEdit2 } from "react-icons/fi";
import Switch from "react-switch";
import Swal from "sweetalert2";
import { FiDownload } from "react-icons/fi";

import {
  Document,
  Packer,
  TabStopType,
  Paragraph,
  TextRun,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
  TableCell,
} from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "@/public/font/THSarabunNew-normal.js";
import "@/public/font/THSarabunNew Bold-normal.js";
import { MdEmail } from "react-icons/md";
export default function DatatableProject({
  id_action,
  val,
  onTotalChange,
  onMaxBudgetChange,
  strategicName,
  actionplanName,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [SecrchData, setSecrchData] = useState([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const { id_strategic, id_actionplan } = val;
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // default เป็น 10
  const [hasMounted, setHasMounted] = useState(false);
  const [optionstype, setoptionstype] = useState([]);
  const [optionsprinciples, setoptionsprinciples] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleDownloadClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  // ฟังก์ชันสร้างเซลล์
  const createCell = (text, isBold = false) =>
    new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text,
              bold: isBold,
              font: "TH Sarabun New",
              size: 24,
            }),
          ],
        }),
      ],
      width: {
        size: 25,
        type: WidthType.PERCENTAGE,
      },
    });

  // สร้างตาราง

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const buddhistYear = d.getFullYear() + 543;
    const monthNames = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${buddhistYear}`;
  };

  const handleModalSelect = (type, row) => {
    setShowModal(false);
    const leftUser = row.project_users.find(
      (u) => u.type === 1 && u.main === 1
    );
    const rightUser = row.project_users.find(
      (u) => u.type === 2 && u.main === 1
    );
    if (type === "word") {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `แบบฟอร์มโครงการตามแผนปฏิบัติการ ประจำปีงบประมาณ พ.ศ. ${row.year.year}`,
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `(1 ตุลาคม ${row.year.year - 1} – 30 กันยายน ${
                      row.year.year
                    })`,
                    font: "TH Sarabun New",
                    bold: true,
                    size: 32,
                  }),
                ],
              }),

              new Paragraph({ text: "" }), // ช่องว่าง

              new Paragraph({
                children: [
                  new TextRun({
                    text: "1. ชื่อโครงการ : ",
                    bold: true,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                  new TextRun({
                    text: row.project_name,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "2. รหัสโครงการ : ",
                    bold: true,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                  new TextRun({
                    text: `${id_strategic}-${id_actionplan}-${row.project_number}`,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "3. ลักษณะโครงการ : ",
                    bold: true,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                  ...(Array.isArray(optionstype)
                    ? optionstype.map(
                        (item) =>
                          new TextRun({
                            text: `${
                              row.project_style?.some(
                                (s) => s.id_style === item.value
                              )
                                ? "☑"
                                : "☐"
                            } ${item.label || "-"}   `, // เว้นช่องว่าง
                            font: "TH Sarabun New",
                            size: 32,
                          })
                      )
                    : []),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "4. หน่วยงาน : ",
                    bold: true,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                  new TextRun({
                    text: `${row.department.departments_name}`,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "5. ความสอดคล้องกับประเด็นยุทธศาสตร์ : ",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `\t5.1 ประเด็นยุทธศาสตร์ : ประเด็นยุทธ์ศาสตร์ที่ ${id_strategic} ${strategicName}`,

                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `\t5.2 กลยุทธ์ : กลยุทธ์ที่ ${id_actionplan} ${actionplanName}`,

                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                // spacing: { before: 200 },
                children: [
                  new TextRun({
                    text: "\t5.3 OKRs (Objective & Key Results) : ",

                    font: "TH Sarabun New",
                    size: 32,
                  }),
                  new TextRun({
                    text: "ตัวชี้วัดและค่าเป้าหมายของกลยุทธ์",
                    // bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                  // new TextRun("ตัวชี้วัดและค่าเป้าหมายของกลยุทธ์"),
                ],
              }),
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  // หัวตาราง
                  new TableRow({
                    children: [
                      new TableCell({
                        margins: {
                          top: 100, // หน่วยเป็น twentieths of a point (20 = 1pt)
                          bottom: 100,
                          left: 100, // เว้นด้านซ้ายมากขึ้น
                          right: 100,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ที่",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ตัวชี้วัด (OKRs)",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ค่าเป้าหมาย",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),

                  // ข้อมูลตัวชี้วัด
                  ...row.project_okr.map(
                    (val, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: `${index + 1}`,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text:
                                      " " +
                                      val.okr.okr_number +
                                      " " +
                                      val.okr.okr_name,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text:
                                      val.okr.unit.unit_name === "ร้อยละ"
                                        ? `${
                                            val.okr.unit.unit_name
                                          } ${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()}`
                                        : `${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()} ${
                                            val.okr.unit.unit_name
                                          }`,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                ],
              }),
              new Paragraph({ text: "" }), // ช่องว่าง
              new Paragraph({
                children: [
                  new TextRun({
                    text: "6. ตอบสนองตามหลักธรรมภิบาล ",
                    bold: true,
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "\t",
                    size: 32,
                    font: "TH Sarabun New",
                  }),
                  ...(Array.isArray(optionsprinciples)
                    ? optionsprinciples.map(
                        (item, index) =>
                          new TextRun({
                            text: `${
                              row.project_principle?.some(
                                (s) => s.id_principle === item.value
                              )
                                ? "☑"
                                : "☐"
                            } ${index + 1}.${item.label || "-"}   `, // เว้นช่องว่าง
                            font: "TH Sarabun New",
                            size: 32,
                          })
                      )
                    : []),
                ],
              }),
              new Paragraph({ text: "" }), // ช่องว่าง
              new Paragraph({
                children: [
                  new TextRun({
                    text: "7.หลักการและเหตุผล",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                spacing: {
                  line: 180, // 18pt ระยะบรรทัดสูงขึ้น (ปรับตามต้องการ)
                  lineRule: "auto",
                },
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `\t${row.abstract}`,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "8.วัตถุประสงค์",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              ...(Array.isArray(row.objective)
                ? row.objective.map(
                    (item, index) =>
                      new Paragraph({
                        spacing: { after: 50 },
                        children: [
                          new TextRun({
                            text: `\t8.${index + 1}. ${
                              item.objective_name || "-"
                            }`,
                            font: "TH Sarabun New",
                            size: 32,
                          }),
                        ],
                      })
                  )
                : []),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "9.ตัวชี้วัดและค่าเป้าหมายของโครงการ",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  // หัวตาราง
                  new TableRow({
                    children: [
                      new TableCell({
                        margins: {
                          top: 100, // หน่วยเป็น twentieths of a point (20 = 1pt)
                          bottom: 100,
                          left: 100, // เว้นด้านซ้ายมากขึ้น
                          right: 100,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ที่",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ตัวชี้วัด",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ค่าเป้าหมาย",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "หน่วย",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),

                  // ข้อมูลตัวชี้วัด
                  ...row.project_indicator.map(
                    (ind, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: `${index + 1}`,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: " " + ind.indicator_name,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: parseFloat(ind.goal).toLocaleString(),
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: ind.unit.unit_name || "-",
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                ],
              }),
              new Paragraph({ text: "" }), // ช่องว่าง
              new Paragraph({
                children: [
                  new TextRun({
                    text: "10.ระยะเวลาในการดำเนินงาน",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                spacing: {
                  after: 240, // 240 = 12pt (1 ย่อหน้า)
                },
                // alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `\t${formatDate(row.time_start)} - ${formatDate(
                      row.time_end
                    )}`,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "11.สถานที่จัดโครงการ",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                spacing: {
                  after: 240, // 240 = 12pt (1 ย่อหน้า)
                },
                // alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `\t${row.location}`,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "12.รายละเอียดงบประมาณที่ขออนุมัติตามหมวดเงินและค่าใช้จ่าย",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  // หัวตาราง
                  new TableRow({
                    children: [
                      new TableCell({
                        margins: {
                          top: 100, // หน่วยเป็น twentieths of a point (20 = 1pt)
                          bottom: 100,
                          left: 100, // เว้นด้านซ้ายมากขึ้น
                          right: 100,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "รายการค่าใช้จ่าย",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        margins: {
                          top: 100, // หน่วยเป็น twentieths of a point (20 = 1pt)
                          bottom: 100,
                          left: 100, // เว้นด้านซ้ายมากขึ้น
                          right: 100,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "จำนวนหน่วย",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        margins: {
                          top: 100, // หน่วยเป็น twentieths of a point (20 = 1pt)
                          bottom: 100,
                          left: 100, // เว้นด้านซ้ายมากขึ้น
                          right: 100,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "จำนวนเงิน\nต่อหน่วย",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        margins: {
                          top: 100, // หน่วยเป็น twentieths of a point (20 = 1pt)
                          bottom: 100,
                          left: 100, // เว้นด้านซ้ายมากขึ้น
                          right: 100,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "งบประมาณ",
                                bold: true,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),

                  // ข้อมูลตัวชี้วัด
                  ...row.project_okr.map(
                    (val, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text:
                                      " " +
                                      val.okr.okr_number +
                                      " " +
                                      val.okr.okr_name,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text:
                                      val.okr.unit.unit_name === "ร้อยละ"
                                        ? `${
                                            val.okr.unit.unit_name
                                          } ${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()}`
                                        : `${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()} ${
                                            val.okr.unit.unit_name
                                          }`,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text:
                                      val.okr.unit.unit_name === "ร้อยละ"
                                        ? `${
                                            val.okr.unit.unit_name
                                          } ${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()}`
                                        : `${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()} ${
                                            val.okr.unit.unit_name
                                          }`,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text:
                                      val.okr.unit.unit_name === "ร้อยละ"
                                        ? `${
                                            val.okr.unit.unit_name
                                          } ${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()}`
                                        : `${parseFloat(
                                            val.okr.goal
                                          ).toLocaleString()} ${
                                            val.okr.unit.unit_name
                                          }`,
                                    font: "TH Sarabun New",
                                    size: 32,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                  new TableRow({
                    children: [
                      new TableCell({
                        columnSpan: 3,
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: "รวมเป็นเงิน",
                                font: "TH Sarabun New",
                                size: 32,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "XXXX บาท", // เปลี่ยนตามจริง
                                font: "TH Sarabun New",
                                size: 32,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph({ text: "" }), // ช่องว่าง
              new Paragraph({
                children: [
                  new TextRun({
                    text: "13.ผลที่คาดว่าจะได้รับ",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                spacing: {
                  after: 240, // 240 = 12pt (1 ย่อหน้า)
                },
                // alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `\t${row.result}`,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "13.ปัญหาอุปสรรค และแนวทางการปรับปรุงการดำเนินงานในรอบปีที่ผ่านมา",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                spacing: {
                  after: 240, // 240 = 12pt (1 ย่อหน้า)
                },
                // alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `\t${row.obstacle || "-"}`,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 240 },
                children: [
                  // สร้าง Table แทนการใช้ Tab เพื่อจัดคอลัมน์ให้ชัดเจน
                ],
              }),

              // สร้าง Table สำหรับลายเซ็น 2 คอลัมน์
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  // แถวลายเซ็น
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ลงชื่อ..................................................",
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ลงชื่อ..................................................",
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),

                  // แถวชื่อ
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: `(${leftUser?.user?.name || "-"})`,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: `(${rightUser?.user?.name || "-"})`,
                                font: "TH Sarabun New",
                                size: 32,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),

                  // แถวตำแหน่ง
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ผู้รับผิดชอบระดับปฏิบัติการ",
                                font: "TH Sarabun New",
                                size: 32,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "ผู้รับผิดชอบระดับผู้บริหาร",
                                font: "TH Sarabun New",
                                size: 32,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph(""),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "หมายเหตุ :  ผู้รับผิดชอบระดับปฏิบัติ ",
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                  new TextRun({
                    text: "ได้แก่ หัวหน้างาน หรือบุคลากรที่ได้รับมอบหมายให้รับผิดชอบโครงการ",
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `ผู้รับผิดชอบระดับนโยบาย/บริหาร `,
                    bold: true,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                  new TextRun({
                    text: ` ได้แก่ รองคณบดี ผู้ช่วยคณบดี หัวหน้าสาขาวิชา ประธานหลักสูตร หรืออาจารย์ผู้รับผิดชอบโครงการ  `,
                    font: "TH Sarabun New",
                    size: 32,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "example.docx");
      });
    }
  };

  const fetchData = useCallback(async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await GetDataprojectByidaction(
        token,
        id_action,
        page,
        perPage
      );
      console.log(res.data);
      setData(res.data);
      setSecrchData(res.data);
      setTotalRows(res.total);
      // reduce สรุปรวมค่าทั้งหมดใน array ให้เป็นค่าเดียว เช่น ผลรวม, หาค่าสูงสุด, หรือรวมข้อความ
      const totalBudget = res.data.reduce(
        (sum, item) => sum + parseFloat(item.budget),
        0
      );
      console.log(totalBudget);
      onMaxBudgetChange(totalBudget);

      const res_style = await GetDatastyleUse(token);
      // console.log(res_teacher);
      const mappedstyleOptions = res_style.map((item) => ({
        value: item.style_id,
        label: `${item.style_name}  `,
      }));
      setoptionstype(mappedstyleOptions);

      const res_principle = await GetDataprincipleUse(token);
      const mappedOptions = res_principle.map((item) => ({
        value: item.principle_id,
        label: item.principle_name,
      }));
      setoptionsprinciples(mappedOptions);

      if (onTotalChange) {
        onTotalChange(res.total);
      }

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
  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };
  useEffect(() => {
    const filtered = data.filter((data) => {
      const budget = Number(data.budget);
      const spendMoney = Number(data.spend_money);
      const remainingBudget = budget - spendMoney; // คำนวณเหมือนใน cell

      return `${data.project_name} ${data.project_number} ${budget} ${spendMoney} ${remainingBudget}`
        .toLowerCase()
        .includes(SearchTerm.toLowerCase());
    });

    setSecrchData(filtered);
  }, [SearchTerm, data]);

  const columns = [
    {
      name: "รหัส",
      selector: (row) => row.project_number,
      sortable: true,
      width: "80px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.project_name,
      sortable: true,
      wrap: true,
      width: "250px",
      cell: (row) => <div className="py-[10px]">{row.project_name} </div>,
    },
    {
      name: "กิจกรรม",
      selector: (row) => row.count_activity,
      sortable: true,
      center: "true",
    },
    {
      name: "รายงานเรียบร้อย",
      selector: (row) => row.count_activity_report,
      sortable: true,
      width: "160px",
      center: "true",
    },
    {
      name: "ยังไม่ได้รายงาน",
      selector: (row) => row.count_activity - row.count_activity_report,
      sortable: true,
      center: "true",
      width: "160px",
    },
    {
      name: "งบประมาณ (บาท)",
      // selector: (row) => row.budget,
      sortable: true,
      wrap: true,
      right: "true",
      selector: (row) => row.budget,
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
      right: "true",
      selector: (row) => row.spend_money,
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
      name: "ดาวน์โหลด",
      ignoreRowClick: true,
      cell: (row) => (
        <button
          className="flex items-center gap-2 btn btn-sm btn-outline-primary hover:text-blue-500 rounded hover:bg-gray-100 p-2"
          onClick={() => handleDownloadClick(row)}
        >
          <FiDownload className="text-lg " />
          Word
        </button>
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
      name: "จัดการ",
      cell: (row) => (
        <>
          <div style={{ padding: "5px" }}>
            <button
              className="rounded border-gray-200 p-2 hover:bg-gray-100 group "
              onClick={() => {
                // เก็บข้อมูลที่ต้องส่งไว้ใน sessionStorage
                sessionStorage.setItem(
                  "project_data",
                  JSON.stringify({
                    id: row.project_id,
                    name: row.project_name,
                    budget: row.budget,
                    Balance: row.budget - row.spend_money,
                  })
                );

                // เปลี่ยนหน้า
                window.location.href = `/superadmin/strategic/${id_strategic}/${id_actionplan}/${row.project_number}`;
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
                  "project_edit",
                  JSON.stringify({
                    data: row,
                  })
                );

                // เปลี่ยนหน้า
                window.location.href = `/superadmin/strategic/${id_strategic}/${id_actionplan}/editproject/${row.project_number}`;
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

  const handlechageStatus = async (row) => {
    const newStatus = row.status === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: `คุณต้องการ  ${newStatus === 1 ? "เปิดการใช้งาน" : "ปิดการใช้งาน"}
          สำหรับ  "${row.project_name}" หรือไม่
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
        const response = await UpdatestatusProject(token, row.project_id);
        // if(response)
        console.log(response);
        if (response) {
          console.log("การอัปเดตสถานะสำเร็จ");
          setData((prevData) =>
            prevData.map((item) =>
              item.project_id === row.project_id
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

  const handleDelete = async (row) => {
    // const newStatus = row.status === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ?",
      text: `คุณต้องการคุณต้องการลบ "${row.project_name}" หรือไม่
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
        const response = await DeleteProject(token, row.project_id);
        // if(response)
        console.log(response);
        if (response) {
          // setData((prevData) =>
          //   prevData.filter((item) => item.strategic_id !== row.strategic_id)
          // );
          console.log("การลบสำเร็จ");
          setData((prevData) =>
            prevData.filter((item) => item.project_id != row.project_id)
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
            className="bg-white rounded-md border border-gray-200
 mt-3 flex flex-col"
          >
            <DataTable
              columns={columns}
              data={SecrchData}
              customStyles={customStyles}
              pagination
              paginationServer // ← สำคัญ: ใช้ pagination แบบ server
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
      <DownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleModalSelect}
        row={selectedRow}
      />
    </div>
  );
}

function DownloadModal({ isOpen, onClose, onSelect, row }) {
  useEffect(() => {
    // กด esc แล้วปืด
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    // handleKeyDown คือฟังก์ชันที่ฟัง event การกดปุ่มบนคีย์บอร์ด (เช่น Escape)
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    // ใช้ลบ event listener เพื่อป้องกันปัญหา memory leak หรือ event ถูกเรียกซ้ำซ้อน
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 bg-opacity-50">
      <div
        data-aos="fade-down"
        className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        {/* ปุ่มกากบาท */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <span className="text-3xl">&times;</span>
        </button>

        <div className="flex justify-center items-center flex-col">
          <div className="flex items-center justify-center bg-gray-300 text-white rounded-full w-16 h-16 text-3xl font-bold shadow-lg mb-4">
            ?
          </div>

          <h2 className="text-lg font-semibold text-center mb-4">
            คุณต้องการดาวน์โหลดไฟล์ {row.project_name} ?
          </h2>
        </div>

        <div className="flex justify-center gap-2">
          {/* <button
            onClick={() => onSelect("pdf", row)}
            className="bg-red-600 text-white px-4  py-2 cursor-pointer rounded hover:bg-red-400"
          >
            PDF
          </button> */}
          <button
            onClick={() => onSelect("word", row)}
            className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-green-400"
          >
            ยืนยัน
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-white px-4 py-2 cursor-pointer rounded hover:bg-gray-400"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
