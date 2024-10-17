import { GetStaticProps, NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";
import Modal from 'react-modal';

interface ArticlesInterface {
    id: string;
    title: string;
    author: string;
    journal_name: string;
    published_year: string;
    volume_number: string;
    pages: number | null;
    publisher: string;
    doi: string;
    SE_practice: string;
    claim: string;
    evidence: string;
    type_of_research: string;
    type_of_participant: string;
}

interface ArticleWithActions extends ArticlesInterface {
    actions: JSX.Element;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const PublishArticles: NextPage<ArticlesProps> = ({ articles }) => {
    const [articleList, setArticleList] = useState<ArticlesInterface[]>(articles);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<ArticlesInterface | null>(null);

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [journal_name, setJournalName] = useState('');
    const [published_year, setPublishedYear] = useState('');
    const [volume_number, setVolumeNumber] = useState('');
    const [pages, setPages] = useState<number | null>(null);
    const [publisher, setPublisher] = useState('');
    const [doi, setDOI] = useState('');
    const [SE_practice, setSEPractice] = useState('');
    const [claim, setClaim] = useState('');
    const [evidence, setEvidence] = useState('');
    const [type_of_research, setTypeOfResearch] = useState('');
    const [type_of_participant, setTypeOfParticipant] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            console.log("fetching articles");
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
                    volume_number: article.volume_number,
                    pages: article.pages,
                    publisher: article.publisher,
                    doi: article.doi,
                    SE_practice: article.SE_practice || "",
                    claim: article.claim || "",
                    evidence: article.evidence || "",
                    type_of_research: article.type_of_research || "",
                    type_of_participant: article.type_of_participant || "",
                })));
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles()
    }, []);

    const headers: { key: keyof ArticleWithActions; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "journal_name", label: "Journal" },
        { key: "published_year", label: "Publication Year" },
        { key: "volume_number", label: "Volume" },
        { key: "pages", label: "Pages" },
        { key: "doi", label: "doi" },
        { key: "actions", label: "Actions" },
    ];

    const openModal = (article: ArticlesInterface) => {
        setSelectedArticle(article);
        setTitle(article.title);
        setAuthor(article.author);
        setJournalName(article.journal_name);
        setPublishedYear(article.published_year);
        setVolumeNumber(article.volume_number);
        setPages(article.pages);
        setPublisher(article.publisher);
        setDOI(article.doi);
        setSEPractice(article.SE_practice);
        setClaim(article.claim);
        setEvidence(article.evidence);
        setTypeOfResearch(article.type_of_research);
        setTypeOfParticipant(article.type_of_participant);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedArticle(null);
    };

    const handleSubmit = async () => {
        if (!selectedArticle) return;

        const updatedArticle = {
            ...selectedArticle,
            title,
            author,
            journal_name,
            published_year,
            volume_number,
            pages,
            publisher,
            doi,
            SE_practice,
            claim,
            evidence,
            type_of_research,
            type_of_participant,
        };

        console.log("Updated Article:", updatedArticle);

        try {
            // Post to published_articles
            const postRes = await fetch(`http://localhost:8085/api/articles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedArticle),
            });

            if (!postRes.ok) {
                const errorData = await postRes.json();
                throw new Error(`Failed to publish article: ${errorData.message}`);
            }

            console.log("Article published and removed from submissions");

            setArticleList(prevArticles =>
                prevArticles.filter(article => article.id !== selectedArticle.id)
            );

            closeModal();
        } catch (error) {
            console.error("Error updating article:", error);
        }
    };

    const renderActions = (article: ArticlesInterface) => (
        <button onClick={() => openModal(article)}>Review & Publish</button>
    );

    return (
        <div className="container">
            <h1>Analyst View</h1>
            <p>Please review each article correctly and concisely:</p>
            <SortableTable
                headers={headers}
                data={articleList.map((article) => ({
                    ...article,
                    actions: renderActions(article),
                }))}
            />

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Review Article"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: '1200px',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        background: '#ffffff',
                        overflowY: 'auto',
                        maxHeight: '67vh',
                        height: '100%',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Review & Publish</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>Author:</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>Journal Name:</label>
                        <input
                            type="text"
                            value={journal_name}
                            onChange={(e) => setJournalName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>Publication Year:</label>
                        <input
                            type="text"
                            value={published_year}
                            onChange={(e) => setPublishedYear(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Volume Number:</label>
                        <input
                            type="text"
                            value={volume_number}
                            onChange={(e) => setVolumeNumber(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>Pages:</label>
                        <input
                            type="number"
                            value={pages ?? ""}
                            onChange={(e) => setPages(e.target.value ? Number(e.target.value) : null)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>Publisher:</label>
                        <input
                            type="text"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <label style={{ display: 'block', marginBottom: '5px' }}>DOI:</label>
                        <input
                            type="text"
                            value={doi}
                            onChange={(e) => setDOI(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>SE Practice:</label>
                        <input
                            type="text"
                            value={SE_practice}
                            onChange={(e) => setSEPractice(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Claim:</label>
                        <input
                            type="text"
                            value={claim}
                            onChange={(e) => setClaim(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Type of Participant:</label>
                        <input
                            type="text"
                            value={type_of_participant}
                            onChange={(e) => setTypeOfParticipant(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Type of Research:</label>
                        <input
                            type="text"
                            value={type_of_research}
                            onChange={(e) => setTypeOfResearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Evidence:</label>
                        <input
                            type="text"
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: '1',
                            marginRight: '10px',
                        }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={closeModal}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: '1',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
};

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
            title: article.title || "",
            author: article.author || "",
            journal_name: article.journal_name || "",
            published_year: article.published_year || "",
            volume_number: article.volume_number || "",
            pages: article.pages !== undefined ? article.pages : null,
            publisher: article.publisher || "",
            DOI: article.DOI || "",
            SE_practice: article.SE_practice || "",
            claim: article.claim || "",
            evidence: article.evidence || "",
            type_of_research: article.type_of_research || "",
            type_of_participant: article.type_of_participant || "",
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

export default PublishArticles;
