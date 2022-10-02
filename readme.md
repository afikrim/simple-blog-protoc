# Simple Blog Protoc Node

This project is a simple example for implementing protocol buffer in your application. We usually have a folder to save our proto files and we generate the proto file in our client and server.

## How to use

Before using this example, you must fulfill the prerequisites first.

### Prerequisite

- Install protobuffer latest in your system
- Install protobuffer-javascript in your system

OR

- Install protobuffer version 3.19.x in your system

After installing all prerequisites, you can prepare the db first for the server by using this sql to create the database and its tables

```sql
CREATE DATABASE blog

CREATE TABLE post (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

After creating your db, don't forget to create an .env file with this configuration

```env
GRPC_PORT=

BLOG_MYSQL_HOST=
BLOG_MYSQL_PORT=
BLOG_MYSQL_USER=
BLOG_MYSQL_PASSWORD=
BLOG_MYSQL_DATABASE=

DEBUG_MODE=
```

After all the setup done, we can just start installing the packages and generating the proto files. You can create the proto files by using this command (NOTE: Please make sure to run this command inside the client or the server folder and don't forget to change the PROTOC_GEN_JS_PATH to your local path)

```bash
# bash <sh_path> <protoc_path>
bash scripts/generate.sh ../protoc
```

After the scripts is run completely, you can start serving the server or the client.
