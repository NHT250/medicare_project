const PAGE_SIZE = 6;
const REVENUE_STATUSES = new Set(["confirmed", "delivered"]);

const clone = (value) => JSON.parse(JSON.stringify(value));

const paginate = (collection, page = 1, perPage = PAGE_SIZE) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.max(1, Number(perPage) || PAGE_SIZE);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const items = collection.slice(start, end);

  return {
    items,
    page: currentPage,
    pages: Math.max(1, Math.ceil(collection.length / limit)),
    total: collection.length,
    limit,
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
    createdAt: "2024-05-06T08:00:00Z",
  },
  {
    _id: "user-001",
    name: "Minh Tran",
    email: "minh.tran@example.com",
    phone: "+84 912 555 101",
    role: "customer",
    is_banned: false,
    createdAt: "2024-05-05T09:15:00Z",
  },
  {
    _id: "user-002",
    name: "Lan Pham",
    email: "lan.pham@example.com",
    phone: "+84 988 123 456",
    role: "customer",
    is_banned: false,
    createdAt: "2024-05-04T11:30:00Z",
  },
  {
    _id: "user-003",
    name: "Hoang Le",
    email: "hoang.le@example.com",
    phone: "+84 934 777 321",
    role: "customer",
    is_banned: true,
    createdAt: "2024-05-03T14:45:00Z",
  },
  {
    _id: "user-004",
    name: "Thu Dang",
    email: "thu.dang@example.com",
    phone: "+84 901 246 810",
    role: "customer",
    is_banned: false,
    createdAt: "2024-05-02T10:20:00Z",
  },
  {
    _id: "user-005",
    name: "Quang Bui",
    email: "quang.bui@example.com",
    phone: "+84 965 112 233",
    role: "customer",
    is_banned: false,
    createdAt: "2024-05-01T07:55:00Z",
  },
];

