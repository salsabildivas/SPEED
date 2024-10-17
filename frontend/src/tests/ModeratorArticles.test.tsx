import { describe, expect, test, afterEach, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModeratorArticles from "../pages/moderator/index"; // Adjust the import path as needed

// Create a mock for fetch
const fetchMock = jest.fn();
global.fetch = fetchMock as jest.Mock;

describe("ModeratorArticles Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  afterEach(() => {
    jest.clearAllMocks(); // Ensure mocks are cleared after each test
  });

  it("should update article status correctly", async () => {
    // Mock the fetch response for the POST request to create the article
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "1",
        title: "Sample Article",
        author: "Author Name",
        journal_name: "Sample Journal",
        published_year: "2023",
        doi: "10.1234/sample",
        description: "This is a sample description.",
        status: "awaiting moderation",
        actions: "approve", // Include the actions property
      }),
    });

    // Mock the fetch response for the PUT request
    fetchMock.mockResolvedValueOnce({
      ok: true,
    });

    // Sample articles for the component to render
    const sampleArticles = [
      {
        id: "1",
        title: "Sample Article",
        author: "Author Name",
        journal_name: "Sample Journal",
        published_year: "2023",
        doi: "10.1234/sample",
        description: "This is a sample description.",
        status: "awaiting moderation",
        actions: "approve", // Include the actions property
      },
    ];

    render(<ModeratorArticles articles={sampleArticles} />);

    // Find the approve button
    const approveButton = screen.getByRole("button", { name: /approve/i });

    // Click the approve button
    fireEvent.click(approveButton);

    // Wait for the fetch call to be called for updating the article
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8085/api/submissions/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending analysis" }),
        }
      );
    });

    // Optionally: Assert that the article status has been updated in the UI
    // (You need to add this functionality to your component first for this to work)
    // const updatedStatus = screen.getByText(/pending analysis/i);
    // expect(updatedStatus).toBeInTheDocument();
  });
});
