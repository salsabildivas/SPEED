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

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`http://localhost:8085/api/submissions`);
                if (!res.ok) {
                    throw new Error("Failed to fetch articles");
                }
                const data = await res.json();
                setArticleList(data.map((article: any) => ({
                    id: article._id,
                    title: article.title,
                    author: article.author,
                    journal_name: article.journal_name,
                    published_year: article.published_year,
                    doi: article.doi,
                    description: article.description,
                    status: article.status,
                })));
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
            const res = await fetch(`http://localhost:8085/api/submissions/${id}`, {
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

            // Optionally refetch articles to ensure data consistency
            // await fetchArticles(); // Uncomment this line if you want to refetch the articles

        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const renderActions = (article: ArticlesInterface) => {
        const isAwaitingModeration = article.status === "awaiting moderation";

        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => updateArticleStatus(article.id, "awaiting analysis")}
                    disabled={!isAwaitingModeration}
                    className={`action-button approve-button ${!isAwaitingModeration ? 'disabled' : ''}`}
                >
                    Approve
                </button>
                <button
                    onClick={() => updateArticleStatus(article.id, "rejected")}
                    disabled={!isAwaitingModeration}
                    className={`action-button reject-button ${!isAwaitingModeration ? 'disabled' : ''}`}
                >
                    Reject
                </button>
            </div>
        );
    };

    return (
        <div className="container">
            <h1>Moderator Articles Index Page</h1>
            <p>Page containing a table of articles:</p>
            <SortableTable headers={headers} data={articleList.map((article) => ({
                ...article,
                actions: renderActions(article),
            }))} />
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
