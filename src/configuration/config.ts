export default {
  port: process.env.PORT || 3000,
  folderStorage: process.env.URL_STORAGE || './storage',
  pictureQuality: process.env.PICTURE_QUALITY || 80,
  secretKey: process.env.SECRETKEY || 'f5ccc0f3-cbb6-4788-b4c8-403c22cd110f',
  publicRoutes: process.env.PUBLICROUTES || [
    '/users/create',
    '/users/auth',
    '/services/auth',
    '/customers/auth',
    '/customers/create',
    '/services/create',
    'storage',
    'address'
  ]
  // 7b116bd7-a0a6-448d-ab9d-1c3beb064cc6
}