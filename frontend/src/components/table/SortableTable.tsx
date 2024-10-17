import React, { useState, useEffect } from "react";
import { sortData } from "@/utils/table_functions";

// Interface for the table props, specifying the structure of headers and data
interface SortableTableProps {
    headers: { key: string; label: string }[]; // Array of header objects, each with a key and label
    data: any[]; // Array of data objects to be displayed in the table
}

// SortableTable component allows sorting and searching of tabular data
const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => {
    const [sortedData, setSortedData] = useState(data); // State to hold the sorted data
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: boolean } | null>(null); // State to manage sort configuration (key and direction)
    const [searchQuery, setSearchQuery] = useState(""); // State for search input

    useEffect(() => {
        setSortedData(data); // Update sortedData when data prop changes
    }, [data]);

    // Function to handle sorting when a header is clicked
    const handleSort = (key: string) => {
        let direction = true; // Default sorting direction is ascending
        if (sortConfig && sortConfig.key === key) {
            direction = !sortConfig.direction; // If the same column is clicked again, toggle the sorting direction
        }
        const sorted = sortData([...sortedData], key, direction); // sortData should handle the sorting logic
        setSortedData(sorted);
        setSortConfig({ key, direction });
    };

    // Function to handle changes in the search input
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
                onChange={handleSearchChange} // Update search query when input changes
                className="form-control mb-3"
            />
            <table>
                <thead>
                    <tr>
                        {/* Render table headers, allowing sorting by clicking */}
                        {headers.map((header) => (
                            <th key={header.key} onClick={() => handleSort(header.key)}>
                                {header.label}
                                {sortConfig?.key === header.key ? (sortConfig.direction ? " ▲" : " ▼") : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Render table rows if filteredData has matching entries */}
                    {filteredData.length > 0 ? (
                        filteredData.map((row, i) => (
                            <tr key={i}>
                                {headers.map((header) => (
                                    <td key={header.key}>{row[header.key]}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        // If no data matches the search, show a message indicating no results
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
