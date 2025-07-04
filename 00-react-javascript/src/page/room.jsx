import {
  notification,
  Table,
  Modal,
  Form,
  Input,
  Button,
  Select,
  Divider,
  DatePicker
} from "antd";
import { useEffect, useState } from "react";
import {
  GetRoomApi,
  CreateRoomApi,
  GetBuildingApi,
  updateRoomApi,
  GetUserApi
} from "../util/api";
import { EditOutlined ,IdcardOutlined,PlusOutlined,DeleteOutlined} from '@ant-design/icons'; 
import dayjs from 'dayjs';
import '../style/room.css'; // Import CSS styles for room page
import'../style/button.css'; // Import CSS styles for buttons
const RoomPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  //
  const [isEdit, setIsEdit] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoomUsers, setSelectedRoomUsers] = useState([]);
  const selectedUsers = Form.useWatch('users', form);
  //lọc
  const [filterActivity, setFilterActivity] = useState(undefined);
  const [filterBuilding, setFilterBuilding] = useState(undefined);
  //tìm kiếm
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // Gọi API để lấy danh sách phòng
  const fetchRooms = async () => {
    try {
      const res = await GetRoomApi();
       console.log("📦 Dữ liệu phòng trả về:", res);
      if (Array.isArray(res)) {
        setDataSource(res);
        setFilteredData(res)
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng:", err);
    }
  };

  // Lấy danh sách tòa nhà
  const fetchBuildings = async () => {
    try {
      const res = await GetBuildingApi();
      setBuildings(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Lỗi khi lấy tòa nhà:", error);
    }
  };

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await GetUserApi();
      setUsers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Lỗi khi lấy user:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
    fetchUsers();
  }, []);
  // Đồng bộ lại dữ liệu tìm kiếm nếu xoá ô tìm
  useEffect(() => {
  const filtered = dataSource.filter((room) => {
    const matchesName = room.name?.toLowerCase().includes(searchText.toLowerCase());
    const matchesActivity = filterActivity ? room.activity === filterActivity : true;
    const matchesBuilding = filterBuilding ? room.building?._id === filterBuilding : true;
    return matchesName && matchesActivity && matchesBuilding;
  });
  setFilteredData(filtered);
}, [searchText, filterActivity, filterBuilding, dataSource]);
  // Submit thêm/sửa phòng
  const handleSubmitRoom = () => {
  form.validateFields().then(async (values) => {
    try {
      // Nếu không có activity hoặc đang xử lý users, cập nhật lại
      if (!values.users || values.users.length === 0) { //không có người dùng hoạt động => đang trống, xóa ngày bắt đầu và kết thúc
        values.startDate = null;
        values.endDate = null;
        values.activity = "Đang trống";
      } else {
        values.activity = "Đã thuê";
      }

      if (isEdit) {
        const res = await updateRoomApi(editingRoomId, values);
        const updatedRoom = res?.data || res;

        if (updatedRoom && updatedRoom._id) {
          notification.success({ message: "Cập nhật phòng thành công" });
          await fetchRooms(); // Tải lại toàn bộ để đồng bộ
          // Cập nhật danh sách phòng bằng cách ghi đè dữ liệu mới từ server
          setDataSource((prev) =>
            prev.map((room) =>
              room._id === updatedRoom._id ? updatedRoom : room
            )
          );
          //  Cập nhật cả filteredData nếu đang tìm kiếm
          setFilteredData((prev) =>
            prev.map((room) =>
              room._id === updatedRoom._id ? updatedRoom : room
            )
          );
        }
      } else {
        const res = await CreateRoomApi(values);
        const newRoom = res?.data || res;
        if (newRoom && newRoom._id) {
          notification.success({ message: "Thêm phòng thành công" });
          await fetchRooms(); // Đồng bộ lại danh sách
          setDataSource((prev) => [...prev, newRoom]);
        } else {
          throw new Error("Không nhận được _id từ server");
        }
      }

      form.resetFields();
      setIsModalOpen(false);
      setIsEdit(false);
      setEditingRoomId(null);
    } catch (error) {
      console.error(error);
      notification.error({
        message: isEdit ? "Cập nhật thất bại" : "Thêm phòng thất bại",
        description: error.message
      });
    }
  });
};
  // Khi bấm sửa phòng
  const handleEditRoom = (room) => {
    setIsEdit(true);
    setEditingRoomId(room._id);
    setIsModalOpen(true);

    form.setFieldsValue({
      name: room.name,
      activity: room.activity,
      building: room.building?._id || room.building,
      users: room.users?.map((user) => user._id),
      startDate: room.startDate ? dayjs(room.startDate) : null,
      endDate: room.endDate ? dayjs(room.endDate) : null,
    });
  };

  // Khi bấm xem người thuê
  const handleViewUsers = (room) => {
    console.log("room.users =", room.users);
    setSelectedRoomUsers(room.users || []);
    setIsViewModalOpen(true);
  };

  const columns = [
    { title: "Tên phòng", dataIndex: "name" },
    { title: "Hoạt động", dataIndex: "activity" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      render: (value) => value ? dayjs(value).format("DD/MM/YYYY ") : "---"
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      render: (value) => value ? dayjs(value).format("DD/MM/YYYY ") : "---"
    },
    {
      title: "Tòa nhà",
      dataIndex: "building",
      render: (building) => building?.name || "---"
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button className="action-button edit" onClick={() => handleEditRoom(record)} icon={<EditOutlined />} >
            Chỉnh sửa
          </Button>
          <Button className="action-button view" onClick={() => handleViewUsers(record)} icon={<IdcardOutlined />} >
            Chi tiết người thuê
          </Button>
        </>
      )
    }
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
      {/* Bên trái: Nút thêm */}
      <Button
        className="add-button"
        onClick={() => {
          setIsModalOpen(true);
          setIsEdit(false);
          form.resetFields();
        }}
        icon={<PlusOutlined />}
      >
        Thêm phòng
      </Button>

      {/* Bên phải: Các bộ lọc */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Input
          placeholder="Tìm theo tên phòng"
          allowClear
          // enterButton="Tìm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          // onSearch={(value) => {
          //   setSearchText(value);
          // }}
          style={{ width: 300 }}
        />

        <Select
          placeholder="Lọc theo hoạt động"
          allowClear
          value={filterActivity}
          onChange={(value) => setFilterActivity(value ?? undefined)}
          style={{ width: 180 }}
        >
          <Select.Option value="Đã thuê">Đã thuê</Select.Option>
          <Select.Option value="Đang trống">Đang trống</Select.Option>
        </Select>

        <Select
          placeholder="Lọc theo tòa nhà"
          allowClear
          value={filterBuilding}
          onChange={(value) => setFilterBuilding(value ?? undefined)}
          style={{ width: 200 }}
        >
          {buildings.map((b) => (
            <Select.Option key={b._id} value={b._id}>
              {b.name}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          danger
          onClick={() => {
            setSearchText("");
            setFilterActivity(undefined);
            setFilterBuilding(undefined);
          }}
          icon={<DeleteOutlined />}
        >
          Xóa lọc
        </Button>
      </div>
    </div>

      <Divider />
      <Table
        // dataSource={dataSource}
        dataSource={filteredData} // dùng cả cho tìm kiếm đẻ update trang
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm/sửa phòng */}
      <Modal
        title={isEdit ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEdit(false);
          setEditingRoomId(null);
        }}
        onOk={handleSubmitRoom}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
          >
            <Input placeholder="VD: Phòng 101" />
          </Form.Item>

          
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            // rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu" }]}
             rules={
                selectedUsers && selectedUsers.length > 0
                  ? [{ required: true, message: "Vui lòng nhập ngày bắt đầu" }]
                  : []
              }
          >
            <DatePicker style={{ width: "100%" }}  format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            // rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc" }]}
            rules={
              selectedUsers && selectedUsers.length > 0
                ? [{ required: true, message: "Vui lòng nhập ngày kết thúc" }]
                : []
            }
          >
            <DatePicker style={{ width: "100%" }}  format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="building"
            label="Tòa nhà"
            rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
          >
            <Select placeholder="Chọn tòa nhà">
              {buildings.map((b) => (
                <Select.Option key={b._id} value={b._id}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="users" label="Người dùng trong phòng">
            <Select
              mode="multiple"
              placeholder="Chọn người dùng"
              optionFilterProp="label"
              showSearch
            >
              {users.map((user) => (
                <Select.Option
                  key={user._id}
                  value={user._id}
                  label={`${user.name} (${user.phonenumber})`}
                >
                  {user.name} ({user.phonenumber})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết người thuê */}
      <Modal
        title="Chi tiết người thuê"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        className="user-view-modal"
      >
        {selectedRoomUsers.length > 0 ? (
          <ul className="user-list">
            {selectedRoomUsers.map((user) => (
              <li key={user._id} className="user-item">
                <strong>{user.name}</strong> – {user.email} – {user.phonenumber}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-user">Không có người thuê nào trong phòng này.</p>
        )}
      </Modal>

    </div>
  );
};

export default RoomPage;
