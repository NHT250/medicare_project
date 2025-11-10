const PAGE_SIZE = 6;

const clone = (value) => JSON.parse(JSON.stringify(value));

const paginate = (collection, page = 1) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const items = collection.slice(start, end);

  return {
    items,
    page: currentPage,
    pages: Math.max(1, Math.ceil(collection.length / PAGE_SIZE)),
    total: collection.length,
  };
};

const mockProducts = [
  {
    _id: "prod-azithro",
    name: "Azithromycin 500mg",
    category: "Antibiotics",
    price: 12.5,
    stock: 320,
    description: "Broad-spectrum antibiotic for bacterial infections.",
  },
  {
    _id: "prod-paracetamol",
    name: "Paracetamol Extra Strength",
    category: "Pain Relief",
    price: 4.75,
    stock: 870,
    description: "Fast-acting relief for headaches and fever.",
  },
  {
    _id: "prod-vitc",
    name: "Vitamin C Chewables",
    category: "Supplements",
    price: 9.9,
    stock: 450,
    description: "Immune support with 1000mg vitamin C.",
  },
  {
    _id: "prod-insulin",
    name: "Insulin Pen",
    category: "Diabetes Care",
    price: 38.0,
    stock: 120,
    description: "Pre-filled insulin pen for daily use.",
  },
  {
    _id: "prod-omep",
    name: "Omeprazole 20mg",
    category: "Digestive Health",
    price: 7.5,
    stock: 210,
    description: "Proton pump inhibitor to reduce stomach acid.",
  },
  {
    _id: "prod-inhaler",
    name: "Albuterol Inhaler",
    category: "Respiratory",
    price: 18.2,
    stock: 75,
    description: "Rescue inhaler for asthma relief.",
  },
  {
    _id: "prod-calcium",
    name: "Calcium + D3",
    category: "Supplements",
    price: 11.25,
    stock: 540,
    description: "Bone health formula with vitamin D3.",
  },
  {
    _id: "prod-bandage",
    name: "Sterile Bandage Pack",
    category: "First Aid",
    price: 6.4,
    stock: 1025,
    description: "Assorted sterile bandages for minor cuts.",
  },
];

const mockUsers = [
  {
    _id: "user-admin",
    name: "Sophia Nguyen",
    email: "admin@medicare.com",
    phone: "+84 912 345 678",
    role: "admin",
    is_banned: false,
  },
  {
    _id: "user-001",
    name: "Minh Tran",
    email: "minh.tran@example.com",
    phone: "+84 912 555 101",
    role: "customer",
    is_banned: false,
  },
  {
    _id: "user-002",
    name: "Lan Pham",
    email: "lan.pham@example.com",
    phone: "+84 988 123 456",
    role: "customer",
    is_banned: false,
  },
  {
    _id: "user-003",
    name: "Hoang Le",
    email: "hoang.le@example.com",
    phone: "+84 934 777 321",
    role: "customer",
    is_banned: true,
  },
  {
    _id: "user-004",
    name: "Thu Dang",
    email: "thu.dang@example.com",
    phone: "+84 901 246 810",
    role: "customer",
    is_banned: false,
  },
  {
    _id: "user-005",
    name: "Quang Bui",
    email: "quang.bui@example.com",
    phone: "+84 965 112 233",
    role: "customer",
    is_banned: false,
  },
];

const mockOrders = [
  {
    _id: "order-1001",
    orderId: "ORD-1001",
    userId: "Minh Tran",
    total: 58.6,
    status: "pending",
    createdAt: "2024-05-01T08:45:00Z",
  },
  {
    _id: "order-1002",
    orderId: "ORD-1002",
    userId: "Lan Pham",
    total: 142.3,
    status: "confirmed",
    createdAt: "2024-05-02T10:15:00Z",
  },
  {
    _id: "order-1003",
    orderId: "ORD-1003",
    userId: "Hoang Le",
    total: 21.4,
    status: "delivered",
    createdAt: "2024-05-03T13:30:00Z",
  },
  {
    _id: "order-1004",
    orderId: "ORD-1004",
    userId: "Thu Dang",
    total: 75.0,
    status: "pending",
    createdAt: "2024-05-04T09:10:00Z",
  },
  {
    _id: "order-1005",
    orderId: "ORD-1005",
    userId: "Quang Bui",
    total: 215.99,
    status: "cancelled",
    createdAt: "2024-05-05T16:55:00Z",
  },
  {
    _id: "order-1006",
    orderId: "ORD-1006",
    userId: "Minh Tran",
    total: 35.2,
    status: "delivered",
    createdAt: "2024-05-06T14:05:00Z",
  },
];

const findProduct = (id) => mockProducts.find((item) => item._id === id);
const findOrder = (id) => mockOrders.find((item) => item._id === id);
const findUser = (id) => mockUsers.find((item) => item._id === id);

const simulateNetwork = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(clone(payload)), 250));

export const mockAdminAPI = {
  getDashboard: async () => {
    const totalRevenue = mockOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    return simulateNetwork({
      total_users: mockUsers.length,
      total_orders: mockOrders.length,
      total_revenue: Number(totalRevenue.toFixed(2)),
    });
  },
  listProducts: async ({ page = 1, search = "" } = {}) => {
    const normalizedQuery = search.trim().toLowerCase();
    const filtered = normalizedQuery
      ? mockProducts.filter((product) =>
          [product.name, product.category]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : mockProducts;

    return simulateNetwork(paginate(filtered, page));
  },
  getProduct: async (id) => {
    const product = findProduct(id);
    if (!product) {
      throw new Error("Product not found");
    }

    return simulateNetwork({ product });
  },
  createProduct: async (payload) => {
    const newProduct = {
      _id: `prod-${Date.now()}`,
      stock: 0,
      ...payload,
    };
    mockProducts.unshift(newProduct);
    return simulateNetwork({
      message: "Product created (mock)",
      product: newProduct,
    });
  },
  updateProduct: async (id, payload) => {
    const product = findProduct(id);
    if (!product) {
      throw new Error("Product not found");
    }
    Object.assign(product, payload);
    return simulateNetwork({
      message: "Product updated (mock)",
      product,
    });
  },
  deleteProduct: async (id) => {
    const index = mockProducts.findIndex((item) => item._id === id);
    if (index >= 0) {
      mockProducts.splice(index, 1);
    }
    return simulateNetwork({ message: "Product deleted (mock)" });
  },
  listOrders: async ({ page = 1, status = "" } = {}) => {
    const normalizedStatus = status.trim().toLowerCase();
    const filtered = normalizedStatus
      ? mockOrders.filter((order) => order.status === normalizedStatus)
      : mockOrders;

    return simulateNetwork(paginate(filtered, page));
  },
  updateOrderStatus: async (id, status) => {
    const order = findOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    return simulateNetwork({
      message: "Order status updated (mock)",
      order,
    });
  },
  listUsers: async ({ page = 1, search = "" } = {}) => {
    const normalizedQuery = search.trim().toLowerCase();
    const filtered = normalizedQuery
      ? mockUsers.filter((user) =>
          [user.name, user.email, user.phone]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : mockUsers;

    return simulateNetwork(paginate(filtered, page));
  },
  toggleUserBan: async (id, action) => {
    const user = findUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (action === "ban") {
      user.is_banned = true;
    }
    if (action === "unban") {
      user.is_banned = false;
    }
    return simulateNetwork({
      message:
        action === "ban" ? "User banned (mock)" : "User unbanned (mock)",
      user,
    });
  },
};

export default mockAdminAPI;
