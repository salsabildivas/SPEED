import React, { useState, useEffect } from "react";
import { sortData } from "@/utils/table_functions";

interface SortableTableProps {
    headers: { key: string; label: string }[];
    data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: boolean } | null>(null);

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const handleSort = (key: string) => {
        let direction = true;
        if (sortConfig && sortConfig.key === key) {
            direction = !sortConfig.direction;
        }
        const sorted = sortData([...sortedData], key, direction);
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
                        <td key={header.key}>

                            {header.key === "actions" ? null : row[header.key]}
                        </td>
                    ))}
                    <td>{row.actions}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default SortableTable;
