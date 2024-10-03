export class CreateSubmittedDto {
  title: string;
  author: string;
  journal_name: string;
  description?: string;
  published_year?: string;
  volume_number?: string;
  pages?: number;
  doi?: string;
  status: string;
  submitter?: string;
}
/*Title, authors, journal name, year of publication, volume, number, pages, DOI, status */
