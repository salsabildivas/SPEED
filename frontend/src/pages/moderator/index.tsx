import { GetStaticProps, NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";

interface ArticlesInterface {
    id: string; 
    title: string;
    author: string; 
    journal_name: string; 
    published_year: string; 
    doi: string;
    description: string; 
    status: string; 
    actions: string;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const ModeratorArticles: NextPage<ArticlesProps> = ({ articles }) => {
    const [articleList, setArticleList] = useState<ArticlesInterface[]>(articles);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`http://speedbackend2.vercel.app/api/submissions`);
                if (!res.ok) {
                    throw new Error("Failed to fetch articles");
                }
                const data = await res.json();
                const sortedData = data
                .map((article: any) => ({
                    id: article._id,
                    title: article.title,
                    author: article.author,
                    journal_name: article.journal_name,
                    published_year: article.published_year,
                    doi: article.doi,
                    description: article.description,
                    status: article.status,
                }))
                .sort((a: ArticlesInterface, b: ArticlesInterface) => {
                    // Sort by "awaiting moderation" status first
                    if (a.status === "awaiting moderation" && b.status !== "awaiting moderation") {
                        return -1;
                    }
                    if (a.status !== "awaiting moderation" && b.status === "awaiting moderation") {
                        return 1;
                    }
                    return 0;
                });

                setArticleList(sortedData);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, []);

    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "journal_name", label: "Journal" },
        { key: "published_year", label: "Publication Year" },
        { key: "doi", label: "DOI" },
        { key: "status", label: "Status"},
        { key: "actions", label: "Actions" },
    ];

    const updateArticleStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`http://speedbackend2.vercel.app/api/submissions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to update status: ${errorData.message}`);
            }

            // Optimistically update the article list after successful status update
            setArticleList((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === id ? { ...article, status: newStatus } : article
                )
            );

        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const rejectArticle = async (article: ArticlesInterface) => {
        try {
            // Update the article's status to "rejected"
            const statusUpdateRes = await fetch(`http://speedbackend2.vercel.app/api/submissions/${article.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "rejected" }),
            });
    
            if (!statusUpdateRes.ok) {
                const errorData = await statusUpdateRes.json();
                throw new Error(`Failed to update status: ${errorData.message}`);
            }
    
            // Add the article to the rejected database
            const response = await fetch("http://speedbackend2.vercel.app/api/rejected", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(article),
            });
    
            if (response.ok) {
                console.log("Article added to rejected database successfully!");
            } else {
                console.error("Failed to add rejected article to database");
            }
    
            // Optimistically update the article list after successful rejection
            setArticleList((prevArticles) =>
                prevArticles.map((a) => a.id === article.id ? { ...a, status: "rejected" } : a)
            );
    
        } catch (error) {
            console.error("An error occurred while rejecting the article:", error);
        }
    };

    const renderActions = (article: ArticlesInterface) => {
        const isAwaitingModeration = article.status === "awaiting moderation";

        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => updateArticleStatus(article.id, "pending analysis")}
                    disabled={!isAwaitingModeration}
                    className={`action-button approve-button ${!isAwaitingModeration ? 'disabled' : ''}`}
                >
                    Approve
                </button>
                <button
                    onClick={() => rejectArticle(article)}
                    disabled={!isAwaitingModeration}
                    className={`action-button reject-button ${!isAwaitingModeration ? 'disabled' : ''}`}
                >
                    Reject
                </button>
            </div>
        );
    };

    // Pagination logic
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articleList.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalPages = Math.ceil(articleList.length / articlesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container">
            <h1>Moderator Articles Page</h1>
            <SortableTable 
                headers={headers} 
                data={currentArticles.map((article) => ({
                    ...article,
                    actions: renderActions(article),
                }))}
            />
            <div className="pagination-container">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1} 
                    className="pagination-button"
                >
                    Previous
                </button>
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages} 
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

// Fetch data from the backend API
export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
    let articles: ArticlesInterface[] = [];

    try {
        const res = await fetch("http://localhost:8085/api/submissions");
        if (!res.ok) {
            throw new Error("Failed to fetch articles");
        }
        const data = await res.json();
        articles = data.map((article: any) => ({
            id: article._id,
            title: article.title,
            author: article.author,
            journal_name: article.journal_name,
            published_year: article.published_year,
            doi: article.doi,
            description: article.description,
            status: article.status,
        }));
    } catch (error) {
        console.error("Error fetching articles:", error);
    }

    return {
        props: {
            articles,
        },
    };
};

export default ModeratorArticles;
