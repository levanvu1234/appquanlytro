import { notification, Table, Modal, Form, Input, Button,Divider, Select } from "antd";
import { useEffect, useState } from 'react';
import { GetBuildingApi, CreateBuildingApi,updateBuildingApi } from "../util/api";
import { PlusOutlined} from '@ant-design/icons';
import '../style/room.css';
import '../style/button.css'; // Import CSS styles for buttons
const BuildingPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  //chỉnh sửa 
  const [isEdit, setIsEdit] = useState(false);
  const [editingBuildingId, setEditingBuildingId] = useState(null);
  //lọc
  const [filterAddress, setFilterAddress] = useState(undefined);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);
  const [filterName, setFilterName] = useState(undefined);
  // Lấy danh sách tòa nhà
  const fetchBuildings = async () => {
    try {
      const res = await GetBuildingApi();
       console.log("Dữ liệu từ API:", res);
      const buildings = Array.isArray(res) ? res : res.data || [];
      setDataSource(buildings);
      setFilteredData(buildings); // Cập nhật dữ liệu đã lọc
      const uniqueAddresses = [...new Set(buildings.map(b => b.address).filter(Boolean))];
      setAddressOptions(uniqueAddresses);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tòa nhà:", error);
    }
  };
//useeffect của bộ lọc 
  useEffect(() => {
    const filtered = dataSource.filter((building) => {
      const matchesName = filterName
        ? building.name === filterName
        : true;

      const matchesAddress = filterAddress
        ? building.address?.toLowerCase().includes(filterAddress.toLowerCase())
        : true;

      return matchesName && matchesAddress;
    });

    setFilteredData(filtered);
  }, [filterName, filterAddress, dataSource]);

  useEffect(() => {
    fetchBuildings();
  }, []);
  // Xử lý thêm tòa nhà
const handleAddBuilding = () => {
  form.validateFields().then(async (values) => {
    try {
      let res;
      if (isEdit && editingBuildingId) {
        res = await updateBuildingApi(editingBuildingId, values);
      } else {
        res = await CreateBuildingApi(values);
      }

      const building = res?.data?.data || res?.data || res;

      if (building && building._id) {
        notification.success({
          message: isEdit ? "Cập nhật tòa nhà thành công" : "Thêm tòa nhà thành công",
        });
        form.resetFields();
        setIsModalOpen(false);
        setIsEdit(false);
        setEditingBuildingId(null);
        await fetchBuildings();
      } else {
        throw new Error("Không nhận được _id từ server");
      }
    } catch (error) {
      notification.error({
        message: isEdit ? "Cập nhật tòa nhà thất bại" : "Thêm tòa nhà thất bại",
      });
      console.error(error);
    }
  });
};

const handleEditBuilding = (building) => {
  setIsEdit(true);
  setEditingBuildingId(building._id);
  form.setFieldsValue({
    name: building.name,
    activity: building.activity,
    address: building.address,
  });
  setIsModalOpen(true);
};

  const columns = [
    { title: 'Mã tòa nhà', dataIndex: '_id' },
    { title: 'Tên tòa nhà', dataIndex: 'name' },
    { title: 'Hoạt động', dataIndex: 'activity' },
    { title: 'Địa chỉ', dataIndex: 'address' }, // thêm nếu cần
    {
      title: 'Hành động',
      render: (_, record) => (
        <Button
          className="action-button edit"
          onClick={() => handleEditBuilding(record)}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="room-page-container">
      <div
      style={{
        marginBottom: 20,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <Button
        className="add-button"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
        icon={<PlusOutlined />}
      >
        Thêm tòa nhà
      </Button>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Select
          placeholder="Lọc theo tên tòa nhà"
          allowClear
          style={{ width: 250 }}
          value={filterName}
          onChange={(value) => setFilterName(value ?? undefined)}
        >
          {[...new Set(dataSource.map((b) => b.name))].map((name) => (
            <Select.Option key={name} value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Lọc theo địa chỉ"
          allowClear
          value={filterAddress}
          onChange={(value) => setFilterAddress(value)}
          style={{ width: 250 }}
        >
          {addressOptions.map((addr) => (
            <Select.Option key={addr} value={addr}>
              {addr}  
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          danger
          onClick={() => {
            setFilterName(undefined);
            setFilterAddress(undefined);
          }}
        >
          Xóa lọc
        </Button>
        </div>
      </div>
      <Divider />
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEdit ? "Chỉnh sửa tòa nhà" : "Thêm tòa nhà mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEdit(false);
          setEditingBuildingId(null);
        }}
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
export default BuildingPage;
