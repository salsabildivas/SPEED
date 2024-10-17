import React, { useState, useEffect } from "react";
import { sortData } from "@/utils/table_functions";

interface SortableTableProps {
    headers: { key: string; label: string }[];
    data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: boolean } | null>(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input

    useEffect(() => {
        setSortedData(data); // Update sortedData when data prop changes
    }, [data]);

    const handleSort = (key: string) => {
        let direction = true;
        if (sortConfig && sortConfig.key === key) {
            direction = !sortConfig.direction;
        }
        const sorted = sortData([...sortedData], key, direction); // sortData should handle the sorting logic
        setSortedData(sorted);
        setSortConfig({ key, direction });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update the search query
    };

    // Filter the data based on the search query
    const filteredData = sortedData.filter((row) =>
        headers.some((header) => 
            row[header.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div>
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control mb-3"
            />
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
                    {filteredData.length > 0 ? (
                        filteredData.map((row, i) => (
                            <tr key={i}>
                                {headers.map((header) => (
                                    <td key={header.key}>{row[header.key]}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="text-center">
                                No data matches your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SortableTable;
