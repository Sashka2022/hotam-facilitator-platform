export type Plenary = {
  title: string;
  description: string;
};

export type Material = {
  id: number;
  title: string;
  shareTitle: string;
  link: string;
  category: string;
  description: string;
  fileUrl: string | null;
  shareSlug: string;
  createdAt: string;
};
