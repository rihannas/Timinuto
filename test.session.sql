-- @block
create table UserInfo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(225) NOT NULL UNIQUE,
    username VARCHAR(225),
    userpass INT
);
