import { notification, Table, Modal, Form, Input, Button,Select,Divider  } from "antd";
import { useEffect,useState } from "react";
import { GetUserApi,updateUserApi,GetRoomApi,GetBuildingApi } from "../util/api";
import '../style/userpage.css';
import'../style/button.css'; // Import CSS styles for buttons
import { EditOutlined } from '@ant-design/icons'; // thêm icon
const UserPage = () => {
    const [dataSource, setdataSourse] = useState([]);//chứa danh sách dữ liệu hiển thị lên table
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    //tìm kiếm
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    //
    const [form] = Form.useForm();
        const fetchUser = async () => {
            try {
              const usersRes = await GetUserApi();

              if (!Array.isArray(usersRes)) {
                return notification.error({
                  message: "Lỗi khi tải dữ liệu",
                  description: "Không thể lấy dữ liệu người dùng."
                });
              }
              // Gắn tên phòng vào mỗi user nếu họ thuộc phòng nào đó
              const updatedUsers = usersRes.map((user) => {
                return {
                  ...user,
                  activity: Array.isArray(user.rooms) && user.rooms.length > 0 
                    ? user.rooms.map(r => r.name).join(", ")
                    : "Chưa ở phòng nào",

                  roombuilding: Array.isArray(user.rooms) && user.rooms.length > 0 
                    ? [...new Set(user.rooms.map(r => r.building?.name))].join(", ")
                    : "Không ở tòa nào"
                };
              });
              setdataSourse(updatedUsers);
              setFilteredData(updatedUsers);
            } catch (err) {
                console.error("Lỗi fetchUser:", err);
                notification.error({
                  message: "Lỗi hệ thống",
                  description: "Không thể tải dữ liệu người dùng."
                });
            }
          };

    useEffect(()=>{
        fetchUser();
    }, []) 
const handleEdit = (record) => {
    setCurrentUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phonenumber: record.phonenumber,
      password: "", // để trống vì không muốn hiển thị password cũ
    });
    setIsModalOpen(true);
  };
const handleUpdate = async () => {
  try {
    const values = await form.validateFields();

    // Nếu password rỗng, xóa khỏi object values để không gửi lên API
    if (!values.password) {
      delete values.password;
    }

    const res = await updateUserApi(currentUser._id, values);

    if (res.EC === 0) {
      notification.success({ message: res.EM });
      setIsModalOpen(false);
      fetchUser(); // reload lại danh sách
    } else {
      notification.error({ message: res.EM || "Cập nhật thất bại" });
    }
  } catch (err) {
    console.error(err);
  }
};


const columns = [
  {
    title: 'Id',
    dataIndex: '_id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    filters: [
      { text: 'Admin', value: 'Admin' },
      { text: 'User', value: 'User' },
    ],
    onFilter: (value, record) => record.role === value,
  },
  {
    title: 'Hiring',
    dataIndex: 'activity',
    filters: [...new Set(dataSource.map(user => user.activity))]
      .filter(Boolean)
      .map(item => ({ text: item, value: item })),
    onFilter: (value, record) => record.activity === value,
  },
  {
    title: 'Tòa nhà',
    dataIndex: 'roombuilding',
    filters: [...new Set(dataSource.map(user => user.roombuilding))]
      .filter(Boolean)
      .map(item => ({ text: item, value: item })),
    onFilter: (value, record) => record.roombuilding === value,
  },
  {
    title: 'Phonenumber',
    dataIndex: 'phonenumber',
  },
  {
    title: "Hành động",
    render: (text, record) => (
      <Button className="action-button edit" icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>
        Chỉnh sửa
      </Button>
    ),
  },
];


    return(
        <div className="user-page-container">
            <div className="user-page-header">
              <h2 >Quản lý User</h2>
              <Input.Search
                className="user-page-search"
                placeholder="Tìm theo số điện thoại"
                allowClear
                enterButton="Tìm kiếm"
                onSearch={(value) => {
                  setSearchText(value);
                  const filtered = dataSource.filter((user) =>
                    user.phonenumber?.toLowerCase().includes(value.toLowerCase())
                  );
                  setFilteredData(filtered);
                }}
                
              />
            </div>
            <Divider />
            <Table 
            bordered
            className="ant-table user-table"
            //dataSource={dataSource} 
            dataSource={filteredData}
            columns={columns}
            rowKey={"_id"} 
            pagination={{ pageSize: 5 }}
            />
        <Modal
            title="Chỉnh sửa người dùng"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleUpdate}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
            <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
                ]}
            >
                <Input />
            </Form.Item>

                  <Form.Item
                label="Phonenumber"
                name="phonenumber"
                rules={[
                { required: true, message: "Vui lòng nhập phonenumber" },
                { type: "phone", message: "Phonenumber không hợp lệ" },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Chức vụ"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
                >
                <Select placeholder="Chọn chức vụ">
                    <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="User">User</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Mật khẩu mới" name="password">
                <Input.Password placeholder="Để trống nếu không đổi" />
            </Form.Item>
            </Form>

        </Modal>
        </div>
       
    )
}
export default UserPage;
