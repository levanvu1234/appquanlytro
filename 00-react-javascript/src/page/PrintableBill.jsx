// src/components/PrintableBill.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Đăng ký font Roboto nếu cần (nếu dùng Google Font host nội bộ)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/font/Roboto-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/font/Roboto-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

// Định nghĩa CSS
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    padding: 4,
  },
  col: {
    flex: 1,
    padding: 2,
  },
  header: {
    fontWeight: 700,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
  },
});

const PrintableBill = ({ bill }) => {
  if (!bill) return null;

  const {
    room,
    month,
    year,
    electricityUsage,
    electricityUnitPrice,
    waterUsage,
    waterUnitPrice,
    roomPrice,
    totalCost,
  } = bill;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>PHIẾU THU TIỀN PHÒNG TRỌ</Text>

        <Text>Phòng số: {room?.name || "?"}</Text>
        <Text>
           Tháng {month} năm {year}
        </Text>

        {/* Bảng giá */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.col, { flex: 2 }]}>Khoản thu</Text>
          <Text style={styles.col}>Tổng số</Text>
          <Text style={styles.col}>Đơn giá</Text>
          <Text style={styles.col}>Thành tiền</Text>
        </View>

        {/* Tiền điện */}
        <View style={styles.row}>
          <Text style={[styles.col, { flex: 2 }]}>Tiền điện sinh hoạt</Text>
          <Text style={styles.col}>{electricityUsage}</Text>
          <Text style={styles.col}>{electricityUnitPrice?.toLocaleString("vi-VN")}</Text>
          <Text style={styles.col}>
            {electricityUsage && electricityUnitPrice
              ? (electricityUsage * electricityUnitPrice).toLocaleString("vi-VN")
              : "0"}
          </Text>

        </View>

        {/* Tiền nước */}
        <View style={styles.row}>
          <Text style={[styles.col, { flex: 2 }]}>Tiền nước sinh hoạt</Text>
          <Text style={styles.col}>{waterUsage}</Text>
          <Text style={styles.col}>{waterUnitPrice?.toLocaleString("vi-VN")}</Text>
          <Text style={styles.col}>
            {waterUsage && waterUnitPrice
              ? (waterUsage * waterUnitPrice).toLocaleString("vi-VN")
              : "0"}
          </Text>

        </View>

        {/* Tiền phòng */}
        <View style={styles.row}>
          <Text style={[styles.col, { flex: 2 }]}>Tiền phòng</Text>
          <Text style={styles.col}>1</Text>
          <Text style={styles.col}>{roomPrice?.toLocaleString("vi-VN")}</Text>
          <Text style={styles.col}>{roomPrice?.toLocaleString("vi-VN")}</Text>
        </View>

        {/* Tổng tiền */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.col, { flex: 5 }]}>Tổng cộng tiền trong tháng</Text>
          <Text style={styles.col}>
            {(totalCost ?? 0).toLocaleString("vi-VN")} ₫
          </Text>

        </View>

        
        
      </Page>
    </Document>
  );
};

export default PrintableBill;
