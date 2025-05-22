import React, { useEffect, useState } from 'react';

const TableHeaderStyles = ({ children }) => {
  const [headerClass, setHeaderClass] = useState("");

  useEffect(() => {
    const determineHeaderClass = () => {
      const day = new Date().getDay();
      switch (day) {
        case 0:
          setHeaderClass("header-sunday");
          break;
        case 1:
          setHeaderClass("header-monday");
          break;
        case 2:
          setHeaderClass("header-tuesday");
          break;
        case 3:
          setHeaderClass("header-wednesday");
          break;
        case 4:
          setHeaderClass("header-thursday");
          break;
        case 5:
          setHeaderClass("header-friday");
          break;
        case 6:
          setHeaderClass("header-saturday");
          break;
        default:
          setHeaderClass("");
          break;
      }
    };

    determineHeaderClass();
  }, []);

  return (
    <div className={headerClass}>
      {children}
      <style jsx>{`
        .header-sunday .ant-table-thead > tr > th {
          background-color: #F2F4F4;
        }
        .header-monday .ant-table-thead > tr > th {
          background-color: #EAFAF1;
        }
        .header-tuesday .ant-table-thead > tr > th {
          background-color: #EAFAF1;
        }
        .header-wednesday .ant-table-thead > tr > th {
          background-color: #F4ECF7;
        }
        .header-thursday .ant-table-thead > tr > th {
          background-color: #F4ECF7;
        }
        .header-friday .ant-table-thead > tr > th {
          background-color: #FDEDEC;
        }
        .header-saturday .ant-table-thead > tr > th {
          background-color: #FDEDEC;
        }
      `}</style>
    </div>
  );
};

export default TableHeaderStyles;
