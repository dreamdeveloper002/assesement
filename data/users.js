import bcrypt from 'bcryptjs'

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    phone: '08030584201',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isCourier: false,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    phone: '08030584202',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isCourier: false,
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '08030584203',
    email: 'jane1@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isCourier: false,
  },
  {
    firstName: 'Janet',
    lastName: 'Doe',
    phone: '08030584204',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isCourier: true,
  },
]

export default users