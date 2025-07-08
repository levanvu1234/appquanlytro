import React, { useContext, useState } from 'react';
import { ContactsOutlined,ShopOutlined,HomeOutlined ,BarChartOutlined,MailOutlined,CalendarOutlined , SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import '../../style/header.css';

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  
  console.log("Auth", JSON.stringify(auth, null, 2));
  const [current, setCurrent] = useState('home');
  
  const onClick = (e) => {
    setCurrent(e.key);
  };

  // menu bên trái
  const leftMenuItems = [
    {
      label: <Link to="/">Trang chủ</Link>,
      key: 'home',
      icon: <BarChartOutlined />,
    },
  ]
  // menu ở giữa
  const centerMenuItems = [ 
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/user">Người dùng</Link>,
            key: 'user',
            icon: <ContactsOutlined />,
          },
          {
            label: <Link to="/room">Danh sách phòng</Link>,
            key: 'room',
            icon: <HomeOutlined />,
          },
          {
            label: <Link to="/building">Danh sách tòa nhà</Link>,
            key: 'building',
            icon: <ShopOutlined />,
          },
          {
            label: <Link to="/bill">Danh sách hóa đơn</Link>,
            key: 'bill',
            icon: <CalendarOutlined />,
          },
          {
            label: <Link to="/device">Danh sách thiết bị</Link>,
            key: 'device',
            icon: <CalendarOutlined />,
          },
        ]
      : []),
  ];

  // submenu bên phải
  const rightMenuItems = [
    {
      label: (
        <span className="welcome-text">
          Welcome {auth?.user?.name || ''} – {auth?.user?.phonenumber || ''}
        </span>
      ),
      key: 'submenu',
      icon: <SettingOutlined />,
      children: [
        {
          type: 'group',
          children: [
            ...(auth.isAuthenticated
              ? [
                  {
                    label: (
                      <span
                        onClick={() => {
                          localStorage.clear('access_token');
                          navigate('/');
                          setAuth({
                            isAuthenticated: false,
                            user: { phonenumber: '', name: '' },
                          });
                          setCurrent('home');
                        }}
                      >
                        Đăng xuất
                      </span>
                    ),
                    key: 'logout',
                  },
                ]
              : [
                  {
                    label: <Link to="/login">Đăng nhập</Link>,
                    key: 'login',
                  },
                ]),
            {
              label: <Link to="/register">Đăng ký</Link>,
              key: 'register',
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="header-container-flex">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={leftMenuItems}
        className="left-menu"
      />
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={centerMenuItems}
        className="center-menu"
      />

      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={rightMenuItems}
        className="right-menu"
      />
    </div>
  );
};

export default Header;
