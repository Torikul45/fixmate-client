# FixMate – Smart Device & Home Appliance Repair Service Platform

FixMate is a smart device and home appliance repair service platform that connects customers with professional technicians. Customers can explore repair services, book appointments, track booking status, and securely pay online.

## Key Features

- **User Authentication:** Secure sign-up and sign-in with role-based access for Admin, Technician, and Customer.
- **Service Management:** Browse available repair services and view service details.
- **Booking Management:** Customers can book services, view their bookings, and cancel eligible bookings.
- **Technician Dashboard:** Technicians can manage assigned bookings and accept or reject requests.
- **Payment Integration:** Secure online payments through Stripe Checkout.
- **Payment History:** Customers can view their previous payment records.
- **Role-Based Authorization:** Protected routes and APIs ensure users can access only authorized resources.
- **Responsive Design:** User-friendly interface for desktop, tablet, and mobile devices.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Express.js
- MongoDB
- Stripe
- Sonner
- Lucide React

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection
- Backend server running

### Installation

Clone the repository:

```bash
git clone https://github.com/Torikul45/fixmate-client.git
```

Go to the project directory:

```bash
cd fixmate-client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup

The backend server must be configured and running for API requests, authentication, booking management, and payments to work.

Configure the backend environment variables in the server project before starting it.

## Test Credentials

Add your verified test account credentials here before submission.

| Role         | Email               | Password             |
|--------------|---------------------|----------------------|
| Admin        | habibi98@gmail.com  | Provided to examiner |
| Technician 1 | orbin56@gmail.com   | Provided to examiner |
| Technician 2 | mubid1234@gmail.com | Provided to examiner |
| Customer     | nazib23@gmail.com   | Provided to examiner |

## Live Website

To be added after production deployment.

## Important Notes

- Never commit `.env` or `.env.local` files.
- Keep API keys and secret credentials private.
- Stripe test payments require valid Stripe test configuration.

