import React, { useState } from "react";
import { sortData } from "@/utils/table_functions";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: boolean } | null>(null);

  const handleSort = (key: string) => {
    let direction = true;
    if (sortConfig && sortConfig.key === key) {
      // Toggle the sorting direction if the same key is clicked
      direction = !sortConfig.direction;
    }
    const sorted = sortData([...sortedData], key, direction); // sortData should handle the sorting logic
    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key} onClick={() => handleSort(header.key)}>
              {header.label}
              {sortConfig?.key === header.key ? (sortConfig.direction ? " ▲" : " ▼") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, i) => (
          <tr key={i}>
            {headers.map((header) => (
              <td key={header.key}>{row[header.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
