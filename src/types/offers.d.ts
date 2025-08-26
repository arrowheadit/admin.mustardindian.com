export type OfferItem = {
  id?: number; 
  name?: string;
  start_date?: Date;
  end_date?: Date;
  type?: "content" | "list";
  title?: string;
  sub_title?: string;
  link?: string;
  img_src?: string;
  img_alt?: string;
  content?: string;
  status: string;
  hide_element?: string[];
};
    
