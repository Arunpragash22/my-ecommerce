# My E-Commerce Store

A full-stack online store with product browsing, shopping cart, checkout, admin dashboard, and WhatsApp order notifications.

## Live URLs

| Service   | URL |
|-----------|-----|
| Frontend  | https://my-ecommerce-fawn-ten.vercel.app |
| Backend   | https://my-ecommerce-okowta.fly.dev |
| Admin     | https://my-ecommerce-fawn-ten.vercel.app/admin/login |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand |
| Backend | Spring Boot 4.1, Java 17, Spring Data JPA, Spring Security |
| Database | PostgreSQL |
| Image Storage | Cloudinary |
| Messaging | WhatsApp Business Cloud API |
| Deployment | Vercel (frontend), Fly.io (backend) |

## Features

### Customer
- Browse products on the home page
- Add items to cart (saved in browser with Zustand)
- Checkout with name, phone, and delivery address
- Order confirmation via WhatsApp
- Customer register and login

### Admin
- Login at `/admin/login`
- View product and order counts
- Add products with image upload (Cloudinary)
- Delete products (soft delete — hidden from store, order history kept)
- View all customer orders

### Backend
- REST API for products, orders, auth, and file upload
- Stock validation and automatic stock reduction on order
- WhatsApp order confirmation messages
- WhatsApp webhook for auto-replies

## Project Structure

```
ecommerce-project/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/       # Controllers, services, entities
│   ├── src/main/resources/  # application.properties
│   ├── Dockerfile
│   └── fly.toml
└── frontend/                # Next.js app
    ├── app/                 # Pages (home, cart, checkout, admin)
    ├── components/          # Navbar
    ├── services/api.ts      # Axios API client
    └── store/cartStore.ts   # Cart state
```

## Prerequisites

- **Java 17**
- **Node.js 18+**
- **PostgreSQL** database
- **Cloudinary** account (for product images)
- **WhatsApp Business API** credentials (optional, for notifications)
- **Fly.io CLI** (for backend deploy)
- **Vercel account** (for frontend deploy)

---

## Local Development

### 1. Backend

```bash
cd backend
```

Set environment variables (or create a local `.env` / run config):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL JDBC URL |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `CLOUDINARY_URL` | Cloudinary connection URL |
| `WHATSAPP_ACCESS_TOKEN` | Meta WhatsApp API token |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID |

Run the backend:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

Backend runs at: **http://localhost:8080**

Health check: **http://localhost:8080/health**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

Update the API URL in `frontend/services/api.ts` if needed:

```ts
baseURL: "http://localhost:8080/api"   // local
// baseURL: "https://my-ecommerce-okowta.fly.dev/api"   // production
```

### 3. CORS (important for local dev)

The backend allows requests from the Vercel frontend by default. To use **localhost**, add `http://localhost:3000` to the allowed origins in:

- `backend/src/main/java/com/ecommerce/backend/WebConfig.java`

---

## Admin Login

A default admin account is created automatically on first startup:

| Field | Value |
|-------|-------|
| Email | `admin@company.com` |
| Password | `Admin@123` |

**Admin URL:** `/admin/login`

> Change the default admin password after first login in production.

---

## Customer Login

| Page | URL |
|------|-----|
| Register | `/register` |
| Login | `/login` |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List active products |
| GET | `/api/products/count` | Product count |
| POST | `/api/products` | Create product |
| DELETE | `/api/products/{id}` | Soft delete product |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/count` | Order count |
| POST | `/api/auth/register` | Register customer |
| POST | `/api/auth/login` | Login |
| POST | `/api/upload` | Upload product image |
| GET | `/api/whatsapp/webhook` | WhatsApp webhook verify |
| POST | `/api/whatsapp/webhook` | WhatsApp incoming messages |
| GET | `/health` | Health check |

---

## Deployment

### Backend (Fly.io)

```bash
cd backend
fly deploy
```

Set secrets on Fly.io:

```bash
fly secrets set DATABASE_URL="jdbc:postgresql://..." \
  DATABASE_USERNAME="your_user" \
  DATABASE_PASSWORD="your_password" \
  CLOUDINARY_URL="cloudinary://..." \
  WHATSAPP_ACCESS_TOKEN="your_token" \
  WHATSAPP_PHONE_NUMBER_ID="your_phone_id"
```

### Frontend (Vercel)

1. Connect the `frontend` folder to Vercel
2. Deploy from the `main` branch
3. Ensure `frontend/services/api.ts` points to your Fly.io backend URL

```bash
cd frontend
npm run build
```

---

## WhatsApp Setup

1. Create a Meta WhatsApp Business app
2. Set webhook URL: `https://my-ecommerce-okowta.fly.dev/api/whatsapp/webhook`
3. Verify token: `myecommerce_webhook_2026`
4. Add `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` to Fly.io secrets

After checkout, customers receive an order confirmation on WhatsApp.

---

## Currency

All prices are displayed in **LKR** (Sri Lankan Rupees).

---

## Notes

- **Product delete** uses soft delete. Products linked to past orders are hidden, not removed from the database, so order history stays intact.
- **Product images** are stored on Cloudinary. Always upload images through the admin panel so URLs are saved correctly.
- **Cart** is stored in the browser (`localStorage`) and persists across page refreshes.
- **Stock** is checked and reduced automatically when an order is placed.

---

## Scripts

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend

```bash
./mvnw spring-boot:run    # Run locally
./mvnw clean package      # Build JAR
./mvnw test               # Run tests
```

---

## License

This project is for educational and portfolio use.
