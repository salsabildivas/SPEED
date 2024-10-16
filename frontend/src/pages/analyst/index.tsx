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
    DOI: string;
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
    const [DOI, setDOI] = useState('');
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
                    DOI: article.DOI,
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

        fetchArticles();
    }, []);

    const headers: { key: keyof ArticleWithActions; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "journal_name", label: "Journal" },
        { key: "published_year", label: "Publication Year" },
        { key: "volume_number", label: "Volume" },
        { key: "pages", label: "Pages" },
        { key: "DOI", label: "DOI" },
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
        setDOI(article.DOI);
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
            DOI,
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
            >
                <h2>Review & Publish</h2>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Author:</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <div>
                    <label>Journal Name:</label>
                    <input
                        type="text"
                        value={journal_name}
                        onChange={(e) => setJournalName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Publication Year:</label>
                    <input
                        type="text"
                        value={published_year}
                        onChange={(e) => setPublishedYear(e.target.value)}
                    />
                </div>
                <div>
                    <label>Volume Number:</label>
                    <input
                        type="text"
                        value={volume_number}
                        onChange={(e) => setVolumeNumber(e.target.value)}
                    />
                </div>
                <div>
                    <label>Pages:</label>
                    <input
                        type="number"
                        value={pages ?? ""}
                        onChange={(e) => setPages(e.target.value ? Number(e.target.value) : null)}
                    />
                </div>
                <div>
                    <label>Publisher:</label>
                    <input
                        type="text"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                    />
                </div>
                <div>
                    <label>DOI:</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
                    />
                </div>
                <div>
                    <label>SE Practice:</label>
                    <input
                        type="text"
                        value={SE_practice}
                        onChange={(e) => setSEPractice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Claim:</label>
                    <input
                        type="text"
                        value={claim}
                        onChange={(e) => setClaim(e.target.value)}
                    />
                </div>
                <div>
                    <label>Evidence:</label>
                    <input
                        type="text"
                        value={evidence}
                        onChange={(e) => setEvidence(e.target.value)}
                    />
                </div>
                <div>
                    <label>Type of Research:</label>
                    <input
                        type="text"
                        value={type_of_research}
                        onChange={(e) => setTypeOfResearch(e.target.value)}
                    />
                </div>
                <div>
                    <label>Type of Participant:</label>
                    <input
                        type="text"
                        value={type_of_participant}
                        onChange={(e) => setTypeOfParticipant(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={closeModal}>Cancel</button>
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
