import React from 'react';
import { Table, Tag } from 'antd';

const columns = [
  {
    title: 'User',
    dataIndex: ['user', 'name'],
    key: 'user'
  },
  {
    title: 'Book',
    dataIndex: ['book', 'title'],
    key: 'book'
  },
  {
    title: 'Action',
    dataIndex: 'actionType',
    key: 'action',
    render: action => (
      <Tag color={action === 'BORROW' ? 'blue' : 'green'}>
        {action}
      </Tag>
    )
  },
  {
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'date',
    render: date => new Date(date).toLocaleString()
  }
];

export const RecentActivityTable = ({ data }) => (
  <Table 
    columns={columns} 
    dataSource={data} 
    pagination={false}
    rowKey="id"
    size="small"
  />
);