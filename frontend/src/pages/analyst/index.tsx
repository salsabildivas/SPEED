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
    claim: string;
    research_type: string;
    participant: string;
    practice: string;
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
                setArticleList(data.map((article: any) => ({
                    id: article._id,
                    title: article.title,
                    author: article.author,
                    journal_name: article.journal_name,
                    published_year: article.published_year,
                    doi: article.doi,
                    description: article.description,
                    claim: article.claim || "",
                    research_type: article.research_type || "",
                    participant: article.participant || "",
                    practice: article.practice || "",
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
        { key: "claim", label: "Claim Strength" },
        { key: "research_type", label: "Research Type" },
        { key: "participant", label: "Participant Type" },
        { key: "practice", label: "Engineering Practice" },
    ];

    const updateArticleAttributes = async (id: string, newAttributes: Partial<ArticlesInterface>) => {
        try {
            const res = await fetch(`http://localhost:8085/api/submissions/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAttributes),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to update article: ${errorData.message}`);
            }

            setArticleList((prevArticles) =>
                prevArticles.map((article) =>
                    article.id === id ? { ...article, ...newAttributes } : article
                )
            );
        } catch (error) {
            console.error("Error updating article attributes:", error);
        }
    };

    const renderActions = (article: ArticlesInterface) => (
        <div>
            <div>
                <label>Claim Strength:</label>
                <select
                    value={article.claim}
                    onChange={(e) => updateArticleAttributes(article.id, { claim: e.target.value })}
                >
                    <option value="">Select Claim Strength</option>
                    <option value="strong">Strong</option>
                    <option value="weak">Weak</option>
                </select>
            </div>

            <div>
                <label>Research Type:</label>
                <select
                    value={article.research_type}
                    onChange={(e) => updateArticleAttributes(article.id, { research_type: e.target.value })}
                >
                    <option value="">Select Research Type</option>
                    <option value="empirical">Empirical</option>
                    <option value="theoretical">Theoretical</option>
                    <option value="case_study">Case Study</option>
                    <option value="experiment">Experiment</option>
                </select>
            </div>

            <div>
                <label>Participant Type:</label>
                <select
                    value={article.participant}
                    onChange={(e) => updateArticleAttributes(article.id, { participant: e.target.value })}
                >
                    <option value="">Select Participant Type</option>
                    <option value="students">Students</option>
                    <option value="professionals">Professionals</option>
                    <option value="general_public">General Public</option>
                </select>
            </div>

            <div>
                <label>Engineering Practice:</label>
                <select
                    value={article.practice}
                    onChange={(e) => updateArticleAttributes(article.id, { practice: e.target.value })}
                >
                    <option value="">Select Engineering Practice</option>
                    <option value="agile">Agile</option>
                    <option value="waterfall">Waterfall</option>
                    <option value="scrum">Scrum</option>
                    <option value="kanban">Kanban</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="container">
            <h1>Analyst View</h1>
            <p>Page containing a table of articles for analyst review:</p>
            <SortableTable
                headers={headers}
                data={articleList.map((article) => ({
                    ...article,
                    actions: renderActions(article),
                }))}
            />
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
            claim: article.claim || "",
            research_type: article.research_type || "",
            participant: article.participant || "",
            practice: article.practice || "",
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
