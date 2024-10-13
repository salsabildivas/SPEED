import { GetStaticProps, NextPage } from "next";
import ArticleTable from "@/components/table/articleTable";

interface ArticlesInterface {
  id: string;
  title: string;
  author: string;
  journal_name: string;
  published_year: string;
  volume_number: string;
  pages: number;
  publisher: string;
  DOI: string;
  SE_practice: string;
  claim: string;
  evidence: string;
  type_of_research: string;
  type_of_participant: string;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    //{ key: "id", label: "id" },
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "journal_name", label: "Journal Name"},
    { key: "published_year", label: "Publication Year"},
    //{ key: "volume_number", label: "Volume Number"},
    //{ key: "pages", label: "Total pages"},
    //{ key: "publisher", label: "Publisher"},
    //{ key: "DOI", label:"DOI"},
    { key: "SE_practice", label:"Software Engineering Practice"},
    { key:"claim", label:"Claim"},
    { key:"evidence", label:"Evidence"},
    { key:"type_of_research", label:"Type of research"},
    { key:"type_of_participant", label:"Type of participant"},
  ];

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles:</p>
      <ArticleTable headers={headers} data={articles} />
    </div>
  );
};

// Fetch data from the backend API
export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
  let articles: ArticlesInterface[] = [];

  try {
    const res = await fetch("http://localhost:8085/api/articles");
    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }
    const data = await res.json();

    // Map the data
    articles = data.map((article: any) => ({
      id: article._id,
      title: article.title,
      author: article.author,
      journal_name: article.journal_name,
      published_year: article.published_year,
      volume_number: article.volume_number,
      pages: article.pages,
      publisher: article.publisher,
      DOI: article.doi,
      SE_practice: article.SE_practice,
      claim: article.claim,
      evidence: article.evidence,
      type_of_research: article.type_of_research,
      type_of_participant: article.type_of_participant,
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

export default Articles;
