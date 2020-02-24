## 安装
```
// 从github 拉取最新的代码
git clone https://github.com/oceango/skeleton demo

// 初始化 go mod
go mod init demo
```


## 配置路由

``` go
// route
package main

import (
	"demo/controller"
)

func GetRoutes(router *OceanRoute) *OceanRoute {
	router.Post("/auth/login", controller.NewUserController().Login)
	router.Post("/auth/register", controller.NewUserController().Register)
	router.Get("/auth/info",controller.NewUserController().Info)
	router.Get("/welcome", controller.NewUserController().Welcome)
	return router
}
```

修改中间件引入的路径
```
// router.go

import middlewares "github.com/oceango/skeleton/middleware"
改为
import middlewares "demo/middleware"

// middleware/AuthMiddleware.go

import "github.com/oceango/skeleton/model"
改为
import "demo/model"
```


## 配置 controller
创建router 对应的controller

``` go
// controller/UserController
package controller

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"demo/model"
	"github.com/oceango/web/db"
	"log"
	"net/http"
	"strconv"
	"time"
)

type UserController struct {
	db *gorm.DB
}

func NewUserController() *UserController {
	return &UserController{db: db.GetDb()}
}

func (c UserController) Welcome(w http.ResponseWriter, r *http.Request)  {

	fmt.Fprintf(w, "welcome")
}

func (c UserController) Info(w http.ResponseWriter, r *http.Request)  {
	user := r.Context().Value("user").(model.User)

	json.NewEncoder(w).Encode(user)
}

func (c UserController) Login(w http.ResponseWriter, r *http.Request)  {
	type Credentials struct {
		Password string `json:"password"`
		Telephone string `json:"telephone"`
	}
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		log.Print(err)
	}
	log.Print(creds)
	telephone := creds.Telephone
	password := creds.Password


	// query user
	var user model.User
	c.db.First(&user, "telephone = ?", telephone)

	if user.Password != password {
		panic("password error")
	}

	mySigningKey := []byte("AllYourBase")

	// Create the Claims
	 jid := strconv.Itoa(user.Id)
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(24 * 7 * time.Hour).Unix(),
		Issuer:    "test",
		Subject: "test",
		Id: jid,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokens, err := token.SignedString(mySigningKey)

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(struct {
		Token string `json:"token"`
		User model.User `json:"user"`
	}{
		Token:tokens,
		User: user,
	})
}

func (c UserController) Register(w http.ResponseWriter, r *http.Request)  {
	type Credentials struct {
		Password string `json:"password"`
		Telephone string `json:"telephone"`
	}
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		panic(err)
	}
	// save user
	user := &model.User{
		Telephone: creds.Telephone,
		Password:  creds.Password,
	}


	c.db.Create(user)

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

```


## 配置数据库
```yaml
# config/application-dev.yml

server:
  port: 1016
log:
  level: debug
datasource:
  driverName: mysql
  host: 127.0.0.1
  port: 3306
  database: testoceango
  username: xxx
  password: xxx

```

创建 users 表
```mysql
create table users (
    id int(11) UNSIGNED AUTO_INCREMENT,
    name varchar(25),
    telephone varchar(11),
    password varchar(255),
    PRIMARY KEY (`id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## 启动并访问路由
```
go build && ./demo
成功启动后 程序监听1016 端口


        ___     ___     ___     ___     ___     ___     ___   
   /\  \   /\  \   /\  \   /\  \   /\__\   /\  \   /\  \  
  /::\  \ /::\  \ /::\  \ /::\  \ /:| _|_ /::\  \ /::\  \ 
 /:/\:\__/:/\:\__/::\:\__/::\:\__/::|/\__/:/\:\__/:/\:\__\
 \:\/:/  \:\ \/__\:\:\/  \/\::/  \/|::/  \:\:\/__\:\/:/  /       http://www.oceango.tech
  \::/  / \:\__\  \:\/  /  /:/  /  |:/  / \::/  / \::/  / 
   \/__/   \/__/   \/__/   \/__/   \/__/   \/__/   \/__/  

        
2020/02/24 16:46:45 application starting...
2020/02/24 16:46:45 application started and listen on port::1016
```

注册用户

![register](/quick-start/register.png)

用户登录

![login](/quick-start/login.png)

查看登录用户信息

![info](/quick-start/info.png)



