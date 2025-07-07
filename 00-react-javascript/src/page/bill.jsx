import { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  notification,
  Divider,
  Modal,
} from "antd";
import dayjs from "dayjs";
import'../style/button.css';
import { pdf } from '@react-pdf/renderer';
import PrintableBill from './PrintableBill';
import {
  GetBillApi,
  CreateBillgApi,
  GetRoomApi,
  updateBillApi,
  PrintBillPdfApi,
} from "../util/api";
import '../style/room.css';
import{ EditOutlined,DeleteOutlined,PlusOutlined,PrinterOutlined  } from "@ant-design/icons";
const MonthlyBillPage = () => {
  const [dataSource, setDataSource] = useState([]);
  //thêm phòng
  const [rooms, setRooms] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  //sửa phòng
  const [editingBill, setEditingBill] = useState(null);

  // State tìm kiếm và lọc
  const [searchText, setSearchText] = useState("");
  const [filterRoom, setFilterRoom] = useState(undefined);
  const [filterMonth, setFilterMonth] = useState(undefined);
  const [filterYear, setFilterYear] = useState(undefined);

  const fetchBills = async () => {
    try {
      const res = await GetBillApi();
      if (Array.isArray(res)) {
        setDataSource(res);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bill:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await GetRoomApi();
      if (Array.isArray(res)) {
        setRooms(res);
      }
    } catch (err) {
      console.error("Lỗi khi lấy phòng:", err);
    }
  };

  useEffect(() => {
    fetchBills();
    fetchRooms();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingBill) {
        await updateBillApi(editingBill._id, values);
        notification.success({ message: "Cập nhật hóa đơn thành công!" });
      } else {
        await CreateBillgApi(values);
        notification.success({ message: "Tạo hóa đơn thành công!" });
      }
      form.resetFields();
      setEditingBill(null);
      setIsModalOpen(false);
      fetchBills();
    } catch (err) {
      console.error("Lỗi khi xử lý bill:", err);
      notification.error({ message: "Lỗi khi xử lý hóa đơn" });
    }
  };

 const handlePrintPdf = async (bill) => {
  console.log("📄 Dữ liệu gửi in PDF:", bill); // 👈 Thêm dòng này
  try {
    const blob = await pdf(<PrintableBill bill={bill} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  } catch (err) {
    console.error("❌ Lỗi tạo file PDF:", err);
    notification.error({ message: "Lỗi khi tạo file PDF" });
  }
};


  // Lọc dữ liệu theo tìm kiếm và lọc phòng
  const filteredData = dataSource.filter((item) => {
    const roomName = item.room?.name?.toLowerCase() || "";
    const buildingName = item.room?.building?.name?.toLowerCase() || "";
    const search = searchText.toLowerCase();
    const matchesSearch =
      roomName.includes(search) || buildingName.includes(search);
    const matchesRoom = filterRoom ? item.room?._id === filterRoom : true;
    const matchesMonth = filterMonth ? item.month === filterMonth : true;
    const matchesYear = filterYear ? item.year === filterYear : true;
    return matchesSearch && matchesRoom && matchesMonth && matchesYear;
  });

  const columns = [
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room) => room?.name || "Không rõ",
    },
    {
      title: "Khu nhà",
      key: "building",
      render: (_, record) => record.room?.building?.name || "Không rõ",
    },
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Tiền phòng",
      dataIndex: "roomPrice",
      key: "roomPrice",
      render: (value) => value?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Số điện",
      dataIndex: "electricityUsage",
      key: "electricityUsage",
    },
    {
      title: "Đơn giá điện",
      dataIndex: "electricityUnitPrice",
      key: "electricityUnitPrice",
      render: (value) => value?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Số nước",
      dataIndex: "waterUsage",
      key: "waterUsage",
    },
    {
      title: "Đơn giá nước",
      dataIndex: "waterUnitPrice",
      key: "waterUnitPrice",
      render: (value) => value?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (value) =>
        value != null ? value.toLocaleString("vi-VN") + " ₫" : "Chưa tính",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
            className="action-button edit"
            onClick={() => {
              setEditingBill(record);
              form.setFieldsValue({
                ...record,
                room: record.room?._id,
              });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="dashed"
            icon={<PrinterOutlined />}
            onClick={() => handlePrintPdf(record)}
          >
            In PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="room-page-container">
      

      {/* Bộ lọc */}
      <div style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        {/* Bên trái: Nút thêm */}
        <Button className="add-button" onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
          Thêm hóa đơn  
        </Button>

        {/* Bên phải: Các bộ lọc */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Input
            placeholder="Tìm tên phòng hoặc khu nhà"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc theo phòng"
            allowClear
            value={filterRoom}
            onChange={(value) => setFilterRoom(value ?? undefined)}
            style={{ width: 180 }}
          >
            {rooms.map((room) => (
              <Select.Option key={room._id} value={room._id}>
                {room.name} ({room.building?.name || "?"})
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo tháng"
            allowClear
            value={filterMonth}
            onChange={(value) => setFilterMonth(value ?? undefined)}
            style={{ width: 150 }}
          >
            {[...Array(12)].map((_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo năm"
            allowClear
            value={filterYear}
            onChange={(value) => setFilterYear(value ?? undefined)}
            style={{ width: 150 }}
          >
            {[...new Set(dataSource.map((item) => item.year))].map((year) => (
              <Select.Option key={year} value={year}>
                Năm {year}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="primary"
            danger
            onClick={() => {
              setSearchText("");
              setFilterRoom(undefined);
              setFilterMonth(undefined);
              setFilterYear(undefined);
            }}
            icon={<DeleteOutlined />}
          >
            Xóa lọc
          </Button>
        </div>
      </div>



      <Modal
        title={editingBill ? "Sửa hóa đơn" : "Thêm hóa đơn mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBill(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingBill ? "Cập nhật" : "Tạo hóa đơn"}
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="room" label="Phòng" rules={[{ required: true }]}>
            <Select placeholder="Chọn phòng">
              {rooms.map((room) => (
                <Select.Option key={room._id} value={room._id}>
                  {room.name} ({room.building?.name || "?"})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item name="month" label="Tháng" rules={[{ required: true }]}>
              <InputNumber min={1} max={12} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="year" label="Năm" rules={[{ required: true }]}>
              <InputNumber min={2020} max={2100} style={{ width: 150 }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item name="electricityUnitPrice" label="Đơn giá điện">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="electricityUsage" label="Số điện">
              <InputNumber min={0} />
            </Form.Item>
          </div>
          <Form.Item
            name="roomPrice"
            label="Tiền phòng"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={1000} style={{ width: 470 }} />
          </Form.Item>
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item name="waterUnitPrice" label="Đơn giá nước">
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="waterUsage" label="Số nước">
                      <InputNumber min={0} />
                    </Form.Item>
          </div>
        </Form>
      </Modal>

      <Divider />

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default MonthlyBillPage;
