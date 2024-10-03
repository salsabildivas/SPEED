import { GetStaticProps, NextPage } from "next";
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
  }

  type ArticlesProps = {
    articles: ArticlesInterface[];
  };
  
  const ModeratorArticles: NextPage<ArticlesProps> = ({ articles }) => {
    const headers: { key: keyof ArticlesInterface; label: string }[] = [
      { key: "title", label: "Title" },
      { key: "author", label: "Author" },
      { key: "journal_name", label: "Journal" },
      { key: "published_year", label: "Publication Year" },
      { key: "doi", label: "DOI" },
      { key: "status", label: "Status"},
    ];
  
    return (
      <div className="container">
        <h1>Moderator Articles Index Page</h1>
        <p>Page containing a table of articles:</p>
        <SortableTable headers={headers} data={articles} />
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
  
      // Map the data
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