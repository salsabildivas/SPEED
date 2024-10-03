export type SubmittedArticle = {
  _id?: string;
  title?: string;
  authors: string[];
  journal_name?: string;
  description?: string;
  published_year?: string;
  volume_number?: string;
  pages?: number;
  doi?: string;
  status?: string;
  submitter?: string;
};
export const DefaultEmptySubmittedArticle: SubmittedArticle = {
  _id: undefined,
  title: "",
  authors: [""],
  journal_name: "",
  description: "",
  published_year: "",
  volume_number: "",
  pages: undefined,
  doi: "",
  status: "pending",
  submitter: undefined,
};
