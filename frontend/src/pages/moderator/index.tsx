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
    claim: string;
    research_type: string;
    participant_type: string;
    software_practice: string;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const AnalystArticles: NextPage<ArticlesProps> = ({ articles }) => {
    const [articleList, setArticleList] = useState<ArticlesInterface[]>(articles);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`http://localhost:8085/api/submissions`);
                if (!res.ok) {
                    throw new Error("Failed to fetch articles");
                }
                const data = await res.json();
                // Filter articles based on status being 'pending' or 'accepted'
                const filteredData = data.filter((article: any) =>
                    article.status === "pending" || article.status === "accepted"
                );
                setArticleList(filteredData.map((article: any) => ({
                    id: article._id,
                    title: article.title,
                    author: article.author,
                    journal_name: article.journal_name,
                    published_year: article.published_year,
                    doi: article.doi,
                    description: article.description,
                    status: article.status,
                    claim: article.claim,
                    research_type: article.research_type,
                    participant_type: article.participant_type,
                    software_practice: article.software_practice,
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
        { key: "status", label: "Status" },
        { key: "claim", label: "Claim" },
        { key: "research_type", label: "Research Type" },
        { key: "participant_type", label: "Participant Type" },
        { key: "software_practice", label: "Software Practice" },
        { key: "actions", label: "Actions" },
    ];

    const updateArticleDetails = async (id: string, details: any) => {
        try {
            const res = await fetch(`http://localhost:8085/api/submissions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to update article: ${errorData.message}`);
            }

            // Update the article list with the updated details
            setArticleList((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === id ? { ...article, ...details } : article
                )
            );
        } catch (error) {
            console.error("Error updating article details:", error);
        }
    };

    const renderActions = (article: ArticlesInterface) => {
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => updateArticleDetails(article.id, { claim: "strong" })}
                    className="action-button"
                >
                    Set Strong Claim
                </button>
                <button
                    onClick={() => updateArticleDetails(article.id, { claim: "weak" })}
                    className="action-button"
                >
                    Set Weak Claim
                </button>
                {/* Add more fields for Research Type, Participant, etc. */}
            </div>
        );
    };

    return (
        <div className="container">
            <h1>Analyst Articles Index Page</h1>
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
        // Filter articles for only "pending" or "accepted" status
        const filteredData = data.filter((article: any) =>
            article.status === "pending" || article.status === "accepted"
        );
        articles = filteredData.map((article: any) => ({
            id: article._id,
            title: article.title,
            author: article.author,
            journal_name: article.journal_name,
            published_year: article.published_year,
            doi: article.doi,
            description: article.description,
            status: article.status,
            claim: article.claim,
            research_type: article.research_type,
            participant_type: article.participant_type,
            software_practice: article.software_practice,
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

export default AnalystArticles;