const mockOrders = [
  {
    _id: "order-1001",
    orderId: "ORD-1001",
    userId: "user-001",
    customerName: "Minh Tran",
    subtotal: 53.8,
    shippingFee: 4.8,
    total: 58.6,
    status: "pending",
    createdAt: "2024-05-01T08:45:00Z",
    updatedAt: "2024-05-01T08:45:00Z",
    payment: { method: "Cash on Delivery", status: "Pending" },
    shipping: {
      fullName: "Minh Tran",
      email: "minh.tran@example.com",
      phone: "+84 912 555 101",
      address: "123 Nguyen Trai",
      city: "Ho Chi Minh City",
      state: "District 1",
      zipCode: "700000",
      country: "VN",
      note: "Giao giờ hành chính",
    },
    items: [
      {
        product_id: "prod-paracetamol",
        name: "Paracetamol Extra Strength",
        price: 4.75,
        quantity: 4,
        subtotal: 19.0,
      },
      {
        product_id: "prod-vitc",
        name: "Vitamin C Chewables",
        price: 9.9,
        quantity: 2,
        subtotal: 19.8,
      },
      {
        product_id: "prod-omep",
        name: "Omeprazole 20mg",
        price: 7.5,
        quantity: 2,
        subtotal: 15.0,
      },
    ],
    notes: "",
    activityLog: [
      {
        type: "status_change",
        status: "pending",
        message: "Order created",
        timestamp: "2024-05-01T08:45:00Z",
        actor: { id: "user-001", name: "Minh Tran" },
      },
    ],
  },
  {
    _id: "order-1002",
    orderId: "ORD-1002",
    userId: "user-002",
    customerName: "Lan Pham",
    subtotal: 135.8,
    shippingFee: 6.5,
    total: 142.3,
    status: "confirmed",
    createdAt: "2024-05-02T10:15:00Z",
    updatedAt: "2024-05-02T12:00:00Z",
    payment: { method: "Bank Transfer", status: "Paid" },
    shipping: {
      fullName: "Lan Pham",
      email: "lan.pham@example.com",
      phone: "+84 988 123 456",
      address: "45 Tran Phu",
      city: "Da Nang",
      state: "Hai Chau",
      zipCode: "550000",
      country: "VN",
      note: "Call before delivery",
    },
    items: [
      {
        product_id: "prod-insulin",
        name: "Insulin Pen",
        price: 38.0,
        quantity: 2,
        subtotal: 76.0,
      },
      {
        product_id: "prod-azithro",
        name: "Azithromycin 500mg",
        price: 12.5,
        quantity: 3,
        subtotal: 37.5,
      },
      {
        product_id: "prod-calcium",
        name: "Calcium + D3",
        price: 11.25,
        quantity: 2,
        subtotal: 22.5,
      },
    ],
    notes: "Ưu tiên đóng gói cẩn thận",
    activityLog: [
      {
        type: "status_change",
        status: "pending",
        message: "Order created",
        timestamp: "2024-05-02T10:15:00Z",
        actor: { id: "user-002", name: "Lan Pham" },
      },
      {
        type: "status_change",
        status: "confirmed",
        message: "Order confirmed",
        timestamp: "2024-05-02T12:00:00Z",
        actor: { id: "user-admin", name: "Sophia Nguyen" },
      },
    ],
  },
  {
    _id: "order-1003",
    orderId: "ORD-1003",
    userId: "user-003",
    customerName: "Hoang Le",
    subtotal: 17.4,
    shippingFee: 4.0,
    total: 21.4,
    status: "delivered",
    createdAt: "2024-05-03T13:30:00Z",
    updatedAt: "2024-05-04T09:00:00Z",
    payment: { method: "COD", status: "Paid" },
    shipping: {
      fullName: "Hoang Le",
      email: "hoang.le@example.com",
      phone: "+84 934 777 321",
      address: "89 Nguyen Hue",
      city: "Hue",
      state: "Hue",
      zipCode: "530000",
      country: "VN",
      note: "",
    },
    items: [
      {
        product_id: "prod-bandage",
        name: "Sterile Bandage Pack",
        price: 6.4,
        quantity: 2,
        subtotal: 12.8,
      },
      {
        product_id: "prod-paracetamol",
        name: "Paracetamol Extra Strength",
        price: 4.75,
        quantity: 1,
        subtotal: 4.75,
      },
    ],
    notes: "Giao buổi sáng",
    activityLog: [
      {
        type: "status_change",
        status: "pending",
        message: "Order created",
        timestamp: "2024-05-03T13:30:00Z",
        actor: { id: "user-003", name: "Hoang Le" },
      },
      {
        type: "status_change",
        status: "confirmed",
        message: "Order confirmed",
        timestamp: "2024-05-03T18:00:00Z",
        actor: { id: "user-admin", name: "Sophia Nguyen" },
      },
      {
        type: "status_change",
        status: "delivered",
        message: "Delivered to customer",
        timestamp: "2024-05-04T09:00:00Z",
        actor: { id: "user-admin", name: "Sophia Nguyen" },
      },
    ],
  },
  {
    _id: "order-1004",
    orderId: "ORD-1004",
    userId: "user-004",
    customerName: "Thu Dang",
    subtotal: 70.0,
    shippingFee: 5.0,
    total: 75.0,
    status: "pending",
    createdAt: "2024-05-04T09:10:00Z",
    updatedAt: "2024-05-04T09:10:00Z",
    payment: { method: "Credit Card", status: "Pending" },
    shipping: {
      fullName: "Thu Dang",
      email: "thu.dang@example.com",
      phone: "+84 901 246 810",
      address: "12 Ly Tu Trong",
      city: "Can Tho",
      state: "Ninh Kieu",
      zipCode: "900000",
      country: "VN",
      note: "",
    },
    items: [
      {
        product_id: "prod-calcium",
        name: "Calcium + D3",
        price: 11.25,
        quantity: 2,
        subtotal: 22.5,
      },
      {
        product_id: "prod-inhaler",
        name: "Albuterol Inhaler",
        price: 18.2,
        quantity: 2,
        subtotal: 36.4,
      },
      {
        product_id: "prod-omep",
        name: "Omeprazole 20mg",
        price: 7.5,
        quantity: 1,
        subtotal: 7.5,
      },
    ],
    notes: "Kiểm tra tồn kho lần nữa",
    activityLog: [
      {
        type: "status_change",
        status: "pending",
        message: "Order created",
        timestamp: "2024-05-04T09:10:00Z",
        actor: { id: "user-004", name: "Thu Dang" },
      },
    ],
  },
  {
    _id: "order-1005",
    orderId: "ORD-1005",
    userId: "user-005",
    customerName: "Quang Bui",
    subtotal: 209.0,
    shippingFee: 6.99,
    total: 215.99,
    status: "cancelled",
    createdAt: "2024-05-05T16:55:00Z",
    updatedAt: "2024-05-05T18:30:00Z",
    payment: { method: "Credit Card", status: "Refunded" },
    shipping: {
      fullName: "Quang Bui",
      email: "quang.bui@example.com",
      phone: "+84 965 112 233",
      address: "88 Pho Hue",
      city: "Ha Noi",
      state: "Hai Ba Trung",
      zipCode: "100000",
      country: "VN",
      note: "",
    },
    items: [
      {
        product_id: "prod-insulin",
        name: "Insulin Pen",
        price: 38.0,
        quantity: 3,
        subtotal: 114.0,
      },
      {
        product_id: "prod-azithro",
        name: "Azithromycin 500mg",
        price: 12.5,
        quantity: 4,
        subtotal: 50.0,
      },
      {
        product_id: "prod-calcium",
        name: "Calcium + D3",
        price: 11.25,
        quantity: 4,
        subtotal: 45.0,
      },
    ],
    notes: "Khách huỷ vì đổi địa chỉ",
    activityLog: [
      {
        type: "status_change",
        status: "pending",
        message: "Order created",
        timestamp: "2024-05-05T16:55:00Z",
        actor: { id: "user-005", name: "Quang Bui" },
      },
      {
        type: "status_change",
        status: "cancelled",
        message: "Order cancelled per customer request",
        timestamp: "2024-05-05T18:30:00Z",
        actor: { id: "user-admin", name: "Sophia Nguyen" },
      },
    ],
  },
  {
    _id: "order-1006",
    orderId: "ORD-1006",
    userId: "user-001",
    customerName: "Minh Tran",
    subtotal: 30.0,
    shippingFee: 5.2,
    total: 35.2,
    status: "delivered",
    createdAt: "2024-05-06T14:05:00Z",
    updatedAt: "2024-05-07T08:20:00Z",
    payment: { method: "COD", status: "Paid" },
    shipping: {
      fullName: "Minh Tran",
      email: "minh.tran@example.com",
      phone: "+84 912 555 101",
      address: "123 Nguyen Trai",
      city: "Ho Chi Minh City",
      state: "District 1",
      zipCode: "700000",
      country: "VN",
      note: "Giao buổi chiều",
    },
    items: [
      {
        product_id: "prod-vitc",
        name: "Vitamin C Chewables",
        price: 9.9,
        quantity: 2,
        subtotal: 19.8,
      },
      {
        product_id: "prod-paracetamol",
        name: "Paracetamol Extra Strength",
        price: 4.75,
        quantity: 2,
        subtotal: 9.5,
      },
      {
        product_id: "prod-omep",
        name: "Omeprazole 20mg",
        price: 7.5,
        quantity: 0,
        subtotal: 0,
      },
    ],
    notes: "Customer satisfied",
    activityLog: [
      {
        type: "status_change",
        status: "pending",
        message: "Order created",
        timestamp: "2024-05-06T14:05:00Z",
        actor: { id: "user-001", name: "Minh Tran" },
      },
      {
        type: "status_change",
        status: "confirmed",
        message: "Order confirmed",
        timestamp: "2024-05-06T16:10:00Z",
        actor: { id: "user-admin", name: "Sophia Nguyen" },
      },
      {
        type: "status_change",
        status: "delivered",
        message: "Delivered to customer",
        timestamp: "2024-05-07T08:20:00Z",
        actor: { id: "user-admin", name: "Sophia Nguyen" },
      },
    ],
  },
];

