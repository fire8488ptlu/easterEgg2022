# EasterFinal

//Ubunutu 20 with node v16 

// install pm2 
$ npm install pm2 -g  
$ pm2 completion install   
$ pm2 ls   
$ pm2 start npm -- run start:prod --   
$ pm2 kill   

// apache2 復活節專屬virtualhost conf 設定
// /etc/apache2/sites-available/easter.conf

<VirtualHost *:80>

    ServerAdmin webmaster@localhost
    ServerName easterblessing.bannerch.org
    ServerAlias easterblessing.bannerch.org
    #DocumentRoot /var/www/html/easter
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

</VirtualHost>

// 啟動proxy 代理模組
sudo a2enmod proxy   
sudo a2enmod proxy_http   
sudo a2enmod proxy_balancer   
sudo a2enmod lbmethod_byrequests   
sudo systemctl restart apache2   

