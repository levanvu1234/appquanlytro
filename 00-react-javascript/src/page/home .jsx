import { Card, Statistic, Row, Col,Divider, DatePicker } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { GetRoomApi, GetUserApi, GetBuildingRevenueApi } from "../util/api";
import '../style/home.css'; // Import your CSS styles 
const HomePage = () => {
  const [roomData, setRoomData] = useState({
    total: 0,
    rented: 0,
    available: 0,
  });
  const [userCount, setUserCount] = useState(0);
  const [userWithRoom, setUserWithRoom] = useState(0);
  const [userWithoutRoom, setUserWithoutRoom] = useState(0);
  const [buildingRevenues, setBuildingRevenues] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs()); 

const fetchData = async (month, year) => {
  try {
    const rooms = await GetRoomApi();
    const users = await GetUserApi();
    const allRevenueData = await GetBuildingRevenueApi();

    console.log("📡 Dữ liệu doanh thu:", JSON.stringify(allRevenueData, null, 2));

    if (!Array.isArray(allRevenueData)) {
      console.error("❌ API không trả về mảng:", allRevenueData);
      return;
    }

    if (Array.isArray(rooms)) {
      const total = rooms.length;
      const rented = rooms.filter((room) => room.activity === "Đã thuê").length;
      const available = total - rented;
      setRoomData({ total, rented, available });

      const userIdsInRooms = new Set();
      rooms.forEach((room) => {
        (room.users || []).forEach((user) => {
          userIdsInRooms.add(typeof user === "object" ? user._id : user);
        });
      });

      if (Array.isArray(users)) {
        setUserCount(users.length);
        const allUserIds = users.map((user) => user._id);
        const withRoom = allUserIds.filter((id) => userIdsInRooms.has(id)).length;
        const withoutRoom = allUserIds.length - withRoom;
        setUserWithRoom(withRoom);
        setUserWithoutRoom(withoutRoom);
      }
    }

    const filtered = allRevenueData
      .map((building) => {
        const validRevenue = Array.isArray(building.revenue) ? building.revenue : [];
        const matched = validRevenue.find(
          (r) => Number(r.month) === Number(month) && Number(r.year) === Number(year)
        );
        return matched
          ? {
              buildingName: building.name,
              totalRevenue: matched.totalAmount,
            }
          : null;
      })
      .filter(Boolean);

    console.log("✅ Doanh thu sau lọc:", filtered);
    setBuildingRevenues(filtered);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu báo cáo:", err);
  }
};



 useEffect(() => {
  if (!selectedDate) return;
  const month = selectedDate.month() + 1;
  const year = selectedDate.year();
  fetchData(month, year);
}, [selectedDate]);
  return (
    <div className="dashboard-container">
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Mời chọn tháng để xem báo cáo :
        < DatePicker
          picker="month"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          style={{ marginBottom: 24 }}
        /> 
      </h2>
      
      <Divider />
      <Row gutter={24}>
        <Col span={8}>
          <Card className="statistic-card">
            <Statistic 
            title="Tổng số phòng" 
            value={roomData.total} 
            prefix={<i className="fas fa-building" style={{ color: "#1890ff" }} />}

            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="statistic-card">
            <Statistic 
            title="Phòng đã thuê" 
            value={roomData.rented}  
            prefix={<i class="fa-solid fa-person-shelter" style={{ color: "#52c41a" }} />}
            valueStyle={{ color: "#52c41a" }}
            />
            
          </Card>
        </Col>
        <Col span={8}>
          <Card className="statistic-card">
            <Statistic 
            title="Phòng trống" 
            value={roomData.available} 
            valueStyle={{ color: "#faad14" }} 
            prefix={<i className="fas fa-door-open" style={{ color: "#3f8600" }} />}
            />

          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card className="statistic-card">
            <Statistic 
            title="Tổng số người dùng" 
            value={userCount} 
            prefix={<i className="fas fa-users" style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="statistic-card">
            <Statistic title="Đang thuê phòng" value={userWithRoom} valueStyle={{ color: "#1890ff" }}
            prefix={<i class="fa-solid fa-person-shelter" style={{ color: "#3f8600" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="statistic-card">
            <Statistic title="Chưa có phòng" value={userWithoutRoom} 
            valueStyle={{ color: "#faad14" }}
            prefix={<i className="fas fa-door-open" style={{ color: "#3f8600" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Doanh thu từng tòa */}
      <h3 style={{ margin: 16 }}>
        Doanh thu theo tòa nhà (
        {selectedDate ? selectedDate.format("MM/YYYY") : "chưa chọn"}
        )
      </h3>

      {buildingRevenues.length === 0 ? (
        <p style={{ marginTop: 12, color: "#999" }}>
          Không có dữ liệu doanh thu trong tháng này.
        </p>
      ) : (
        <Row gutter={24}>
          {buildingRevenues.map((bld, idx) => (
            <Col span={8} key={idx}>
              <Card className="statistic-card">
                <Statistic
                  title={`Tòa: ${bld.buildingName}`}
                  value={bld.totalRevenue}
                  suffix="VNĐ"
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

    </div>
  );
};

export default HomePage;
