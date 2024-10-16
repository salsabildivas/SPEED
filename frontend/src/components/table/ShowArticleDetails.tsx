"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DefaultEmptyPublishedArticle, PublishedArticle } from "../publishedArticle";
import Link from "next/link";

function ShowArticleDetails() {
  const [article, setArticle] = useState<PublishedArticle>(DefaultEmptyPublishedArticle);
  const id = useParams<{ id: string }>().id;
  const navigate = useRouter();
  useEffect(() => {
    fetch(`http://localhost:8085/api/articles/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setArticle(json);
      })
      .catch((err) => {
        console.log("Error from ShowArticleDetails: " + err);
      });
  }, [id]);
  const BookItem = (
    <div>
      <table className="table table-hover table-dark table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Title</td>
            <td>{article.title}</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Author</td>
            <td>{article.author}</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Journal Name</td>
            <td>{article.journal_name}</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>Published Year</td>
            <td>{article.published_year}</td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>Volume number</td>
            <td>{article.volume_number}</td>
          </tr>
          <tr>
            <th scope="row">6</th>
            <td>Publisher</td>
            <td>{article.publisher}</td>
          </tr>
          <tr>
            <th scope="row">7</th>
            <td>DOI</td>
            <td>{article.doi}</td>
          </tr>
          <tr>
            <th scope="row">8</th>
            <td>SE Practice</td>
            <td>{article.SE_practice}</td>
          </tr>
          <tr>
            <th scope="row">9</th>
            <td>Claim</td>
            <td>{article.claim}</td>
          </tr>
          <tr>
            <th scope="row">10</th>
            <td>Evidence</td>
            <td>{article.evidence}</td>
          </tr>
          <tr>
            <th scope="row">11</th>
            <td>Type of Research</td>
            <td>{article.type_of_research}</td>
          </tr>
          <tr>
            <th scope="row">12</th>
            <td>Type of Participant</td>
            <td>{article.type_of_participant}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="ShowArticleDetails">
      <div className="container">
        <div className="row">
          <div className="col-md-10 m-auto">
            <br /> <br />
            <Link href="/articles" className="btn btn-outline-warning float-left">
              Return
            </Link>
          </div>
          <br />
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Article&quot;s Record</h1>
            <p className="lead text-center">Article's Rating</p>
            <div className="col-md-10 m-auto">"Rating"</div>
            <hr /> <br />
          </div>
          <div className="col-md-10 m-auto">{BookItem}</div>
          <div className="col-md-6 m-auto">
          </div>
        </div>
      </div>
    </div>
  );
}
export default ShowArticleDetails;
