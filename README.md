# Warehously – Server

## [See the App!](https://warehously.netlify.app/)


## Description

Backend API for **Warehously**, a lightweight Warehouse Management System.  
Handles authentication, inventory, orders, and order lines with role-based access and validation.  

#### [Client Repo here](https://github.com/dillanDataNerd/warehously-client)
#### [Server Repo here](https://github.com/dillanDataNerd/warehously-server)

## Technologies & Libraries used

- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT Authentication  
- bcryptjs  
- CORS  
- Cloudinary for image uploads  

## Backlog Functionalities
- link order statuses to different stages of order fulfilment
- make fulfilled orders read only
- make user role specific validation so only users with the correct credentials can make certain operations

# Client Structure

## User Stories

- **sign up** - As a user I want to sign up so I can manage inventory and orders.  
- **login** - As a user I want to log in and get a token so I can access protected features.  
- **inventory list** - As a user I want to view all inventory items with search and filters.  
- **inventory create/edit** - As a user I want to add or edit items so I can manage my stock.  
- **orders list** - As a user I want to see all orders with their status.  
- **orders create/edit** - As a user I want to create an order add order lines and edit it after.  
- **orders edit** - As a user I want to update order details and track shipment.  
- **logout** - As a user I want to log out so my session is secure.  

## Client Routes

## React Router Routes (React App)
| Path               | Page             | Components         | Permissions              | Behavior                                                      |
| ------------------ | ---------------- | ----------------- | ------------------------ | ------------------------------------------------------------ |
| `/api/`                | Home             |                   | public                   | Starts up the renderly server                         |
| `/api/signup`          | Signup           |                   | anon only `<IsAnon>`     | Signup form, navigate to dashboard after signup              |
| `/api/login`           | Login            |                   | anon only `<IsAnon>`     | Login form, navigate to dashboard after login                |
| `/api/inventory`       | Inventory List   | InventoryTable    | user only `<IsPrivate>`  | Show all inventory items                                     |
| `/api/inventory/:id`   | Inventory Detail | InventoryDetails  | user only `<IsPrivate>`  | Show item detail, edit/delete options                        |
| `/api/orders`          | Orders List      | OrderTable        | user only `<IsPrivate>`  | Show all orders with statuses                                |
| `/api/orders/new`      | New Order        | OrderForm         | user only `<IsPrivate>`  | Create a new order                                           |
| `/api/orders/:id`      | Order Details    | OrderDetails      | user only `<IsPrivate>`  | View and edit order + lines
| `/api/orderLines`     | Order Lines (list)    | —                 | user only `<IsPrivate>`  | Returns all order lines populated with the order and inventory details             |
| `/api/orderLines/:id` | Order Line (detail)   | —                 | user only `<IsPrivate>`  | Returns a single order line by ID                                        |
| `/api/orderLines`     | Order Line (create)   | —                 | user only `<IsPrivate>`  | Creates a new order line `{ quantity, priceEach, order, inventory, … }`  |
| `/api/orderLines/:id` | Order Line (update)   | —                 | user only `<IsPrivate>`  | Updates a line `{ quantity?, priceEach?, inventory?, deliveryDate? }`    |
| `/api/orderLines/:id` | Order Line (delete)   | —                 | user only `<IsPrivate>`  | Deletes a specific order line                                            ||


## Services

- **Auth Service**
  - `auth.login(user)`
  - `auth.signup(user)`
  - `auth.verify()`

- **Inventory Service**
  - `inventory.list(query)`
  - `inventory.detail(id)`
  - `inventory.add(item)`
  - `inventory.update(id, item)`
  - `inventory.delete(id)`

- **Orders Service**
  - `orders.list(status)`
  - `orders.detail(id)`
  - `orders.add(order)`
  - `orders.update(id, order)`
  - `orders.delete(id)`

- **Order Lines Service**
  - `orderLine.add(line)`
  - `orderLine.update(id, line)`
  - `orderLine.delete(id)`

## Context

- `auth.context` – manages user login/logout and token  
- `theme.context` – (optional) app-wide styling  

## Other notes
- Stock levels updated with every transcation to keep an accurate available stock log. 
- Relationship validation called on relevant database operations to maintain data integrity.

### Collaborators

[Dillan](https://github.com/dillanDataNerd)
