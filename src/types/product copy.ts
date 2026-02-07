export type Product = {
  image:string;
  imageName: string;
  product_id: number;

  user_id: number;
  price: number;
  name: string;
  category: string;
  description: string;
  sold: number,
  profit: number,
  business_id: string;
  created_at: string; // ISO date string
  id: string;
  partialPayment:string;
};

export type ProductInsert = {
  price: number;
  name: string;
  category: string;
  description: string;
  business_id: string;
  int_business_id: number;
};