// data/products.js

// Kolayca kullanabilmek için bir kategori listesi oluşturuyoruz.
export const CATEGORIES = ['Tümü', 'Çanta', 'Takı', 'Fular'];

export const PRODUCTS = [
    {
        id: '1',
        name: 'Hand-Knitted Tote Bag',
        price: '250 TL',
        description: 'A beautiful and durable tote bag, hand-knitted with high-quality yarn. Perfect for daily use.',
        image: 'https://picsum.photos/seed/bag/400/400',
        category: 'Çanta', // Kategori bilgisi eklendi
    },
    {
        id: '2',
        name: 'Bohemian Tassel Necklace',
        price: '120 TL',
        description: 'Add a touch of boho-chic to your style with this unique, handmade tassel necklace.',
        image: 'https://picsum.photos/seed/necklace/400/400',
        category: 'Takı', // Kategori bilgisi eklendi
    },
    {
        id: '3',
        name: 'El Örgüsü Omuz Çantası',
        price: '350 TL',
        description: 'An elegant, handmade table runner with a delicate lace pattern. A perfect centerpiece.',
        image: 'https://picsum.photos/seed/bag2/400/400',
        category: 'Çanta', // Kategori bilgisi eklendi
    },
    {
        id: '4',
        name: 'Silk Floral Scarf (Fular)',
        price: '150 TL',
        description: 'A lightweight and soft silk scarf with a beautiful floral print. Versatile and stylish.',
        image: 'https://picsum.photos/seed/scarf/400/400',
        category: 'Fular', // Kategori bilgisi eklendi
    },
    {
        id: '5',
        name: 'Gümüş Hayat Ağacı Kolye',
        price: '450 TL',
        description: '925 ayar gümüş, el işçiliği hayat ağacı kolye.',
        image: 'https://picsum.photos/seed/necklace2/400/400',
        category: 'Takı', // Kategori bilgisi eklendi
    }
];

export const USER = {
    name: 'Dilara',
    email: 'dilara@email.com',
    profileImage: 'https://i.pravatar.cc/150?u=dilara'
};