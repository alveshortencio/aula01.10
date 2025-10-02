// Sistema de gerenciamento de loja virtual
class User {
    constructor(name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.createdAt = new Date();
    }

    getInfo() {
        return {
            name: this.name,
            email: this.email,
            age: this.age,
            createdAt: this.createdAt
        };
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

class Product {
    constructor(name, price, category) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.price = price;
        this.category = category;
        this.inStock = true;
    }

    applyDiscount(percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new Error('Porcentagem de desconto inválida');
        }
        this.price = this.price * (1 - percentage / 100);
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    addItem(product, quantity = 1) {
        this.items.push({ product, quantity });
        this.calculateTotal();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.calculateTotal();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);
    }

    checkout() {
        if (this.items.length === 0) {
            throw new Error('Carrinho vazio');
        }
        const order = {
            items: [...this.items],
            total: this.total,
            date: new Date()
        };
        this.items = [];
        this.total = 0;
        return order;
    }
}

const Utils = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    formatDate: (date) => {
        return new Intl.DateTimeFormat('pt-BR').format(date);
    },

    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }
};

const sampleProducts = [
    new Product('Notebook', 3500, 'Eletrônicos'),
    new Product('Smartphone', 2000, 'Eletrônicos'),
    new Product('Headphone', 300, 'Acessórios'),
    new Product('Mouse', 100, 'Acessórios')
];

function filterProductsByCategory(products, category) {
    return products.filter(product => product.category === category);
}

function sortProductsByPrice(products, ascending = true) {
    return [...products].sort((a, b) => {
        return ascending ? a.price - b.price : b.price - a.price;
    });
}

async function simulateAPICall(delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                timestamp: new Date(),
                data: sampleProducts
            });
        }, delay);
    });
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event]
                .filter(cb => cb !== callback);
        }
    }
}

// Exemplo de uso do código
async function main() {
    // Criando usuário
    const user = new User('João Silva', 'joao@email.com', 30);
    console.log('Informações do usuário:', user.getInfo());

    // Criando carrinho
    const cart = new ShoppingCart();

    // Adicionando produtos ao carrinho
    sampleProducts.forEach(product => {
        if (Math.random() > 0.5) {
            cart.addItem(product, Math.floor(Math.random() * 3) + 1);
        }
    });

    // Simulando chamada API
    const apiResponse = await simulateAPICall();
    console.log('Produtos da API:', apiResponse);

    // Criando event emitter
    const eventEmitter = new EventEmitter();
    eventEmitter.on('checkout', (orderData) => {
        console.log('Pedido realizado:', orderData);
        console.log('Total formatado:', Utils.formatCurrency(orderData.total));
    });

    // Finalizando compra
    const order = cart.checkout();
    eventEmitter.emit('checkout', order);
}

// Executar o programa
main().catch(console.error);