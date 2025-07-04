import { notification, Table, Modal, Form, Input, Button,Divider, Select } from "antd";
import { useEffect, useState } from 'react';
import { GetBuildingApi, CreateBuildingApi } from "../util/api";
import { PlusOutlined} from '@ant-design/icons';
import '../style/room.css';
import '../style/button.css'; // Import CSS styles for buttons
const BuildingPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách tòa nhà
  const fetchBuildings = async () => {
    try {
      const res = await GetBuildingApi();
       console.log("Dữ liệu từ API:", res);
      const buildings = Array.isArray(res) ? res : res.data || [];
      setDataSource(buildings);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tòa nhà:", error);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Xử lý thêm tòa nhà
const handleAddBuilding = () => {
  form.validateFields().then(async (values) => {
    try {
      const res = await CreateBuildingApi(values);
      console.log("📦 Kết quả từ API CreateBuildingApi:", res);

      if (!res) throw new Error("Không có phản hồi từ server");

      const building = res?.data?.data || res?.data || res;

      if (building && building._id) {
        notification.success({ message: "Thêm tòa nhà thành công" });
        form.resetFields();
        setIsModalOpen(false);
        await fetchBuildings(); // luôn đồng bộ dữ liệu
      } else {
        throw new Error("Không nhận được _id từ server");
      }
    } catch (error) {
      notification.error({ message: "Thêm tòa nhà thất bại" });
      console.error(error);
    }
  });
};


  const columns = [
    { title: 'Mã tòa nhà', dataIndex: '_id' },
    { title: 'Tên tòa nhà', dataIndex: 'name' },
    { title: 'Hoạt động', dataIndex: 'activity' },
    { title: 'Địa chỉ', dataIndex: 'address' }, // thêm nếu cần
  ];

  return (
    <div className="room-page-container">
      

      <Button
        className="add-button"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
        icon={<PlusOutlined />}
      >
        Thêm tòa nhà
      </Button>
      <Divider />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Thêm tòa nhà mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddBuilding}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên tòa nhà"
            rules={[{ required: true, message: 'Vui lòng nhập tên tòa nhà' }]}
          >
            <Input placeholder="VD: Tòa A" />
          </Form.Item>

          <Form.Item
            name="activity"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Hoạt động">Hoạt động</Select.Option>
              <Select.Option value="Tạm dừng">Tạm dừng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="VD: 123 Nguyễn Văn Linh, TP.HCM" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// ✅ Xuất đúng tên component
export default BuildingPage;
