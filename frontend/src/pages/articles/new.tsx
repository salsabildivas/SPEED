import { FormEvent, useState, ChangeEvent } from "react";
import formStyles from "../../styles/Form.module.scss";
import { SubmittedArticle, DefaultEmptySubmittedArticle } from "@/components/submittedArticle";
import { useRouter } from "next/router"; // Use Next.js router for navigation

const NewDiscussion = () => {
  const [article, setArticle] = useState<SubmittedArticle>({
    ...DefaultEmptySubmittedArticle,
    authors: [""],
  });
  const navigate = useRouter();

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  };

  const handleAuthorChange = (index: number, value: string) => {
    const updatedAuthors = [...article.authors];
    updatedAuthors[index] = value;
    setArticle({ ...article, authors: updatedAuthors });
  };

  const addAuthor = () => {
    setArticle({
      ...article,
      authors: [...article.authors, ""], 
    });
  };

  const removeAuthor = (index: number) => {
    const updatedAuthors = article.authors.filter((_, i) => i !== index);
    setArticle({ ...article, authors: updatedAuthors });
  };

  // Submit the form data to the server
  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const articleToSubmit = {
      title: article.title,
      author: article.authors.join(", "), // Convert array of authors to string
      journal_name: article.journal_name,
      description: article.description,
      published_year: article.published_year,
      volume_number: article.volume_number,
      pages: article.pages,
      doi: article.doi,
      status: "pending", // Set status to pending
      submitter: article.submitter,
    };
  
    console.log("Submitting article...", articleToSubmit);
    try {
      const response = await fetch("http://localhost:8085/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleToSubmit),
      });

      if (response.ok) {
        console.log("Article submitted successfully!");
        setArticle(DefaultEmptySubmittedArticle); // Reset the form
        navigate.push("/"); // Redirect to the homepage
      } else {
        console.error("Failed to submit article");
      }
    } catch (error) {
      console.error("An error occurred while submitting the article:", error);
    }
  };

  return (
    <div className="container">
      <h1>New Article</h1>
      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <label htmlFor="title">Title:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="title"
          id="title"
          value={article.title || ""}
          onChange={onChange}
          required
        />

        <label>Authors:</label>
        {article.authors.map((author, index) => (
          <div key={index} className={formStyles.authorRow}>
            <input
              className={formStyles.formItem}
              type="text"
              value={author}
              onChange={(e) => handleAuthorChange(index, e.target.value)}
              required
            />
            <button
              type="button"
              className={formStyles.buttonItem}
              onClick={() => removeAuthor(index)}
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAuthor}
          className={formStyles.buttonItem}
        >
          +
        </button>

        <label htmlFor="journal_name">Journal Name:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="journal_name"
          id="journal_name"
          value={article.journal_name || ""}
          onChange={onChange}
          required
        />

        <label htmlFor="published_year">Publication Year:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="published_year"
          id="published_year"
          value={article.published_year || ""}
          onChange={onChange}
        />

        <label htmlFor="doi">DOI:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="doi"
          id="doi"
          value={article.doi || ""}
          onChange={onChange}
        />

        <label htmlFor="description">Summary:</label>
        <textarea
          className={formStyles.formTextArea}
          name="description"
          value={article.description || ""}
          onChange={onChange}
        />

        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;
