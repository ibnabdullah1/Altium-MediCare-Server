# Altium Medicare Backend

This is the backend for the **Altium Medicare E-commerce Platform**, providing a robust API for authentication, user management, product management, order processing, and other core functionalities. It is built with **Node.js** and **Express.js** and uses **PostgreSQL** as the primary database, ensuring high scalability and security.

## Features

1. **User Authentication and Authorization**
   - JWT-based secure authentication.
   - Role-based access control for Admin, Vendor, and Customer.
2. **Vendor Management**
   - Vendors can manage their shops, including products, inventory, and orders.
   - CRUD operations for product management.
3. **Product Management**
   - Add, edit, delete, and list products with attributes such as price, category, and stock.
   - Dynamic category management.
4. **Order Management**
   - Vendors can view order history for their products.
   - Customers can view and manage their purchase history.
5. **Cart and Checkout**
   - Cart operations: add, remove, and update items.
   - Apply coupons during checkout.
   - Integration with payment gateways like Stripe or Aamarpay.
6. **Admin Panel**
   - Monitor user activities and transactions.
   - Manage categories, vendors, and products dynamically.
   - Review reports and perform moderation tasks.
7. **Search and Filtering**
   - Advanced filtering by price, category, and keywords.
   - Pagination for scalable product and order listings.
8. **Image Upload and Storage**
   - Cloud-based image storage (e.g., Cloudinary).
9. **Notification System**
   - Email-based notifications for order updates.
10. **Analytics and Reports**
    - Real-time analytics for vendor and admin dashboards.

## Tech Stack

### Backend Technologies

- **Node.js**: JavaScript runtime for scalable backend development.
- **Express.js**: Lightweight and fast web framework for building REST APIs.
- **TypeScript**: Static typing for enhanced developer productivity and error handling.

### Database

- **PostgreSQL**: Relational database for structured and scalable data management.
- **Prisma**: ORM for efficient database operations and migrations.

### Authentication

- **JWT (JSON Web Tokens)**: Secure authentication mechanism.
- **bcrypt**: Password hashing for user data security.

### Middleware and Utilities

- **Multer**: For handling file uploads.
- **Cors**: Cross-Origin Resource Sharing configuration.
- **Node-cron**: Task scheduling for automated processes.

### Dev Tools

- **TypeScript**: Ensures code quality and maintainability.
- **TS-Node-Dev**: Development server with hot-reloading.
- **Luxon**: Date and time handling.

### Integrations

- **Stripe**: Secure and flexible payment gateway.
- **Nodemailer**: Email service for notifications and communication.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/altium-medicare-backend.git
   cd altium-medicare-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user or vendor.
- `POST /api/auth/login`: Authenticate a user and return a JWT.
- `POST /api/auth/forgot-password`: Send a password reset email.
- `POST /api/auth/reset-password`: Reset user password.

### Products

- `GET /api/products`: Fetch all products.
- `POST /api/products`: Add a new product (Vendor/Admin only).
- `PATCH /api/products/:id`: Update product details (Vendor/Admin only).
- `DELETE /api/products/:id`: Delete a product (Vendor/Admin only).

### Orders

- `GET /api/orders`: Fetch all orders (Admin/Vendor).
- `POST /api/orders`: Create a new order (Customer).

### Categories

- `GET /api/categories`: Fetch all categories.
- `POST /api/categories`: Add a new category (Admin only).
- `PATCH /api/categories/:id`: Update category details (Admin only).
- `DELETE /api/categories/:id`: Delete a category (Admin only).

### Cart

- `GET /api/cart`: Fetch the current cart.
- `POST /api/cart`: Add an item to the cart.
- `DELETE /api/cart/:id`: Remove an item from the cart.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