const findProduct = (id) => mockProducts.find((item) => item._id === id);
const findOrder = (id) =>
  mockOrders.find((item) => item._id === id || item.orderId === id);
const findUser = (id) => mockUsers.find((item) => item._id === id);

const simulateNetwork = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(clone(payload)), 250));

const normalizeStatus = (status) => {
  if (!status) {
    return "Pending";
  }
  const text = String(status).toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const mapShipping = (shipping = {}) => ({
  full_name: shipping.full_name || shipping.fullName || shipping.recipient || null,
  phone: shipping.phone || null,
  email: shipping.email || null,
  address: shipping.address || null,
  city: shipping.city || null,
  state: shipping.state || null,
  zip: shipping.zip || shipping.zip_code || shipping.zipCode || null,
  country: shipping.country || null,
  note: shipping.note || shipping.instructions || null,
});

const mapPayment = (payment = {}) => ({
  method: payment.method || null,
  status: payment.status || payment.state || null,
  transaction_id: payment.transaction_id || payment.transactionId || null,
});

const mapItems = (items = []) =>
  items.map((item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);
    const subtotal =
      item.subtotal !== undefined && item.subtotal !== null
        ? Number(item.subtotal)
        : price * quantity;
    return {
      product_id: item.product_id || item.productId || item._id || null,
      name: item.name || item.title || "Unknown item",
      image: item.image || item.thumbnail || null,
      price,
      quantity,
      subtotal,
    };
  });

