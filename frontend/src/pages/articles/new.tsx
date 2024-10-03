import { FormEvent, useState, ChangeEvent } from "react";
import formStyles from "../../styles/Form.module.scss";
import { SubmittedArticle, DefaultEmptySubmittedArticle } from "@/components/submittedArticle";
import { useRouter } from "next/router"; // Use Next.js router for navigation

const NewDiscussion = () => {
  const [article, setArticle] = useState<SubmittedArticle>({
    ...DefaultEmptySubmittedArticle,
    authors: [""],
  });
  const [errors, setErrors] = useState<string[]>([]); // Store validation errors
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

  // Validation function
  const validateForm = (): boolean => {
    const validationErrors: string[] = [];

    if (!article.title?.trim()) {
      validationErrors.push("Title is required.");
    }

    if (!article.journal_name?.trim()) {
      validationErrors.push("Journal name is required.");
    }

    const validYear = article.published_year && /^[12][0-9]{3}$/.test(article.published_year);
    if (!validYear) {
      validationErrors.push("Please provide a valid publication year.");
    }

    if (article.authors.some(author => !author.trim())) {
      validationErrors.push("All author fields must be filled.");
    }

    if (article.doi && !/^(https:\/\/doi\.org\/)?10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i.test(article.doi)) {
      validationErrors.push("DOI must be a valid format.");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  // Submit the form data to the server
  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Call the validation function before submitting
    if (!validateForm()) {
      console.log("Form validation failed. Submission prevented.");
      return; // Prevent submission if validation fails
    }
  
    const articleToSubmit = {
      title: article.title,
      author: article.authors.join(", "), // Convert array of authors to string
      journal_name: article.journal_name,
      description: article.description,
      published_year: article.published_year,
      volume_number: article.volume_number,
      pages: article.pages,
      doi: article.doi,
      status: "awaiting moderation", // Set status to awaiting moderation
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

      {errors.length > 0 && (
        <div className={formStyles.errorMessages}>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

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

        <label htmlFor="volume_number">Volume:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="volume_number"
          id="volume_number"
          value={article.volume_number || ""}
          onChange={onChange}
        />

        <label htmlFor="pages">Pages:</label>
        <input
          className={formStyles.formItem}
          type="number"
          name="pages"
          id="pages"
          value={article.pages || NaN}
          onChange={onChange}
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
