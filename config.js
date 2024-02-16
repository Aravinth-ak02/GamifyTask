let CONFIG = {};

CONFIG.MONGO_URL = "mongodb://127.0.0.1:27017/gamify";
CONFIG.PORT = 8000;
CONFIG.JWT_SECRET = "gamify128637";

//Admin credentials and details
CONFIG.ADMIN ={};
CONFIG.ADMIN.USERNAME = "Admin";
CONFIG.ADMIN.PASSWORD = "Admin@123";//call baseurl+'admin/register' to create admin login

export { CONFIG }