const buildOrderSummary = (order) => {
  const user = findUser(order.userId) || {};
  const shipping = order.shipping || {};
  const customerName =
    shipping.fullName ||
    shipping.full_name ||
    order.customerName ||
    user.name ||
    user.email ||
    "Unknown";
  const email = shipping.email || user.email || null;

  return {
    id: order._id,
    order_number: order.orderId || order.order_number || order._id,
    customer_name: customerName,
    email,
    total: Number(order.total || 0),
    status: normalizeStatus(order.status),
    payment_method: order.payment?.method || null,
    created_at: order.createdAt,
    updated_at: order.updatedAt || order.createdAt,
  };
};

const buildOrderDetail = (order) => {
  const user = findUser(order.userId);
  const activityLog = [...(order.activityLog || [])]
    .map((entry) => ({
      type: entry.type || "status_change",
      status: normalizeStatus(entry.status),
      message: entry.message || null,
      actor: entry.actor || null,
      timestamp: entry.timestamp || order.updatedAt || order.createdAt,
    }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    id: order._id,
    order_number: order.orderId || order.order_number || order._id,
    customer: user
      ? {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
        }
      : null,
    items: mapItems(order.items || []),
    shipping: mapShipping(order.shipping || {}),
    payment: mapPayment(order.payment || {}),
    status: normalizeStatus(order.status),
    subtotal: Number(
      order.subtotal ?? order.subTotal ?? order.total ?? 0
    ),
    shipping_fee: Number(order.shippingFee ?? order.shipping_fee ?? 0),
    total: Number(order.total || 0),
    notes: order.notes || "",
    created_at: order.createdAt,
    updated_at: order.updatedAt || order.createdAt,
    activity_log: activityLog,
  };
};

const ensureActivityLog = (order) => {
  if (!Array.isArray(order.activityLog)) {
    order.activityLog = [];
  }
  return order.activityLog;
};

const calculateDashboardSummary = () => {
  const totalRevenue = mockOrders
    .filter((order) => REVENUE_STATUSES.has((order.status || "").toLowerCase()))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const activeProducts = mockProducts.filter((product) => {
    const isActive = product.is_active !== false;
    const stock = Number(product.stock || 0);
    return isActive || stock > 0;
  }).length;

  return {
    total_users: mockUsers.length,
    total_orders: mockOrders.length,
    total_revenue: Number(totalRevenue.toFixed(2)),
    active_products: activeProducts,
  };
};

const buildRecentOrders = () => {
  return [...mockOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((order) => {
      const summary = buildOrderSummary(order);
      return {
        id: summary.id,
        order_id: summary.order_number,
        customer_name: summary.customer_name,
        total: summary.total,
        status: summary.status,
        created_at: summary.created_at,
      };
    });
};

const buildRecentUsers = () => {
  return [...mockUsers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    }));
};

