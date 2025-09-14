sudo -u $USER createdb treenity
sudo -u $USER psql -c "create user treenity with encrypted password '123456';"
sudo -u $USER psql -c "grant all privileges on database treenity to treenity;"
sudo -u $USER psql -c "ALTER DATABASE treenity OWNER TO treenity;"
sudo -u $USER psql -c "GRANT ALL ON SCHEMA public TO treenity;"
