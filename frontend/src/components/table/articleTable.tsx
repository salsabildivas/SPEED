import React, { useState, useEffect } from "react";
import { sortData } from "@/utils/table_functions";
import { useRouter } from "next/router";

interface ArticleTableProps {
    headers: { key: string; label: string }[];
    data: any[];
}

const ArticleTable: React.FC<ArticleTableProps> = ({ headers, data}) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: boolean } | null>(null);

    const router = useRouter();

    let ids: String[] = data.map(id => id.id)


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
                    <tr key={i} onClick={() => router.push(`/articles/${ids[i]}`)}>
                        {headers.map((header) => (
                            <td key={header.key}>{row[header.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ArticleTable;
