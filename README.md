# API using MongoDB for CRUD systems

API example using MongoDB with the main methods for managing users, such as: add, remove, edit...

## 📖 | How to use

Let's start by configuring the `.env` file with the credentials. Ex.:
```env
DBNAME="augjdev"
URI="mongodb+srv://<username>:<password>@<cluester>.18kgsba.mongodb.net/?retryWrites=true&w=majority"
jwtKey="your-jwt-secret-key"
```

Then, download all necessaries npms to run the code. Ex.:
```bash
npm i
```

After the download, start the server to receive the requests. Ex.:
```bash
npm start
```

## ⚙️ | How it works

The code works mostly with the endpoint `"/login"`. This endpoint check if the user exists in the database and return a token.

This token is used for call the others functions, like `/addValues`, `/remValues`, `/editValues`.

Database functions **can only be called after login** and with the token generated through **JWT**, thus preventing certain attacks.

To avoid mass spam of Requests from the same IP, I made a simple block that every 3 invalid requests, the IP is blocked until the database administrator deletes it from the list.

### Example Using Postman:
Getting the Token
![](https://media.discordapp.net/attachments/873959321376018462/1130372196779425833/image.png)

Getting User from DB
![](https://cdn.discordapp.com/attachments/873959321376018462/1130377600548741120/image.png)

If you want get an especify user, add the param: `[ field | value ]`
![](https://cdn.discordapp.com/attachments/873959321376018462/1130378270274240532/image.png)

## 🖥️ | Visit my CRUD Repo

This API was created for my [CRUD](https://github.com/AugustoJDev/php-crud), and adapted to use MongoDB instead of MySQL.

To see the version using MySQL, visit an old version of the [CRUD](https://github.com/AugustoJDev/php-crud) repository, as the codes will still be functional there.

**Why did I make this change?** Because I'm more adapted to a non-relational database than a relational one.
