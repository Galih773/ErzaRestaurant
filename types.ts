export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'makanan' | 'minuman' | 'snack';
  calories?: number;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
