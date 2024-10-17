// components/SortableTable.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortableTable from "../components/table/SortableTable";
import { sortData } from "@/utils/table_functions";

// Mock the sortData function
jest.mock("@/utils/table_functions", () => ({
    sortData: jest.fn((data: any[], key: string, direction: boolean) => {
        // Simple mock for sorting - change according to your sort logic
        return data.sort((a, b) => {
            if (direction) {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });
    }),
}));

describe("SortableTable", () => {
    const headers = [
        { key: "name", label: "Name" },
        { key: "age", label: "Age" },
    ];

    const data = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 20 },
    ];

    it("renders correctly with given headers and data", () => {
        render(<SortableTable headers={headers} data={data} />);

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Age")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    it("sorts the data when a header is clicked", () => {
        render(<SortableTable headers={headers} data={data} />);
        
        // Simulate clicking the "Name" header to sort
        fireEvent.click(screen.getByText("Name"));

        // Check that the sortData function was called with the correct arguments
        expect(sortData).toHaveBeenCalledWith(data, "name", true);
        
        // Check if the sorted data is rendered
        expect(screen.getByText("Alice")).toBeInTheDocument(); // Check that Alice is still there
        expect(screen.getByText("Bob")).toBeInTheDocument(); // Check that Bob is still there
        expect(screen.getByText("Charlie")).toBeInTheDocument(); // Check that Charlie is still there
    });

    it("filters the data based on the search query", () => {
        render(<SortableTable headers={headers} data={data} />);

        // Simulate entering a search query
        fireEvent.change(screen.getByPlaceholderText("Search..."), {
            target: { value: "Alice" },
        });

        // Check that only Alice is shown in the table
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
        expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });

    it("displays a message when no data matches the search", () => {
        render(<SortableTable headers={headers} data={data} />);

        // Simulate entering a search query that matches no data
        fireEvent.change(screen.getByPlaceholderText("Search..."), {
            target: { value: "Nonexistent" },
        });

        // Check that the no data message is displayed
        expect(screen.getByText("No data matches your search.")).toBeInTheDocument();
    });
});