const parseRangeDays = (range = "7d") => {
  if (typeof range === "string") {
    const match = range.match(/^(\d+)d$/i);
    if (match) {
      return Math.max(parseInt(match[1], 10), 1);
    }
  }
  return 7;
};

const buildRevenueSeries = (range = "7d") => {
  const days = parseRangeDays(range);
  const grouped = new Map();

  mockOrders.forEach((order) => {
    if (!REVENUE_STATUSES.has((order.status || "").toLowerCase())) {
      return;
    }
    if (!order.createdAt) {
      return;
    }
    const dayKey = order.createdAt.slice(0, 10);
    const stats = grouped.get(dayKey) || { revenue: 0, orders: 0 };
    stats.revenue += Number(order.total || 0);
    stats.orders += 1;
    grouped.set(dayKey, stats);
  });

  const sortedDays = Array.from(grouped.keys()).sort();
  const selectedDays = sortedDays.slice(-days);

  return selectedDays.map((day) => {
    const stats = grouped.get(day) || { revenue: 0, orders: 0 };
    return {
      date: day,
      revenue: Number(stats.revenue.toFixed(2)),
      orders: stats.orders,
    };
  });
};

export const mockAdminAPI = {
  getDashboard: async () => simulateNetwork(calculateDashboardSummary()),
  getDashboardSummary: async () => simulateNetwork(calculateDashboardSummary()),
  getRecentOrders: async () => simulateNetwork(buildRecentOrders()),
  getRecentUsers: async () => simulateNetwork(buildRecentUsers()),
  getRevenueSeries: async (range = "7d") =>
    simulateNetwork(buildRevenueSeries(range)),
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
  listOrders: async ({ page = 1, limit = PAGE_SIZE, q = "", status = "" } = {}) => {
    const normalizedStatus = String(status || "").trim().toLowerCase();
    const normalizedQuery = String(q || "").trim().toLowerCase();

    const filtered = mockOrders.filter((order) => {
      if (
        normalizedStatus &&
        (order.status || "").toLowerCase() !== normalizedStatus
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const shipping = order.shipping || {};
      const user = findUser(order.userId) || {};
      const haystack = [
        order.orderId,
        order._id,
        order.customerName,
        shipping.fullName,
        shipping.full_name,
        shipping.email,
        user.name,
        user.email,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return haystack.some((value) => value.includes(normalizedQuery));
    });

    const pagination = paginate(filtered, page, limit);
    return simulateNetwork({
      items: pagination.items.map(buildOrderSummary),
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
    });
  },
  getOrderDetail: async (id) => {
    const order = findOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return simulateNetwork(buildOrderDetail(order));
  },
  updateOrderStatus: async (id, status) => {
    const order = findOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }
    const normalized = normalizeStatus(status);
    const storedStatus = normalized.toLowerCase();
    order.status = storedStatus;
    order.updatedAt = new Date().toISOString();
    ensureActivityLog(order).push({
      type: "status_change",
      status: storedStatus,
      message: `Status updated to ${normalized}`,
      timestamp: order.updatedAt,
      actor: { id: "user-admin", name: "Mock Admin" },
    });
    return simulateNetwork(buildOrderDetail(order));
  },
  updateOrder: async (id, payload = {}) => {
    const order = findOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    const changedFields = [];
    if (payload.notes !== undefined) {
      order.notes = payload.notes || "";
      changedFields.push("notes");
    }
    if (payload.shipping) {
      order.shipping = { ...(order.shipping || {}), ...payload.shipping };
      changedFields.push("shipping");
    }
    if (payload.payment) {
      order.payment = { ...(order.payment || {}), ...payload.payment };
      changedFields.push("payment");
    }

    order.updatedAt = new Date().toISOString();
    if (changedFields.length) {
      ensureActivityLog(order).push({
        type: "update",
        message: "Updated order details",
        fields: changedFields,
        timestamp: order.updatedAt,
        actor: { id: "user-admin", name: "Mock Admin" },
      });
    }

    return simulateNetwork(buildOrderDetail(order));
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
