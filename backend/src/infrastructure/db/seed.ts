import { db } from './index.js';
import { products, users } from './schema.js';

const mockProducts = [
    {
        title: 'Homemade Special Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=500&q=60',
        price: 15.99,
        isVeg: false,
        description: 'Traditional slow-cooked homemade biryani with aromatic spices.',
        category: 'Main Course',
        isSpecial: true,
        origin: 'Homemade',
        ingredients: JSON.stringify(['Basmati Rice', 'Chicken', 'Spices', 'Saffron']),
        tags: JSON.stringify(['Bestseller', 'Authentic'])
    },
    {
        title: 'Farm Fresh Organic Salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60',
        price: 12.99,
        isVeg: true,
        description: 'Crispy salad ingredients sourced directly from local organic farms.',
        category: 'Salads',
        origin: 'Farm',
        ingredients: JSON.stringify(['Kale', 'Spinach', 'Cherry Tomatoes', 'Vinaigrette']),
        tags: JSON.stringify(['Organic', 'Vegan'])
    },
    {
        title: 'Farm Fresh Mango Pulp',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=60',
        price: 5.50,
        isVeg: true,
        description: 'Pure, unsweetened alphonso mangoes picked at peak ripeness.',
        category: 'Beverages',
        isSpecial: true,
        origin: 'Farm',
        ingredients: JSON.stringify(['Alphonso Mango']),
        tags: JSON.stringify(['Seasonal', 'Pure'])
    },
    {
        title: 'Homemade Garlic Pickle',
        image: 'https://images.unsplash.com/photo-1589135325255-a28f80424565?auto=format&fit=crop&w=500&q=60',
        price: 6.50,
        isVeg: true,
        description: 'Traditional Grandma\'s recipe garlic pickle made in small batches.',
        category: 'sides',
        origin: 'Homemade',
        ingredients: JSON.stringify(['Garlic', 'Mustard Oil', 'Ground Spices']),
        tags: JSON.stringify(['Spicy'])
    },
    {
        title: 'Today\'s Special: Paneer Tikka',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=60',
        price: 11.99,
        isVeg: true,
        description: 'Smoky grilled paneer tikka with mint chutney.',
        category: 'Starters',
        isSpecial: true,
        origin: 'Homemade',
        ingredients: JSON.stringify(['Cottage Cheese', 'Yogurt', 'Capsicum', 'Onion']),
        tags: JSON.stringify(['Spicy', 'Grilled'])
    },
    {
        title: 'Standard Club Sandwich',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=60',
        price: 9.99,
        isVeg: false,
        description: 'Classic triple-decker club sandwich.',
        category: 'Sandwiches',
        origin: 'Standard',
        ingredients: JSON.stringify(['Bread', 'Turkey', 'Bacon', 'Lettuce', 'Mayo']),
        tags: JSON.stringify([])
    },
    {
        title: 'Farm Fresh Honey',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=60',
        price: 14.00,
        isVeg: true,
        description: 'Unprocessed, raw honey from local beehives.',
        category: 'Essentials',
        origin: 'Farm',
        ingredients: JSON.stringify(['Raw Wildflower Honey']),
        tags: JSON.stringify(['Pure', 'Superfood'])
    },
    {
        title: 'Homemade Chocolate Cookies',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=60',
        price: 7.50,
        isVeg: true,
        description: 'Oversized, chewy chocolate chip cookies baked fresh every morning.',
        category: 'Bakery',
        origin: 'Homemade',
        ingredients: JSON.stringify(['Dark Chocolate', 'Butter', 'Flour', 'Brown Sugar']),
        tags: JSON.stringify(['Sweet', 'Bestseller'])
    }
];

async function seed() {
    console.log('Seeding products...');

    // Ensure dev user exists for orders
    await db.insert(users).values({
        id: 'dev-user-id',
        phone: '1234567890',
        role: 'admin'
    }).onConflictDoUpdate({
        target: users.id,
        set: { role: 'admin' }
    });

    // Idempotent seeding using onConflictDoUpdate
    for (const prod of mockProducts) {
        await db.insert(products).values(prod as any).onConflictDoUpdate({
            target: products.title,
            set: prod as any
        });
    }
    console.log('Seed complete!');
}

seed().catch(console.error);
