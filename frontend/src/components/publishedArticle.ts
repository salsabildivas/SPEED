export type PublishedArticle = {
    _id: string;
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
  };
  export const DefaultEmptyPublishedArticle: 
  PublishedArticle = {
    _id: "",
    title: "",
    author: "",
    journal_name: "",
    published_year: "",
    volume_number: "",
    pages: 0,
    publisher: "",
    DOI: "",
    SE_practice: "",
    claim: "",
    evidence: "",
    type_of_research: "",
    type_of_participant: "",
  };
  