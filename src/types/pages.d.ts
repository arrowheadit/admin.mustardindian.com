export type PageItem = {
        id: number,
        slug: string,
        title: string,
        status: string,    
    }
export type UpdatePageItem = {
    id: number,
    slug: string,
    title: string,
    status: string,    
}
export type CreatePageItem = {
    slug: string,
    title: string,
    status: string,    
}
export type PageSection = {
  id?: number;
  name?: string;
  page_id: number;
  title?: string;
  sub_title?: string;
  img_src?: string;
  img_alt?: string;
  img_width?: string;
  img_height?: string;
  img_instruction?: string;
  list_contents?: PageSectionContent[];
  content_contents?: PageSectionContent[];
  has_list?: boolean;
  has_content?: boolean;
  hide_element?: {
    form_hide?: string[];
    list_hide?: string[];
  };
};
export type PageSectionContent = {
  id?: number;
  page_id?: number;
  section_id?: number;
  name?: string;
  type?: "content" | "list";
  title?: string;
  sub_title?: string;
  link?: string;
  img_src?: string;
  img_alt?: string;
  img_width?: string;
  img_height?: string;
  img_instruction?: string;
  content?: string;
  hide_element?: {
    form_hide?: string[];
    list_hide?: string[];
  };
};
export type PageSectionNewContent = { 
  id?: number;
  section: string;
  section_type: "content" | "list";
  page_id: number;
  title?: string;
  sub_title?: string;
  img_url?: string;
  img_alt?: string;
  img_width?: number;
  img_height?: number;
  img_instruction?: string;
  content?: string;
};
export type PageSectionEditContent = {
  id?: number;
  page_id: number;
  title?: string;
  sub_title?: string;
  img_url?: string;
  img_alt?: string;
  img_width?: number;
  img_height?: number;
  img_instruction?: string;
  content?: string;
};
// export type PageSectionContent = {
//   title?: string,
//   content?: string,
//   list_text?: string[],
//   button?: {
//     text: string,
//     url?: string,
//   };
//   image?: {
//     url: string,
//     alt: string,
//   };
//   about_us?: {
//     image?: {
//       alt: string,
//     }
//   }
// }
