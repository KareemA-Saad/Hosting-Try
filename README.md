# PackAndGo 🎒

A modern, fully-featured e-commerce website specializing in bags and travel accessories. Built entirely with vanilla HTML, CSS, and JavaScript to demonstrate fundamental web development skills and best practices.

## 🌟 Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse through various categories of bags and accessories
- **Product Details**: Detailed product pages with specifications and images
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Order Management**: Complete order processing with order history
- **Responsive Design**: Fully responsive across all devices

### 🔐 Authentication & User Management
- **Firebase Authentication**: Secure user registration and login
- **Google OAuth**: Sign in with Google integration
- **Session Management**: Persistent user sessions
- **User Roles**: Admin and customer role-based access control
- **User Profiles**: Personal user account management

### 💳 Payment Integration
- **PayPal Integration**: Secure payment processing
- **Order Tracking**: Complete order history and status tracking

### 📊 Admin Features
- **Admin Dashboard**: Comprehensive admin panel
- **User Management**: Handle user accounts and permissions
- **Product Management**: Add, edit, and manage product inventory

### 🗄️ Database & Storage
- **Firestore Integration**: Real-time NoSQL database for data storage
- **User Data**: Secure storage of user information
- **Cart Persistence**: Shopping cart data across sessions
- **Order History**: Complete transaction records

## 🚀 Live Demo

SOON !! Hosted by firebase or another

## 📁 Project Structure

```
PackAndGo/
├── auth/                   # Authentication pages and logic
├── css/                    # Stylesheets
├── img/                    # Images and assets
├── js/                     # JavaScript files
├── cart.html              # Shopping cart page
├── category.html          # Product category page
├── dashboard.html         # Admin dashboard
├── history.html           # Order history page
├── index.html             # Homepage
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
├── productDetails.html    # Product detail page
├── shop.html              # Main shop page
├── toAddProductsToFirestore.txt  # Data seeding instructions
├── user.html              # User profile page
└── README.md              # Project documentation
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Payment**: PayPal API
- **Hosting**: Firebase Hosting (or your preferred hosting)

## 📋 Prerequisites

Before running this project, make sure you have:

- A modern web browser
- Firebase account and project setup
- PayPal Developer account (for payment integration)
- Basic understanding of HTML, CSS, and JavaScript

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KareemA-Saad/PackAndGo.git
   cd PackAndGo
   ```

2. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Configure authentication providers (Email/Password and Google)
   - Copy your Firebase config and update it in your JavaScript files

3. **PayPal Integration**
   - Create a PayPal Developer account
   - Obtain your PayPal Client ID
   - Configure PayPal settings in your payment JavaScript files

4. **Initial Data Setup**
   - Follow instructions in `toAddProductsToFirestore.txt` to populate your database
   - Add initial product data to Firestore

5. **Install Dependencies**
   ```bash
   npm install
   npm install firebase
   ```

6. **Build and Run the Project**
   ```bash
   # Build the project
   npm run build
   
   # Start development server
   npm run dev
   ```

## 🎯 Learning Objectives

This project was developed as part of the ITI (Information Technology Institute) curriculum to demonstrate:

- **Vanilla JavaScript Mastery**: Building complex functionality without frameworks
- **DOM Manipulation**: Dynamic content creation and management
- **API Integration**: Working with external services (Firebase, PayPal)
- **Responsive Design**: Creating mobile-first, accessible interfaces
- **Authentication Flow**: Implementing secure user authentication
- **Database Operations**: CRUD operations with Firestore
- **State Management**: Handling application state without external libraries
- **E-commerce Patterns**: Common e-commerce functionality implementation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Secure Firebase Authentication
- Protected admin routes
- Input validation and sanitization
- Secure payment processing through PayPal

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kareem A. Saad**
- GitHub: [@KareemA-Saad](https://github.com/KareemA-Saad)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Information Technology Institute (ITI) Egypt for the educational framework
- Firebase team for the excellent backend services
- PayPal for the payment integration
- The open-source community for inspiration and resources

---

⭐ If you found this project helpful, please give it a star on GitHub!

## 🔗 Quick Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [ITI Egypt](https://iti.gov.eg/)
